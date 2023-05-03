const drivers = require('../../models/driver');
const trucks = require('../../models/truck');
const users = require('../../models/users');
const trips = require('../../models/trip');
const login = require('../../models/login');
const routes = require('../../models/route');
const designations = require('../../models/designation');
const transporter = require('../../modules/mail');
const { Op } = require('sequelize');
const Docusign = require('docusign-esign');
const { docusign } = require('../../config');
const path = require('path');
const fs = require('fs');

const session = require('express-session');

exports.getDriverDatas = async (req, res, next) => {
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

        console.log('driver', driver);
        const { url, result } = await documentSign(req);

        let mailOptions = {
          to: req.body.email,
          subject: 'Successfully Registered',
          text: `Your username is ${req.body.name} and password is ${randomPassword} and  please sign the document using the following link: ${url} to complete your registration procedures`,
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

exports.fetchActiveDrivers = async (req, res) => {
  console.log('first');
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
    console.log('data', data);

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
exports.rejectDriver = async (req, res, next) => {
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

exports.approveDrivers = async (req, res, next) => {
  try {
    console.log('req.body', req.body);
    const data = await drivers.update(
      {
        status: 'approved',
        dailyWage: req.body.dailyWage,
        bata: req.body.bata,
        shift: req.body.shift,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    res.send({
      success: true,
      message: 'approved',
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

exports.presentDrivers = async (req, res, next) => {
  console.log('first');
};

//docusign functions

async function documentSign(req) {
  await checkToken(req);
  let envelopesApi = getEnvelopesApi(req);
  // console.log('envelopesApi', envelopesApi)
  let envelope = makeEnvelope(req);
  // console.log('envelopes', envelope);

  let result = await envelopesApi.createEnvelope(docusign.accountId, {
    envelopeDefinition: envelope,
  });
  // console.log('ENVELOPE RESULT', result);

  let viewRequest = makeRecipientViewRequest(req.body.name, req.body.email);
  // console.log('viewRequest', viewRequest);
  const { url } = await envelopesApi.createRecipientView(
    docusign.accountId,
    result.envelopeId,
    { recipientViewRequest: viewRequest }
  );
  // console.log('result', result);
  return { result, url };
}

async function checkToken(req) {
  try {
    if (req.session.access_token && Date.now() < req.session.expires_at) {
      console.log('RE USING ACCESS TOKEN', req.session.access_token);
    } else {
      let dsApiClient = new Docusign.ApiClient();
      // console.log('first', dsApiClient);
      dsApiClient.setBasePath(docusign.basePath);
      const results = await dsApiClient.requestJWTUserToken(
        docusign.integrationKey,
        docusign.userId,
        'signature',
        fs.readFileSync(path.join(__dirname, '../../private.key')),
        3600
      );
      // console.log('results', results);
      req.session.access_token = results.body.access_token;
      req.session.expires_at =
        Date.now() + (results.body.expires_in - 60) * 1000;

      req.session.save(function (err) {
        if (err) console.log(err);
      });
    }
    // req.redirect('')
  } catch (error) {
    console.log(error);
  }
}

function getEnvelopesApi(req) {
  let dsApiClient = new Docusign.ApiClient();
  dsApiClient.setBasePath(docusign.basePath);
  dsApiClient.addDefaultHeader(
    'Authorization',
    'Bearer ' + req.session.access_token.trim()
  );
  return new Docusign.EnvelopesApi(dsApiClient);
}

function makeEnvelope(req) {
  let env = new Docusign.EnvelopeDefinition();
  env.templateId = docusign.templateId;
  let text = Docusign.Text.constructFromObject({
    tabLabel: 'Signer Name',
    value: req.body.name,
  });

  // pull together the existing and new tabs ina a tab object
  let tabs = Docusign.Tabs.constructFromObject({
    textTabs: [text],
  });

  let signer1 = Docusign.TemplateRole.constructFromObject({
    email: req.body.email,
    name: req.body.name,
    tabs: tabs,
    clientUserId: docusign.clientUserId,
    roleName: 'Signer',
  });

  env.templateRoles = [signer1];
  env.status = 'sent';

  return env;
}

function makeRecipientViewRequest(name, email) {
  let viewRequest = new Docusign.RecipientViewRequest();

  viewRequest.returnUrl = 'http://localhost:3001/success';
  viewRequest.authenticationMethod = 'none';

  // Recipient info must match embedded recipient info we use to create the envelope
  viewRequest.email = email;
  viewRequest.userName = name;
  viewRequest.clientUserId = docusign.clientUserId;

  return viewRequest;
}

exports.deleteDriver = async (req, res) => {
  const id = req.params.id;
  console.log('id', id);
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

      console.log(trip);

      const user = await users.findOne({
        where: { id: driver.userId },
      });

      console.log(user);

      const loged = await login.findOne({
        where: { id: user.loginId },
      });

      console.log(loged);
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
