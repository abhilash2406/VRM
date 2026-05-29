import { logger } from '../../config/winston-config.js';
import users from '../../models/users.js';
import login from '../../models/login.js';
import designations from '../../models/designation.js';
import permissionSetting from '../../models/permissionSetting.js';
import permissions from '../../models/permission.js';
import drivers from '../../models/driver.js';
import transactions from '../../models/transaction.js';
import transporter from '../../modules/mail.js';
import { stripe } from '../../config/index.js';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import session from 'express-session';
import Brand from '../../models/brand.js';
import TruckModel from '../../models/truckModel.js';
import Variant from '../../models/variant.js';
import trucks from '../../models/truck.js';
import { Op } from 'sequelize';
import StripeClass from 'stripe';
const Stripe = new StripeClass(stripe.secret_key);

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await login.findOne({ where: { email: email } });

    if (!user)
      return res.send({
        success: false,
        message: 'Invalid email or password',
      });

    logger.info('user', user);
    const userDesig = await designations.findOne({
      where: { id: user.designationId },
    });
    logger.info('userDesig', userDesig);
    if (userDesig.designation === 'Driver') {
      const getuser = await users.findOne({
        where: {
          loginId: user.id,
        },
      });
      const currentDriv = await drivers.findOne({
        where: {
          userId: getuser.id,
        },
      });
      logger.info(currentDriv);
      if (currentDriv.status != 'approved')
        res.send({
          success: false,
          message: 'admin approval needed',
        });
      else {
        if (!(await login.verifyPassword(password, user.password, user.salt)))
          return res.send({
            success: false,
            message: 'Invalid email or password',
          });

        const accessToken = login.generateAuthToken(user);
        const refreshToken = login.generateAuthToken(user);

        const currentUser = await users.findOne({
          where: { loginId: user.id },
        });
        const Cuser = await login.findByPk(user.id); // assuming `userId` is the ID of the user you want to update
        await Cuser.update({
          token: accessToken,
        });
        const currentDesignation = await designations.findOne({
          where: { id: user.designationId },
        });

        const permission_data = await permissionSetting.findAll({
          where: { designationId: user.designationId },
          include: permissions,
        });
        const mappingArray = permission_data.map((data) => {
          return {
            menu: data.permission.menu,
            subMenu: data.permission.subMenu,
          };
        });
        return res.send({
          success: true,
          message: 'Login successfully',
          data: {
            user: currentUser.name,
            designation: currentDesignation.designation,
            accessToken,
            refreshToken,
            permission: mappingArray,
          },
        });
      }
    } else {
      if (!(await login.verifyPassword(password, user.password, user.salt)))
        return res.send({
          success: false,
          message: 'Invalid email or password',
        });

      const accessToken = login.generateAuthToken(user);
      const refreshToken = login.generateAuthToken(user);

      const currentUser = await users.findOne({ where: { loginId: user.id } });
      const Cuser = await login.findByPk(user.id); // assuming `userId` is the ID of the user you want to update
      await Cuser.update({
        token: accessToken,
      });
      const currentDesignation = await designations.findOne({
        where: { id: user.designationId },
      });

      const permission_data = await permissionSetting.findAll({
        where: { designationId: user.designationId },
        include: permissions,
      });
      const mappingArray = permission_data.map((data) => {
        return {
          menu: data.permission.menu,
          subMenu: data.permission.subMenu,
        };
      });
      return res.send({
        success: true,
        message: 'Login successfully',
        data: {
          user: currentUser.name,
          designation: currentDesignation.designation,
          accessToken,
          refreshToken,
          permission: mappingArray,
        },
      });
    }
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

//add users

