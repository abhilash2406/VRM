import {
  loginUser,
  addUsersService,
  googleLoginService,
  registerUser,
  googleSignUpService,
  signUpDriver,
  processPayment,
  verifyEmailService,
} from './service.js';
import { setAuthCookies } from '../../utils/cookies.js';
import TokenAudience from '../../common/enum/token-audience-enum.js';

/** Read a named cookie off the request without tripping the `any` from cookie-parser. */
const readCookie = (req, name) => req.cookies?.[name];

/** Persist an issued token pair as the user auth cookies. */
const applyAuthCookies = (res, tokens) => {
  setAuthCookies(res, TokenAudience.USER, {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTtlMs: tokens.accessTtlMs,
    refreshTtlMs: tokens.refreshTtlMs,
  });
};

export const verifyEmail = async (req, res, next) => {
  try {
    const data = await verifyEmailService(req.body);

    applyAuthCookies(res, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTtlMs: (process.env.ACCESS_TOKEN_TTL_SECONDS || 900) * 1000,
      refreshTtlMs: (process.env.REFRESH_TOKEN_TTL_SECONDS || 2592000) * 1000,
    });

    return res.send({ success: true, message: 'Email verified', accessToken: data.accessToken });
  } catch (e) {
    const status = e.message === 'User not found' ? 404 : e.message.includes('Account') ? 403 : 400;
    return res.status(status).send({ success: false, message: e.message });
  }
};
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
