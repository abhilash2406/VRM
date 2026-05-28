import { jest } from '@jest/globals';
import { addUserValidate } from '../../../api/authentication/validator.js';
import * as controller from '../../../api/authentication/controller.js';

jest.mock('../../../models/users.js', () => ({
  default: {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
  },
}));

jest.mock('../../../models/login.js', () => ({
  default: {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
  },
}));

describe('Authentication Module', () => {
  describe('Validator', () => {
    it('should validate correctly formatted request body for adding a user', async () => {
      const req = {
        body: {
          name: 'John Smith',
          email: 'johnsmith@example.com',
          phoneNumber: '9876543210',
          designation: 'Admin',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await addUserValidate(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should fail if email is invalid', async () => {
      const req = {
        body: {
          name: 'John Smith',
          email: 'invalid-email',
          phoneNumber: '9876543210',
          designation: 'Admin',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await addUserValidate(req, res, next);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe('Controller - Login & SignUp basics', () => {
    it('should contain controller functions', () => {
      expect(controller.Login).toBeDefined();
      expect(controller.SignUp).toBeDefined();
    });
  });
});
