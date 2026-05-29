import { logger } from '../../config/winston-config.js';
import Joi from 'joi';

const driverValidate = async (req, res, next) => {
  //   logger.info('re.body', req.body);
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    licenseNo: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    licenseType: Joi.string().required(),
    shift: Joi.string().required(),
    dailyWage: Joi.string().required(),
    bata: Joi.string().required(),
  });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};

export { driverValidate };
export default { driverValidate };
