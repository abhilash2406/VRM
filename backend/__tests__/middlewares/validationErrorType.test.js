import Joi from 'joi';
import {
  VALIDATION_ERROR_TYPES,
  formatValidationErrors,
} from '../../src/middlewares/validationErrorType.js';

describe('Validation Error Type Middleware', () => {
  describe('VALIDATION_ERROR_TYPES', () => {
    it('should include Joi.ValidationError', () => {
      expect(VALIDATION_ERROR_TYPES).toContain(Joi.ValidationError);
    });
  });

  describe('formatValidationErrors', () => {
    it('should correctly format Joi validation errors', () => {
      // Construct a mock Joi error object
      const mockJoiError = {
        details: [
          {
            path: ['user', 'email'],
            message: '"email" must be a valid email',
          },
          {
            path: ['password'],
            message: '"password" length must be at least 8 characters long',
          },
        ],
      };

      const formattedErrors = formatValidationErrors(mockJoiError);

      expect(formattedErrors).toEqual([
        {
          field: 'user.email',
          message: 'email must be a valid email',
        },
        {
          field: 'password',
          message: 'password length must be at least 8 characters long',
        },
      ]);
    });
  });
});
