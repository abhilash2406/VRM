import Joi from 'joi';

/**
 * Middleware to validate vehicle details payload during creation and updates.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const VehicleValidate = async (req, res, next) => {
  const schema = Joi.object({
    registration_number: Joi.string().required().messages({
      'string.empty': 'Registration number is required',
      'any.required': 'Registration number is required',
    }),
    make: Joi.string().required().messages({
      'string.empty': 'Vehicle make (brand) is required',
      'any.required': 'Vehicle make (brand) is required',
    }),
    model_name: Joi.string().required().messages({
      'string.empty': 'Vehicle model name is required',
      'any.required': 'Vehicle model name is required',
    }),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required().messages({
      'number.base': 'Year must be a number',
      'number.integer': 'Year must be a whole number',
      'number.min': 'Year must be 1900 or later',
      'any.required': 'Year of manufacture is required',
    }),
    status: Joi.string().valid('available', 'booked', 'maintenance').optional(),
    insurance_expiry: Joi.date().iso().optional().allow(null, ''),
    last_service_date: Joi.date().iso().optional().allow(null, ''),
    next_service_date: Joi.date().iso().optional().allow(null, ''),
  });

  try {
    req.body = await schema.validateAsync(req.body, { abortEarly: true });
    next();
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};
