import { logger } from '../../config/winston-config.js';
import drivers from '../../models/driver.js';
import trucks from '../../models/truck.js';
import users from '../../models/users.js';
import trips from '../../models/trip.js';
import login from '../../models/login.js';
import routes from '../../models/route.js';
import designations from '../../models/designation.js';
import transactions from '../../models/transaction.js';
import transporter from '../../modules/mail.js';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import session from 'express-session';

export const getDriverDatas = async (req, res, next) => {
  try {
    const data = await drivers.findAll({
      include: [
        {
          model: users,
          include: [
            {
              model: login,
            },
          ],
        },
      ],
    });

    res.send({
      success: true,
      message: 'data fetched ',
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

// add driver by admin
export const addDrivers = async (req, res, next) => {
  try {
    logger.info('req.body', req.body);
    const userExist = await login.findOne({ where: { email: req.body.email } });
    if (userExist) {
      res.send({
        success: false,
        message: 'user already exist with this email',
      });
    } else {
      const driver_exist = await drivers.findAll({
        where: {
          licenseNo: req.body.licenseNo,
        },
      });

      if (driver_exist.length !== 0) {
        res.send({
          success: false,
          message: 'this license is already submitted',
        });
      } else {
        logger.info('hy');

        var randomPassword = Math.random().toString(36).slice(-8);
        const salt = await login.generateSalt();
        req.body.password = await login.hashPassword(randomPassword, salt);
        req.body.salt = salt;

        const newUser = await designations.findOne({
          where: { designation: 'Driver' },
        });
        req.body.designationId = newUser.id;

        const log = await login.create({
          email: req.body.email,
          password: req.body.password,
          salt: req.body.salt,
          designationId: req.body.designationId,
        });
        const user = await users.create({
          name: req.body.name,
          phoneNumber: req.body.phoneNumber,
          loginId: log.id,
        });

        const licenseTypeString = JSON.stringify(req.body.licenseType);
        const driver = await drivers.create({
          licenseNo: req.body.licenseNo,
          licensePhoto: req.files['licensePhoto'][0].path.replace(/^public/, ''),
          userPhoto: req.files['userPhoto'][0].path.replace(/^public/, ''),
          licenseType: licenseTypeString,
          shift: req.body.shift,
          dailyWage: req.body.dailyWage,
          bata: req.body.bata,
          userId: user.id,
          status: 'approved',
        });

        logger.info('driver', driver);
        let mailOptions = {
          to: req.body.email,
          subject: 'Successfully Registered',
          text: `Your username is ${req.body.name} and password is ${randomPassword} to complete your registration procedures`,
        };
        const info = await transporter.sendMail(mailOptions);
        return res.send({
          success: true,
          message: ' driver Added successfully',
        });
      }
    }
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

//update driver

export const updateDriver = async (req, res) => {
  const id = req.params.id;
  logger.info('id', id);
  try {
    const driver_ext = await drivers.findByPk(id);
    // logger.info(driver_ext);
    if (!driver_ext) {
      res.send({
        success: false,
        message: 'this driver not exists',
      });
    } else {
      const user_ext = await users.findByPk(driver_ext.userId);
      // logger.info(user_ext);
      const login_ext = await login.findByPk(user_ext.loginId);
      // logger.info(login_ext);

      await user_ext.update({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
      });
      const licenseTypeString = JSON.stringify(req.body.licenseType);
      await driver_ext.update({
        licenseNo: req.body.licenseNo,
        licensePhoto: req.files['licensePhoto'][0].path.replace(/^public/, ''),
        userPhoto: req.files['userPhoto'][0].path.replace(/^public/, ''),
        licenseType: licenseTypeString,
        shift: req.body.shift,
        dailyWage: req.body.dailyWage,
        bata: req.body.bata,
      });
      res.send({
        success: true,
        message: 'data updated',
      });
    }
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

//view
export const viewDriver = async (req, res) => {
  const id = req.params.id;
  try {
    const drv = await drivers.findOne({
      where: { id: id },
      include: [
        {
          model: users,
          include: [
            {
              model: login,
            },
          ],
        },
        {
          model: trucks,
        },
        {
          model: routes,
        },
      ],
    });

    return res.send({
      success: true,
      message: 'driver fetch successfully',
      data: drv,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
};

//get active drivers

export const fetchActiveDrivers = async (req, res) => {
  logger.info('first');
  try {
    const data = await drivers.findAll({
      where: { status: 'approved' },
      include: [
        {
          model: users,
          include: [
            {
              model: login,
            },
          ],
        },
      ],
    });
    logger.info('data', data);

    res.send({
      success: true,
      message: 'data fetched ',
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

//reject driver
export const rejectDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await drivers.update(
      { status: 'reject' },
      {
        where: {
          id: id,
        },
      }
    );
    res.send({
      success: true,
      message: 'rejected',
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

export const approveDrivers = async (req, res, next) => {
  try {
    logger.info('req.body', req.body);

    const transaction = await transactions.findOne({
      where: { driverId: req.params.id },
    });

    logger.info('first', transaction);
    if (!transaction) {
      res.send({
        success: false,
        message: 'not paid',
      });
    } else {
      const data = await drivers.update(
        {
          status: 'approved',
          dailyWage: req.body.dailyWage,
          bata: req.body.bata,
          shift: req.body.shift,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.send({
        success: true,
        message: 'approved',
      });
    }
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

export const deleteDriver = async (req, res) => {
  const id = req.params.id;
  logger.info('id', id);
  try {
    const driver = await drivers.findByPk(id, {
      include: [{ model: users, onDelete: 'cascade' }],
    });

    if (!driver) {
      res.send({
        success: false,
        message: 'Driver not found',
      });
      return;
    } else {
      const trip = await trips.findOne({
        where: { driverId: id },
      });

      logger.info(trip);

      const user = await users.findOne({
        where: { id: driver.userId },
      });

      logger.info(user);

      const loged = await login.findOne({
        where: { id: user.loginId },
      });

      logger.info(loged);
      await trip.destroy();
      await user.destroy();
      await loged.destroy();
      await driver.destroy();

      res.send({
        success: true,
        message: 'Driver, user, and login records deleted successfully',
      });
    }
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};
