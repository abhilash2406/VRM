import { loginUser, googleLoginService, registerUser, verifyEmailService } from './service.js';
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

/**
 * Handles email verification using OTP.
 * @param {import('express').Request} req - The Express request object containing email and otp in the body.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<Object>} JSON response containing the success status, message, and access token.
 */
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
/**
 * Handles standard user login.
 * @param {import('express').Request} req - The Express request object containing email and password in the body.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<Object>} JSON response containing tokens and user data on success, or an error message on failure.
 */
export const Login = async (req, res, next) => {
  try {
    const data = await loginUser(req.body);

    applyAuthCookies(res, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTtlMs: (process.env.ACCESS_TOKEN_TTL_SECONDS || 900) * 1000,
      refreshTtlMs: (process.env.REFRESH_TOKEN_TTL_SECONDS || 2592000) * 1000,
    });

    const { accessToken, refreshToken, ...userData } = data;

    return res.send({
      success: true,
      message: 'Login successfully',
      accessToken,
      refreshToken,
      data: userData,
    });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Handles login via Google OAuth token.
 * @param {import('express').Request} req - The Express request object containing the Google token in the body.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<Object>} JSON response containing user data and permissions on success.
 */
export const googleLogin = async (req, res, next) => {
  try {
    const data = await googleLoginService(req.body);

    applyAuthCookies(res, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTtlMs: (process.env.ACCESS_TOKEN_TTL_SECONDS || 900) * 1000,
      refreshTtlMs: (process.env.REFRESH_TOKEN_TTL_SECONDS || 2592000) * 1000,
    });

    const { accessToken, refreshToken, ...userData } = data;

    return res.send({
      success: true,
      message: 'Login successfully',
      accessToken,
      refreshToken,
      data: userData,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message === 'User Not Found' ? 'User Not Found' : 'non registered email',
    });
  }
};

/**
 * Handles new user registration.
 * @param {import('express').Request} req - The Express request object containing user details.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<Object>} JSON response containing the registered user data.
 */
export const register = async (req, res, next) => {
  try {
    const data = await registerUser(req.body);
    return res.send({ success: true, message: 'Registered successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};
