import { logger } from '../../config/winston-config.js';
import Joi from 'joi';

/**
 * Middleware to validate driver payload details during creation or update.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const driverValidate = async (req, res, next) => {
  //   logger.info('re.body', req.body);
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    license_no: Joi.string().required(),
    phone_number: Joi.string().required(),
    license_type: Joi.string().required(),
    shift: Joi.string().required(),
    daily_wage: Joi.string().required(),
    bata: Joi.string().required(),
  });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};
