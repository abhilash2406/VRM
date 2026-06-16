import login from '../../models/login.js';
import users from '../../models/users.js';
import designations from '../../models/designation.js';
import permissionSetting from '../../models/permissionSetting.js';
import permissions from '../../models/permission.js';
import drivers from '../../models/driver.js';
import transactions from '../../models/transaction.js';
import transporter from '../../modules/mail.js';
import { stripe } from '../../config/index.js';
import moment from 'moment';
import Brand from '../../models/brand.js';
import TruckModel from '../../models/truckModel.js';
import Variant from '../../models/variant.js';
import trucks from '../../models/truck.js';
import { Op } from 'sequelize';
import StripeClass from 'stripe';
import { logger } from '../../config/winston-config.js';

const Stripe = new StripeClass(stripe.secret_key);

export const loginUser = async (data) => {
  const { email, password } = data;
  const user = await login.findOne({ where: { email } });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const userDesig = await designations.findOne({ where: { id: user.designationId } });
  
  if (userDesig.designation === 'Driver') {
    const getuser = await users.findOne({ where: { loginId: user.id } });
    const currentDriv = await drivers.findOne({ where: { userId: getuser.id } });

    if (currentDriv.status !== 'approved') {
      throw new Error('admin approval needed');
    }
  }

  if (!(await login.verifyPassword(password, user.password, user.salt))) {
    throw new Error('Invalid email or password');
  }

  const accessToken = login.generateAuthToken(user);
  const refreshToken = login.generateAuthToken(user);

  const currentUser = await users.findOne({ where: { loginId: user.id } });
  const Cuser = await login.findByPk(user.id);
  await Cuser.update({ token: accessToken });

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
    user: currentUser.name,
    designation: currentDesignation.designation,
    accessToken,
    refreshToken,
    permission: mappingArray,
  };
};

export const addUsersService = async (data) => {
  const userExist = await login.findOne({ where: { email: data.email } });

  if (userExist) {
    throw new Error('user already exist');
  }

  const randomPassword = Math.random().toString(36).slice(-8);
  const salt = await login.generateSalt();
  const hashedPassword = await login.hashPassword(randomPassword, salt);

  const newUser = await designations.findOne({ where: { id: data.designation } });

  const log = await login.create({
    email: data.email,
    password: hashedPassword,
    salt,
    designationId: newUser.id,
  });

  await users.create({
    name: data.name,
    phoneNumber: data.phoneNumber,
    loginId: log.id,
  });

  const mailOptions = {
    to: data.email,
    subject: 'Successfully Registered',
    text: `Your username is ${data.name} and password is ${randomPassword}`,
  };

  await transporter.sendMail(mailOptions);
  return true;
};

export const googleLoginService = async (data) => {
  const googleToken = data.token;
  const currentUser = await login.findOne({ where: { email: data.data.data.email } });

  if (!currentUser) {
    throw new Error('User Not Found');
  }

  const cUser = await users.findOne({ where: { loginId: currentUser.id } });
  const Cuser = await login.findByPk(currentUser.id);
  await Cuser.update({ token: googleToken });

  const currentDesignation = await designations.findOne({ where: { id: currentUser.designationId } });
  const permission_data = await permissionSetting.findAll({
    where: { designationId: currentUser.designationId },
    include: permissions,
  });

  const mappingArray = permission_data.map((p) => ({
    menu: p.permission.menu,
    subMenu: p.permission.subMenu,
  }));

  return {
    user: cUser.name,
    designation: currentDesignation.designation,
    accessToken: googleToken,
    permission: mappingArray,
  };
};

export const registerUser = async (data) => {
  const { email, password, first_name, last_name, phone_number } = data;

  const user = await login.findOne({ where: { email } });
  if (user) {
    throw new Error('This user already exists');
  }

  const salt = await login.generateSalt();
  const hashedPassword = await login.hashPassword(password, salt);

  let defaultDesignation = await designations.findOne({ where: { designation: 'User' } });
  if (!defaultDesignation) {
    defaultDesignation = await designations.findOne();
  }

  const newLogin = await login.create({
    email,
    password: hashedPassword,
    salt,
    designationId: defaultDesignation ? defaultDesignation.id : null,
  });

  const newUser = await users.create({
    first_name,
    last_name,
    phone_number,
    email,
    password_hash: hashedPassword,
    loginId: newLogin.id,
  });

  return {
    id: newUser.id,
    email: newUser.email,
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    phone_number: newUser.phone_number,
  };
};

export const googleSignUpService = async (data) => {
  const user = await login.findOne({ where: { email: data.data.data.email } });
  if (user) {
    throw new Error('This user already exists');
  }
  return data.data.data.email;
};

export const signUpDriver = async (data, files) => {
  const salt = await login.generateSalt();
  const newPassword = await login.hashPassword(data.password, salt);
  
  const designationDetails = await designations.findOne({ where: { designation: 'Driver' } });
  const userExist = await login.findOne({ where: { email: data.email } });

  if (userExist) {
    throw new Error('User already exist');
  }

  const loginDetails = await login.create({
    email: data.email,
    password: newPassword,
    salt,
    designationId: designationDetails.id,
  });

  const user = await users.create({
    name: data.first_name,
    phoneNumber: data.phoneNumber,
    signed: 'Unsigned',
    loginId: loginDetails.id,
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
    await transporter.sendMail(mailOptions);

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
