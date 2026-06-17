import {
  loginUser,
  addUsersService,
  googleLoginService,
  registerUser,
  googleSignUpService,
  signUpDriver,
  processPayment,
} from './service.js';

export const Login = async (req, res, next) => {
  try {
    const data = await loginUser(req.body);
    return res.send({ success: true, message: 'Login successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const addUsers = async (req, res, next) => {
  try {
    await addUsersService(req.body);
    return res.send({ success: true, message: 'Added successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const data = await googleLoginService(req.body);
    return res.send({ success: true, message: 'Login successfully', data });
  } catch (e) {
    res.send({
      success: false,
      message: e.message === 'User Not Found' ? 'User Not Found' : 'non registered email',
    });
  }
};

export const register = async (req, res, next) => {
  try {
    const data = await registerUser(req.body);
    return res.send({ success: true, message: 'Registered successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const googleSignUp = async (req, res, next) => {
  try {
    const data = await googleSignUpService(req.body);
    return res.send({ success: true, data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const signUpUser = async (req, res, next) => {
  try {
    const data = await signUpDriver(req.body, req.files);
    return res.send({ success: true, data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const proceedPayment = async (req, res, next) => {
  try {
    const data = await processPayment(req.body);
    return res.send({ success: true, data });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};
