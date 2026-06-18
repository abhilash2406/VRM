import Joi from 'joi';

/**
 * Middleware to validate truck details payload during creation and updates.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const TruckValidate = async (req, res, next) => {
  const schema = Joi.object({
    brand: Joi.string().required(),
    model: Joi.string().required(),
    variant: Joi.string().required(),
    VIN: Joi.string().required(),
    engine_no: Joi.string().required(),
    chassis_no: Joi.string().required(),
    rc_no: Joi.string().required(),
    yrManufacture: Joi.string().required(),
    status: Joi.string().valid('active', 'deactive', 'pending').optional(),
    condition: Joi.string().valid('working', 'not-working').optional(),
  });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};
