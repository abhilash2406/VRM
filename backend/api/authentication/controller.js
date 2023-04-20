const users = require('../../models/users');
const login = require('../../models/login');
const designations = require('../../models/designation');
const transporter = require('../../modules/mail');

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
