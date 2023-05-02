const Joi = require('joi');

const driverValidate = async (req, res, next) => {
//   console.log('re.body', req.body);
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

module.exports = { driverValidate };
