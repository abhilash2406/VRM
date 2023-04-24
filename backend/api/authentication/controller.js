const users = require('../../models/users');
const login = require('../../models/login');
const designations = require('../../models/designation');
const transporter = require('../../modules/mail');
const Docusign = require('docusign-esign');
const { docusign } = require('../../config');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await login.findOne({ where: { email: email } });

    if (!user)
      return res.send({
        success: false,
        message: 'Invalid email or password',
      });

    if (!(await login.verifyPassword(password, user.password, user.salt)))
      return res.send({
        success: false,
        message: 'Invalid email or password',
      });

    const accessToken = login.generateAuthToken(user);
    const refreshToken = login.generateAuthToken(user);

    const currentUser = await users.findOne({ where: { loginId: user.id } });
    const currentDesignation = await designations.findOne({
      where: { id: user.designationId },
    });
    return res.send({
      success: true,
      message: 'Login successfully',
      data: {
        user: currentUser.name,
        designation: currentDesignation.designation,
        accessToken,
        refreshToken,
      },
    });
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
    var userExist = await login.findOne({ where: { email: req.body.email } });

    if (userExist) {
      res.send({ success: false, message: 'Admin already exist' });
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
    console.log('users', currentUser);
    if (!users) {
      return res.send({
        success: false,
        message: 'User Not Found',
      });
    } else {
      const cUser = await users.findOne({ where: { loginId: currentUser.id } });

      const currentDesignation = await designations.findOne({
        where: { id: currentUser.designationId },
      });
      return res.send({
        success: true,
        message: 'Login successfully',
        data: {
          user: cUser.name,
          designation: currentDesignation.designation,
          accessToken: googleToken,
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

exports.signUpUser = async (req, res, next) => {
  const hashing = async (password) => {
    const salt = await login.generateSalt();
    let newPassword = await login.hashPassword(password, salt);
    return { salt, newPassword };
  };

  console.log('req.body', req.body);

  let { salt, newPassword } = await hashing(req.body.password);
  const designationDetails = await designations.findOne({
    where: { designation: 'Driver' },
  });

  const loginDetails = await login.create({
    email: req.body.email,
    password: newPassword,
    salt,
    designationId: designationDetails.id,
  });

  await users.create({
    name: req.body.first_name,
    phoneNumber: req.body.phoneNumber,
    loginId: loginDetails.id,
  });

  const userData = {
    name : req.body.first_name,
    email:req.body.email,
    phn:req.body.phoneNumber
  }

  const { url, result } = await documentSign(req);
  res.send({
    success: true,
    url: url,
    data:userData
  });
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
