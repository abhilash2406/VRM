import loginHistory from '../../models/loginHistory.js';
import { UserType } from '../../common/enum/user-type-enum.js';
import users from '../../models/users.js';
import designations from '../../models/designation.js';
import permissionSetting from '../../models/permissionSetting.js';
import permissions from '../../models/permission.js';
import drivers from '../../models/driver.js';
import transactions from '../../models/transaction.js';
import sendEmails from '../../utils/sendEmail.js';
import { stripe } from '../../config/index.js';
import moment from 'moment';
import Brand from '../../models/brand.js';
import TruckModel from '../../models/truckModel.js';
import Variant from '../../models/variant.js';
import trucks from '../../models/truck.js';
import { Op } from 'sequelize';
import sequelize from '../../config/sequelize-config.js';
import StripeClass from 'stripe';
import { logger } from '../../config/winston-config.js';
import { redisClient } from '../../config/redis-config.js';
import { generateOtp, verifyOtp } from '../../utils/otp.js';
import BadRequest from '../../common/exceptions/badRequest.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const emailVerifyKey = (user_id) => `email_verify_${user_id}`;

const Stripe = new StripeClass(stripe.secret_key);

/**
 * Authenticates a user with email and password.
 * @param {Object} data - The login payload.
 * @param {string} data.email - The user's email.
 * @param {string} data.password - The user's password.
 * @returns {Promise<Object>} An object containing the user's name, designation, tokens, and permissions.
 * @throws {Error} If credentials are invalid, or if the account is blocked/needs approval.
 */
export const loginUser = async (data) => {
  const { email, password } = data;
  const user = await users.findOne({ where: { email } });

  if (!user) {
    throw new BadRequest('Invalid email or password');
  }

  if (user.status === 'BLOCKED') {
    throw new BadRequest('your account is blocked. please contact admin');
  }

  const userDesig = await designations.findOne({ where: { id: user.designation_id } });

  if (userDesig && userDesig.designation === UserType.DRIVER) {
    const currentDriv = await drivers.findOne({ where: { user_id: user.id } });

    if (currentDriv && currentDriv.status !== 'approved') {
      throw new Error('admin approval needed');
    }
  }

  if (!(await user.verifyPassword(password))) {
    await loginHistory.create({ user_id: user.id, login_status: 'FAILED' });
    throw new Error('Invalid email or password');
  }

  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateAuthToken(true); // rememberMe?

  await loginHistory.create({
    user_id: user.id,
    login_time: new Date(),
    login_status: 'SUCCESS',
  });

  const updateData = { last_login: new Date() };
  if (user.status === 'INACTIVE') {
    updateData.status = 'ACTIVE';
  }
  await user.update(updateData);

  const permission_data = await permissionSetting.findAll({
    where: { designation_id: user.designation_id },
    include: permissions,
  });

  const mappingArray = permission_data.map((p) => ({
    menu: p.permission.menu,
    sub_menu: p.permission.sub_menu,
  }));

  return {
    user: user.first_name, // 'name' doesn't exist on users
    designation: userDesig ? userDesig.designation : UserType.USER,
    accessToken,
    refreshToken,
    permission: mappingArray,
  };
};

/**
 * Verifies a user's email using an OTP.
 * @param {Object} data - The verification payload.
 * @param {string} data.email - The user's email.
 * @param {string} data.otp - The one-time password sent to the user.
 * @returns {Promise<Object>} An object containing the new access and refresh tokens.
 * @throws {Error} If the user is not found, OTP is invalid, or account is blocked.
 */
