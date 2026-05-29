import { logger } from '../../config/winston-config.js';
import Joi from 'joi';

const locationSchema = Joi.object({
  longitude: Joi.string().required(),
  latitude: Joi.string().required(),
});

const routeValidate = async (req, res, next) => {
  logger.info(req.body);
  const schema = Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    locations: Joi.array().items(locationSchema).required(),
  });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};

export { routeValidate };
export default { routeValidate };
