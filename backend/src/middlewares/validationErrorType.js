import Joi from 'joi';

/**
 * Collection of error classes that represent validation failures.
 */
export const VALIDATION_ERROR_TYPES = [Joi.ValidationError];

/**
 * Formats a Joi ValidationError into an array of simplified error messages.
 * @param {import('joi').ValidationError} err - The Joi validation error object.
 * @returns {Array<{field: string, message: string}>} Array of formatted errors.
 */
export const formatValidationErrors = (err) =>
  err.details.map((detail) => ({
    field: detail.path.join('.'),
    message: detail.message.replace(/"/g, ''),
  }));
