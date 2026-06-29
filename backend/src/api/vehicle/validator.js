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
    manufacturer: Joi.string().required().messages({
      'string.empty': 'Vehicle manufacturer (brand) is required',
      'any.required': 'Vehicle manufacturer (brand) is required',
    }),
    model_name: Joi.string().required().messages({
      'string.empty': 'Vehicle model name is required',
      'any.required': 'Vehicle model name is required',
    }),
    manufacturing_year: Joi.number()
      .integer()
      .min(1900)
      .max(new Date().getFullYear() + 1)
      .required()
      .messages({
        'number.base': 'Manufacturing year must be a number',
        'number.integer': 'Manufacturing year must be a whole number',
        'number.min': 'Manufacturing year must be 1900 or later',
        'any.required': 'Manufacturing year is required',
      }),
    availability_status: Joi.string().valid('available', 'booked', 'maintenance').optional(),
    vehicle_type: Joi.string()
      .valid('two-wheeler', 'four-wheeler', 'heavy-vehicle')
      .required()
      .messages({
        'any.only': 'vehicle_type must be two-wheeler, four-wheeler, or heavy-vehicle',
        'any.required': 'Vehicle type is required',
      }),
    vehicle_subtype: Joi.string()
      .valid(
        'motorcycle',
        'scooter',
        'sedan',
        'suv',
        'mpv',
        'hatchback',
        'truck',
        'mini-bus',
        'full-bus',
        'tempo'
      )
      .optional()
      .messages({
        'any.only': 'Invalid vehicle subtype',
      }),
    seating_capacity: Joi.number().integer().min(1).optional().messages({
      'number.base': 'Seating capacity must be a number',
      'number.integer': 'Seating capacity must be a whole number',
      'number.min': 'Seating capacity must be at least 1',
    }),
    rc_number: Joi.string().optional().allow(null, ''),
    vehicle_photo: Joi.string().optional().allow(null, ''),
    rc_photo: Joi.string().optional().allow(null, ''),
    insurance_expiry: Joi.date().iso().optional().allow(null, ''),
    last_service_date: Joi.date().iso().optional().allow(null, ''),
    next_service_date: Joi.date().iso().optional().allow(null, ''),
  });

  try {
    req.body = await schema.validateAsync(req.body, { abortEarly: true });
    next();
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};

/**
 * Middleware to validate vehicle lifecycle status payload.
 */
export const VehicleStatusValidate = async (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid('ACTIVE', 'BLOCKED', 'INACTIVE', 'DELETED').required().messages({
      'any.required': 'Lifecycle status is required',
      'any.only': 'Lifecycle status must be one of: ACTIVE, BLOCKED, INACTIVE, DELETED',
    }),
  });

  try {
    req.body = await schema.validateAsync(req.body, { abortEarly: true });
    next();
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};

/**
 * Middleware to validate vehicle business availability status payload.
 */
export const VehicleAvailabilityValidate = async (req, res, next) => {
  const schema = Joi.object({
    availability_status: Joi.string()
      .valid('available', 'booked', 'maintenance')
      .required()
      .messages({
        'any.required': 'Availability status is required',
        'any.only': 'Availability status must be one of: available, booked, maintenance',
      }),
  });

  try {
    req.body = await schema.validateAsync(req.body, { abortEarly: true });
    next();
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};
