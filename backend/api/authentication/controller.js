const users = require('../../models/users');
const login = require('../../models/login');
const designation = require('../../models/designation');

exports.Login = async (req, res, next) => {
  try {
    console.log('req.body', req.body);
    const { email, password } = req.body;
    const user = await login.findOne({ where: { email: email } });
    // console.log(user);

    if (!user)
      return res.send({
        success: false,
        message: 'Invalid email or password',
      });

    if (!(await login.verifyPassword(password, user.password, user.salt)))
      return res.send({
        success: false,
        message: 'Invalid  password',
      });

    const accessToken = login.generateAuthToken(user);
    const refreshToken = login.generateAuthToken(user);
    // console.log('first', accessToken);

    const currentUser = await users.findOne({ where: { loginId: user.id } });
    const currentDesignation = await designation.findOne({
      where: { id: user.designationId },
    });
    return res.send({
      success: true,
      message: 'Login successfully',
      data: {
        user: currentUser.name,
        designation: currentDesignation.Designation,
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
