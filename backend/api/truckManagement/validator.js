import Joi from 'joi';

const TruckValidate = async (req, res, next) => {
  const schema = Joi.object({
    brand: Joi.string().required(),
    model: Joi.string().required(),
    variant: Joi.string().required(),
    VIN: Joi.string().required(),
    engineNo: Joi.string().required(),
    chassisNo: Joi.string().required(),
    RCNo: Joi.string().required(),
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

export { TruckValidate };
export default { TruckValidate };
