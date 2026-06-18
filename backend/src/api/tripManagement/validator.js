import { logger } from '../../config/winston-config.js';
import Joi from 'joi';

const locationSchema = Joi.object({
  longitude: Joi.string().required(),
  latitude: Joi.string().required(),
});

const tripValidate = async (req, res, next) => {
  logger.info(req.body);
  const schema = Joi.object({
    date: Joi.date().min('1900-01-01').required(),
    driver_id: Joi.string().uuid().required(),
    truck_id: Joi.string().uuid().required(),
    route_id: Joi.string().uuid().required(),
  });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};

export { tripValidate };
export default { tripValidate };
