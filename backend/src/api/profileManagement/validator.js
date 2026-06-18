import Joi from 'joi';

/**
 * Middleware to validate the change-password payload.
 * Expects plain-text oldPassword, newPassword, and confirmPassword.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const changePasswordValidate = async (req, res, next) => {
  const schema = Joi.object({
    oldPassword: Joi.string().required().messages({
      'string.empty': 'Old password is required',
      'any.required': 'Old password is required',
    }),
    newPassword: Joi.string()
      .min(8)
      .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/)
      .message(
        'New password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required(),
    confirmPassword: Joi.any()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Confirm password does not match new password',
        'any.required': 'Confirm password is required',
      }),
  });

  try {
    req.body = await schema.validateAsync(req.body, { abortEarly: true });
    next();
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};