export const addUsers = async (req, res, next) => {
  try {
    const userExist = await login.findOne({ where: { email: req.body.email } });

    if (userExist) {
      res.send({ success: false, message: 'user already exist' });
    } else {
      // const imagePath = req.file.path.replace(/^public/, '');
      // req.body.image = imagePath;
      var randomPassword = Math.random().toString(36).slice(-8);
      const salt = await login.generateSalt();

      req.body.password = await login.hashPassword(randomPassword, salt);

      req.body.salt = salt;
      const newUser = await designations.findOne({
        where: { id: req.body.designation },
      });

      req.body.designationId = newUser.id;
      const log = await login.create({
        email: req.body.email,
        password: req.body.password,
        salt: req.body.salt,
        designationId: req.body.designationId,
      });

      const data = await users.create({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        // image: req.body.image,
        loginId: log.id,
      });
      let mailOptions = {
        to: req.body.email,
        subject: 'Successfully Registered',
        text: `Your username is ${req.body.name} and password is ${randomPassword}`,
      };

      const info = await transporter.sendMail(mailOptions);
      return res.send({
        success: true,
        message: 'Added successfully',
      });
    }
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

// google login

export const googleLogin = async (req, res, next) => {
  try {
    const googleToken = req.body.token;
    const currentUser = await login.findOne({
      where: { email: req.body.data.data.email },
    });
    // logger.info('users', currentUser);
    if (!users) {
      return res.send({
        success: false,
        message: 'User Not Found',
      });
    } else {
      const cUser = await users.findOne({ where: { loginId: currentUser.id } });

      const Cuser = await login.findByPk(currentUser.id); // assuming `userId` is the ID of the user you want to update
      await Cuser.update({
        token: googleToken,
      });

      const currentDesignation = await designations.findOne({
        where: { id: currentUser.designationId },
      });
      const permission_data = await permissionSetting.findAll({
        where: { designationId: currentUser.designationId },
        include: permissions,
      });
      const mappingArray = permission_data.map((data) => {
        return {
          menu: data.permission.menu,
          subMenu: data.permission.subMenu,
        };
      });
      return res.send({
        success: true,
        message: 'Login successfully',
        data: {
          user: cUser.name,
          designation: currentDesignation.designation,
          accessToken: googleToken,
          permission: mappingArray,
        },
      });
    }
  } catch (e) {
    res.send({
      success: false,
      message: 'non registered email',
    });
  }
};

// sign  up
export const SignUp = async (req, res, next) => {
  try {
    const user = await login.findOne({ where: { email: req.body.email } });

    if (user) {
      return res.send({
        success: false,
        message: 'This user already exists',
      });
    } else {
      res.send({
        success: true,
        data: req.body.email,
      });
    }
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

export const googleSignUp = async (req, res, next) => {
  try {
    const user = await login.findOne({
      where: { email: req.body.data.data.email },
    });

    if (user) {
      return res.send({
        success: false,
        message: 'This user already exists',
      });
    } else {
      res.send({
        success: true,
        data: req.body.data.data.email,
      });
    }
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

//driver sign up

export const signUpUser = async (req, res, next) => {
  logger.info('req.body', req.body);
  logger.info('req.files', req.files);

  const hashing = async (password) => {
    const salt = await login.generateSalt();
    let newPassword = await login.hashPassword(password, salt);
    return { salt, newPassword };
  };

  let { salt, newPassword } = await hashing(req.body.password);
  const designationDetails = await designations.findOne({
    where: { designation: 'Driver' },
  });

  const userExist = await login.findOne({ where: { email: req.body.email } });
  if (userExist) {
    res.send({ success: false, message: 'User already exist' });
  } else {
    const loginDetails = await login.create({
      email: req.body.email,
      password: newPassword,
      salt,
      designationId: designationDetails.id,
    });

    const user = await users.create({
      name: req.body.first_name,
      phoneNumber: req.body.phoneNumber,
      signed: 'Unsigned',
      loginId: loginDetails.id,
    });

    if (req.body.brand && req.body.model) {
      const truck_exist = await trucks.findAll({
        where: {
          [Op.or]: [
            {
              VIN: {
                [Op.like]: `%${req.body.VIN}%`,
              },
            },
            {
              RCNo: {
                [Op.like]: `%${req.body.RCNo}%`,
              },
            },
          ],
        },
      });

      // if (truck_exist.length) {
      //   res.send({
      //     success: false,
      //     message: 'this truck is already added',
      //   });
      // } else {
      const truckBrand = await Brand.findOne({
        where: {
          brandId: req.body.brand,
        },
      });

      const truckModel = await TruckModel.findOne({
        where: {
          modelId: req.body.model,
        },
      });

      const truckVariant = await Variant.findOne({
        where: {
          id: req.body.variant,
        },
      });
      const truckdet = await trucks.create({
        brand: truckBrand.name,
        model: truckModel.name,
        variant: truckVariant.name,
        VIN: req.body.VIN,
        engineNo: req.body.engineNo,
        chassisNo: req.body.chassisNo,
        RCNo: req.body.RCNo,
        yrManufacture: req.body.yrManufacture,
        rcPhoto: req.files['rcPhoto'][0].path.replace(/^public/, ''),
        truckPhoto: req.files['truckPhoto'][0].path.replace(/^public/, ''),
        condition: req.body.condition,
        isActive: true,
        status: req.body.status,
        createdBy: user.id,
      });

      const licenseTypeString = JSON.stringify(req.body.licenseType);
      const driver = await drivers.create({
        licenseNo: req.body.licenseNo,
        licensePhoto: req.files['licensePhoto'][0].path.replace(/^public/, ''),
        userPhoto: req.files['userPhoto'][0].path.replace(/^public/, ''),
        licenseType: licenseTypeString,

        userId: user.id,
        truckId: truckdet.id,
        status: 'pending',
      });
      // }

      const userData = {
        name: req.body.first_name,
        email: req.body.email,
        phn: req.body.phoneNumber,
        wage: 1000,
        driver: driver.id,
      };
      logger.info('userData', userData);

      res.send({
        success: true,
        data: userData,
      });
    } else {
      const licenseTypeString = JSON.stringify(req.body.licenseType);
      const driver = await drivers.create({
        licenseNo: req.body.licenseNo,
        licensePhoto: req.files['licensePhoto'][0].path.replace(/^public/, ''),
        userPhoto: req.files['userPhoto'][0].path.replace(/^public/, ''),
        licenseType: licenseTypeString,

        userId: user.id,
        status: 'pending',
      });
      const userData = {
        name: req.body.first_name,
        email: req.body.email,
        phn: req.body.phoneNumber,
        wage: req.body.dailyWage,
        driver: driver.id,
      };
      logger.info('userData', userData);

      let mailOptions = {
        to: req.body.email,
        subject: 'Successfully Registered',
        text: `Your profile naming ${req.body.first_name} is registered successfully in GOGO-X portal, wait for admin approval `,
      };
      const info = await transporter.sendMail(mailOptions);

      res.send({
        success: true,
        data: userData,
      });
    }
  }
};

export const proceedPayment = async (req, res, next) => {
  try {
    let { id, userData } = req.body;

    logger.info('id', id);
    logger.info('userData', userData);

    const customer = await Stripe.customers.create({
      name: userData.name,
      email: userData.email,
      phone: userData.phn,
    });

    logger.info('customer', customer);
    const date = new Date(); // Create a new Date object
    logger.info('date', date);
    const formattedDate = moment(date).format('YYYY-MM-DD');
    logger.info('fo', formattedDate);
    const transc = await transactions.create({
      name: userData.name,
      email: userData.mail,
      amount: 1000,
      type: 'card',
      date: formattedDate,
      driverId: userData.driver,
    });
    logger.info('transc', transc);

    const intent = await Stripe.paymentIntents.create({
      payment_method: id,
      amount: 10 * 100,
      currency: 'inr',
      confirm: true,
      payment_method_types: ['card'],
    });

    const paymentIntent = await Stripe.paymentIntents.confirm(intent.id, {
      payment_method: id,
    });

    logger.info(paymentIntent);

    return res.send({
      success: true,
      data: paymentIntent,
    });
  } catch (e) {
    res.json({
      success: false,
      message: e,
    });
  }
};
