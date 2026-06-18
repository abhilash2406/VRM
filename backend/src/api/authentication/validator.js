import Joi from 'joi';

/**
 * Middleware to validate adding a new user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const addUserValidate = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().required(),
    designation: Joi.string().required(),
  });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};

/**
 * Middleware to validate user registration payloads.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const registerValidate = async (req, res, next) => {
  const schema = Joi.object({
    first_name: Joi.string().min(2).max(30).required(),
    last_name: Joi.string().min(1).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/)
      .message(
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required(),
    phone_number: Joi.string().required(),
    country_code: Joi.string().optional(),
  });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};

/**
 * Middleware to validate email verification payloads (OTP).
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const verifyEmailValidate = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).pattern(/^\d+$/).required(),
  });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};

/**
 * Middleware to validate login payloads.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const loginValidate = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    phone_number: Joi.string().optional(),
    country_code: Joi.string().optional(),
  })
    .xor('email', 'phone_number')
    .with('email', 'password')
    .with('phone_number', 'country_code')
    .messages({
      'object.xor': 'You must provide either an email or a phone_number, but not both.',
      'object.with':
        'Password is required with email, and country_code is required with phone_number.',
    });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};
export const forgotPasswordValidate = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};

export const verifyResetOtpValidate = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).pattern(/^\d+$/).required(),
  });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};

export const resetPasswordValidate = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).pattern(/^\d+$/).required(),
    password: Joi.string()
      .min(8)
      .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/)
      .message(
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required(),
    confirm_password: Joi.any().valid(Joi.ref('password')).required().messages({
      'any.only': 'Confirm password does not match password',
    }),
  });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};
