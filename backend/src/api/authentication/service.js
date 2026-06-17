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

const emailVerifyKey = (userId) => `email_verify_${userId}`;

const Stripe = new StripeClass(stripe.secret_key);

export const loginUser = async (data) => {
  const { email, password } = data;
  const user = await users.findOne({ where: { email } });

  if (!user) {
    await loginHistory.create({ userId: null, status: 'FAILED' }).catch(() => {}); // Optional tracking of failed logins without user
    throw new Error('Invalid email or password');
  }

  const userDesig = await designations.findOne({ where: { id: user.designationId } });

  if (userDesig && userDesig.designation === UserType.DRIVER) {
    const currentDriv = await drivers.findOne({ where: { userId: user.id } });

    if (currentDriv && currentDriv.status !== 'approved') {
      throw new Error('admin approval needed');
    }
  }

  if (!(await user.verifyPassword(password))) {
    await loginHistory.create({ userId: user.id, status: 'FAILED' });
    throw new Error('Invalid email or password');
  }

  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateAuthToken(true); // rememberMe?

  await loginHistory.create({
    userId: user.id,
    loginTime: new Date(),
    status: 'SUCCESS',
  });

  const permission_data = await permissionSetting.findAll({
    where: { designationId: user.designationId },
    include: permissions,
  });

  const mappingArray = permission_data.map((p) => ({
    menu: p.permission.menu,
    subMenu: p.permission.subMenu,
  }));

  return {
    user: user.first_name, // 'name' doesn't exist on users
    designation: userDesig ? userDesig.designation : UserType.USER,
    accessToken,
    refreshToken,
    permission: mappingArray,
  };
};

export const addUsersService = async (data) => {
  const userExist = await users.findOne({ where: { email: data.email } });

  if (userExist) {
    throw new Error('user already exist');
  }

  const randomPassword = Math.random().toString(36).slice(-8);

  const newDesignation = await designations.findOne({ where: { id: data.designation } });

  await users.create({
    first_name: data.name,
    phone_number: data.phoneNumber,
    email: data.email,
    password_hash: randomPassword,
    designationId: newDesignation.id,
  });

  const mailOptions = {
    to: data.email,
    subject: 'Successfully Registered',
    text: `Your username is ${data.name} and password is ${randomPassword}`,
  };

  await sendEmails({ mailOptions });
  return true;
};

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
  });

  await redisClient.del(emailVerifyKey(user.id));

  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateAuthToken(true);

  return { accessToken, refreshToken };
};

export const googleLoginService = async (data) => {
  const googleToken = data.token;
  const user = await users.findOne({ where: { email: data.data.data.email } });

  if (!user) {
    throw new Error('User Not Found');
  }

  await loginHistory.create({
    userId: user.id,
    loginTime: new Date(),
    status: 'SUCCESS',
  });

  const currentDesignation = await designations.findOne({ where: { id: user.designationId } });
  const permission_data = await permissionSetting.findAll({
    where: { designationId: user.designationId },
    include: permissions,
  });

  const mappingArray = permission_data.map((p) => ({
    menu: p.permission.menu,
    subMenu: p.permission.subMenu,
  }));

  return {
    user: user.first_name,
    designation: currentDesignation ? currentDesignation.designation : UserType.USER,
    accessToken: googleToken,
    permission: mappingArray,
  };
};

const generateEmailVerificationOtp = async (userId) => {
  const otp = generateOtp();
  await redisClient.set(emailVerifyKey(userId), otp, {
    EX: parseInt(process.env.EMAIL_VERIFY_OTP_TTL_SECONDS || 300, 10),
  });
  return otp;
};

/**
 * Send the verification OTP email. Failures are logged but never thrown —
 * registration must still succeed if Redis or the mailer is unavailable.
 */
const sendVerificationEmail = async (userId, email, fullName) => {
  let otp;
  try {
    otp = await generateEmailVerificationOtp(userId);
  } catch (err) {
    logger.error('Email-verification OTP store failed', {
      requestId: null,
      userId,
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
      userId,
      email,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

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
        designationId: defaultDesignation ? defaultDesignation.id : null,
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

export const googleSignUpService = async (data) => {
  const user = await users.findOne({ where: { email: data.data.data.email } });
  if (user) {
    throw new Error('This user already exists');
  }
  return data.data.data.email;
};

export const signUpDriver = async (data, files) => {
  const designationDetails = await designations.findOne({
    where: { designation: UserType.DRIVER },
  });
  const userExist = await users.findOne({ where: { email: data.email } });

  if (userExist) {
    throw new Error('User already exist');
  }

  const user = await users.create({
    first_name: data.first_name, // it was data.first_name in driver sign up
    phone_number: data.phoneNumber,
    email: data.email,
    password_hash: data.password,
    designationId: designationDetails.id,
  });

  const licenseTypeString = JSON.stringify(data.licenseType);

  if (data.brand && data.model) {
    const truckBrand = await Brand.findOne({ where: { brandId: data.brand } });
    const truckModel = await TruckModel.findOne({ where: { modelId: data.model } });
    const truckVariant = await Variant.findOne({ where: { id: data.variant } });

    const truckdet = await trucks.create({
      brand: truckBrand.name,
      model: truckModel.name,
      variant: truckVariant.name,
      VIN: data.VIN,
      engineNo: data.engineNo,
      chassisNo: data.chassisNo,
      RCNo: data.RCNo,
      yrManufacture: data.yrManufacture,
      rcPhoto: files['rcPhoto'][0].path.replace(/^public/, ''),
      truckPhoto: files['truckPhoto'][0].path.replace(/^public/, ''),
      condition: data.condition,
      isActive: true,
      status: data.status,
      createdBy: user.id,
    });

    const driver = await drivers.create({
      licenseNo: data.licenseNo,
      licensePhoto: files['licensePhoto'][0].path.replace(/^public/, ''),
      userPhoto: files['userPhoto'][0].path.replace(/^public/, ''),
      licenseType: licenseTypeString,
      userId: user.id,
      truckId: truckdet.id,
      status: 'pending',
    });

    return {
      name: data.first_name,
      email: data.email,
      phn: data.phoneNumber,
      wage: 1000,
      driver: driver.id,
    };
  } else {
    const driver = await drivers.create({
      licenseNo: data.licenseNo,
      licensePhoto: files['licensePhoto'][0].path.replace(/^public/, ''),
      userPhoto: files['userPhoto'][0].path.replace(/^public/, ''),
      licenseType: licenseTypeString,
      userId: user.id,
      status: 'pending',
    });

    const mailOptions = {
      to: data.email,
      subject: 'Successfully Registered',
      text: `Your profile naming ${data.first_name} is registered successfully in GOGO-X portal, wait for admin approval `,
    };
    await sendEmails({ mailOptions });

    return {
      name: data.first_name,
      email: data.email,
      phn: data.phoneNumber,
      wage: data.dailyWage,
      driver: driver.id,
    };
  }
};

export const processPayment = async (data) => {
  const { id, userData } = data;

  const customer = await Stripe.customers.create({
    name: userData.name,
    email: userData.email,
    phone: userData.phn,
  });

  const formattedDate = moment(new Date()).format('YYYY-MM-DD');

  await transactions.create({
    name: userData.name,
    email: userData.mail,
    amount: 1000,
    type: 'card',
    date: formattedDate,
    driverId: userData.driver,
  });

  const intent = await Stripe.paymentIntents.create({
    payment_method: id,
    amount: 10 * 100,
    currency: 'inr',
    confirm: true,
    payment_method_types: ['card'],
  });

  return await Stripe.paymentIntents.confirm(intent.id, { payment_method: id });
};
