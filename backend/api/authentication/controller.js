const users = require('../../models/users');
const login = require('../../models/login');
const designations = require('../../models/designation');
const permissionSetting = require('../../models/permissionSetting');
const permissions = require('../../models/permission');
const drivers = require('../../models/driver');
const transactions = require('../../models/transaction');
const transporter = require('../../modules/mail');
const Docusign = require('docusign-esign');
const { docusign, stripe } = require('../../config');
const fs = require('fs');
const moment = require('moment');
const path = require('path');
const session = require('express-session');
const Brand = require('../../models/brand');
const TruckModel = require('../../models/truckModel');
const Variant = require('../../models/variant');
const trucks = require('../../models/truck');
const { Op } = require('sequelize');
const Stripe = require('stripe')(stripe.secret_key);

exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await login.findOne({ where: { email: email } });

    if (!user)
      return res.send({
        success: false,
        message: 'Invalid email or password',
      });

    console.log('user', user);
    const userDesig = await designations.findOne({
      where: { id: user.designationId },
    });
    console.log('userDesig', userDesig);
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
      console.log(currentDriv);
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

exports.addUsers = async (req, res, next) => {
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

exports.googleLogin = async (req, res, next) => {
  try {
    const googleToken = req.body.token;
    const currentUser = await login.findOne({
      where: { email: req.body.data.data.email },
    });
    // console.log('users', currentUser);
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
exports.SignUp = async (req, res, next) => {
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

exports.googleSignUp = async (req, res, next) => {
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

exports.signUpUser = async (req, res, next) => {
  console.log('req.body', req.body);
  console.log('req.files', req.files);

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

      const driver = await drivers.create({
        licenseNo: req.body.licenseNo,
        licensePhoto: req.files['licensePhoto'][0].path.replace(/^public/, ''),
        userPhoto: req.files['userPhoto'][0].path.replace(/^public/, ''),
        licenseType: req.body.licenseType,

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
      console.log('userData', userData);

      const { url, result } = await documentSign(req);
      res.send({
        success: true,
        url: url,
        data: userData,
      });
    } else {
      const driver = await drivers.create({
        licenseNo: req.body.licenseNo,
        licensePhoto: req.files['licensePhoto'][0].path.replace(/^public/, ''),
        userPhoto: req.files['userPhoto'][0].path.replace(/^public/, ''),
        licenseType: req.body.licenseType,

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
      console.log('userData', userData);

      const { url, result } = await documentSign(req);
      let mailOptions = {
        to: req.body.email,
        subject: 'Successfully Registered',
        text: `Your profile naming ${req.body.first_name} is registered successfully in GOGO-X portal `,
      };
      const info = await transporter.sendMail(mailOptions);

      res.send({
        success: true,
        url: url,
        data: userData,
      });
    }
  }
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

  let viewRequest = makeRecipientViewRequest(
    req.body.first_name,
    req.body.email
  );
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
    value: req.body.first_name,
  });

  // pull together the existing and new tabs ina a tab object
  let tabs = Docusign.Tabs.constructFromObject({
    textTabs: [text],
  });

  let signer1 = Docusign.TemplateRole.constructFromObject({
    email: req.body.email,
    name: req.body.first_name,
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

  viewRequest.returnUrl = 'http://localhost:3001/payment';
  viewRequest.authenticationMethod = 'none';

  // Recipient info must match embedded recipient info we use to create the envelope
  viewRequest.email = email;
  viewRequest.userName = name;
  viewRequest.clientUserId = docusign.clientUserId;

  return viewRequest;
}

exports.proceedPayment = async (req, res, next) => {
  try {
    let { id, userData } = req.body;

    console.log('id', id);
    console.log('userData', userData);

    const customer = await Stripe.customers.create({
      name: userData.name,
      email: userData.email,
      phone: userData.phn,
    });

    // console.log('customer', customer);
    const date = new Date(); // Create a new Date object
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const transc = await transactions.create({
      amount: 1000,
      type: 'card',
      date: formattedDate,
      driverId: userData.driver,
    });
    // console.log('transc', transc);

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

    // console.log(paymentIntent);

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