export const verifyEmailService = async (data) => {
  const { email, otp } = data;

  const user = await users.findOne({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  const storedOtp = await redisClient.get(emailVerifyKey(user.id));
  if (!storedOtp || !verifyOtp(otp, storedOtp)) {
    throw new Error('Invalid or expired verification code');
  }

  if (user.status === 'BLOCKED' || user.status === 'DELETED') {
    throw new Error('This account is blocked or deleted');
  }

  await user.update({
    status: 'ACTIVE',
    email_verified: true,
    last_login: new Date(),
  });

  await redisClient.del(emailVerifyKey(user.id));

  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateAuthToken(true);

  return { accessToken, refreshToken };
};

/**
 * Authenticates a user using a Google OAuth token.
 * @param {Object} data - The Google login payload.
 * @param {string} data.token - The Google access token.
 * @param {Object} data.data.data - Nested object containing the user's Google email.
 * @returns {Promise<Object>} An object containing the user's name, designation, access token, and permissions.
 * @throws {Error} If the user is not found.
 */
export const googleLoginService = async (data) => {
  const googleToken = data.token;

  const ticket = await googleClient.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const googleEmail = payload.email;

  const user = await users.findOne({ where: { email: googleEmail } });

  if (!user) {
    throw new Error('User Not Found');
  }

  await loginHistory.create({
    user_id: user.id,
    login_time: new Date(),
    login_status: 'SUCCESS',
  });

  const updateData = { last_login: new Date() };
  if (user.status === 'INACTIVE') {
    updateData.status = 'ACTIVE';
  }
  await user.update(updateData);

  const currentDesignation = await designations.findOne({ where: { id: user.designation_id } });
  const permission_data = await permissionSetting.findAll({
    where: { designation_id: user.designation_id },
    include: permissions,
  });

  const mappingArray = permission_data.map((p) => ({
    menu: p.permission.menu,
    sub_menu: p.permission.sub_menu,
  }));

  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateAuthToken(true);

  return {
    user: user.first_name,
    designation: currentDesignation ? currentDesignation.designation : UserType.USER,
    accessToken,
    refreshToken,
    permission: mappingArray,
  };
};

/**
 * Generates an OTP for email verification and stores it in Redis.
 * @param {string} user_id - The UUID of the user.
 * @returns {Promise<string>} The generated OTP string.
 */
const generateEmailVerificationOtp = async (user_id) => {
  const otp = generateOtp();
  await redisClient.set(emailVerifyKey(user_id), otp, {
    EX: parseInt(process.env.EMAIL_VERIFY_OTP_TTL_SECONDS || 300, 10),
  });
  return otp;
};

/**
 * Send the verification OTP email. Failures are logged but never thrown —
 * registration must still succeed if Redis or the mailer is unavailable.
 */
const sendVerificationEmail = async (user_id, email, fullName) => {
  let otp;
  try {
    otp = await generateEmailVerificationOtp(user_id);
  } catch (err) {
    logger.error('Email-verification OTP store failed', {
      requestId: null,
      user_id,
      email,
      error: err instanceof Error ? err.message : String(err),
    });
    return;
  }

  try {
    await sendEmails({
      mailOptions: { to: email, subject: 'Verify Your Email' },
      fileName: 'verify-email.ejs',
      contentVariables: {
        name: fullName,
        otp,
        expireHours: process.env.VERIFICATION_EXPIRE_HOURS || 24,
      },
    });
  } catch (err) {
    logger.error('Verification email send failed', {
      requestId: null,
      user_id,
      email,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

/**
 * Registers a new user into the system.
 * @param {Object} data - The registration payload.
 * @param {string} data.email - The user's email address.
 * @param {string} data.password - The user's raw password.
 * @param {string} data.first_name - The user's first name.
 * @param {string} [data.last_name] - The user's last name.
 * @param {string} [data.phone_number] - The user's phone number.
 * @returns {Promise<Object>} The newly created user's basic details.
 * @throws {Error} If the user already exists or the account is blocked/deleted.
 */
export const registerUser = async (data) => {
  const { email, password, first_name, last_name, phone_number } = data;

  return await sequelize.transaction(async (t) => {
    const user = await users.findOne({ where: { email }, transaction: t });
    if (user) {
      if (user.status === 'BLOCKED') {
        throw new Error('This account is blocked. Please contact support.');
      } else if (user.status === 'DELETED') {
        throw new Error('This account was deleted.');
      }
      throw new Error('This user already exists');
    }

    let defaultDesignation = await designations.findOne({
      where: { designation: UserType.USER },
      transaction: t,
    });
    if (!defaultDesignation) {
      defaultDesignation = await designations.findOne({ transaction: t });
    }

    const newUser = await users.create(
      {
        first_name,
        last_name,
        phone_number,
        email,
        password_hash: password,
        designation_id: defaultDesignation ? defaultDesignation.id : null,
      },
      { transaction: t }
    );

    // Generate and send verification email
    await sendVerificationEmail(newUser.id, email, `${first_name} ${last_name || ''}`);

    return {
      id: newUser.id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      phone_number: newUser.phone_number,
    };
  });
};
