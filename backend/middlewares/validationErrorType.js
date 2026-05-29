import Joi from 'joi';

export const VALIDATION_ERROR_TYPES = [Joi.ValidationError];

export const formatValidationErrors = (err) =>
  err.details.map((detail) => ({
    field: detail.path.join('.'),
    message: detail.message.replace(/"/g, ''),
  }));
