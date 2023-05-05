const Joi = require('joi');

const locationSchema = Joi.object({
  longitude: Joi.string().required(),
  latitude: Joi.string().required(),
});

const tripValidate = async (req, res, next) => {
  console.log(req.body);
  const schema = Joi.object({
    driverId: Joi.string().uuid().required(),
    truckId: Joi.string().uuid().required(),
    routeId: Joi.string().uuid().required(),
  });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};

module.exports = { tripValidate };
