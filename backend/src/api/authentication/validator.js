import Joi from 'joi';

const addUserValidate = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    designation: Joi.string().required(),
  });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};

const registerValidate = async (req, res, next) => {
  const schema = Joi.object({
    first_name: Joi.string().min(2).max(30).required(),
    last_name: Joi.string().min(1).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/)
      .message(
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required(),
    phone_number: Joi.string().required(),
  });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};

const verifyEmailValidate = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).pattern(/^\d+$/).required(),
  });
  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
};

export { addUserValidate, registerValidate, verifyEmailValidate };
export default { addUserValidate, registerValidate, verifyEmailValidate };
