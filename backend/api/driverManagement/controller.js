const drivers = require('../../models/driver');
const trucks = require('../../models/truck');
const users = require('../../models/users');
const login = require('../../models/login');
const routes = require('../../models/route')
const designations = require('../../models/designation');
const transporter = require('../../modules/mail');
const { Op } = require('sequelize');

exports.getDriverDatas = async (req, res, next) => {
  try {
    console.log('hy');
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
exports.addDrivers = async (req, res, next) => {
  try {
    // console.log('req.body', req.body);
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
        console.log('hy');

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
       

        const driver = await drivers.create({
          licenseNo: req.body.licenseNo,
          licensePhoto: req.files['licensePhoto'][0].path.replace(
            /^public/,
            ''
          ),
          userPhoto: req.files['userPhoto'][0].path.replace(/^public/, ''),
          licenseType: req.body.licenseType,
          shift: req.body.shift,
          dailyWage: req.body.dailyWage,
          bata: req.body.bata,
          userId: user.id,
          status: 'approved',
        });

        
        let mailOptions = {
          to: req.body.email,
          subject: 'Successfully Registered',
          text: `Your username is ${req.body.name} and password is ${randomPassword}`,
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

//view
exports.viewDriver = async (req, res) => {
  console.log("y")
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
