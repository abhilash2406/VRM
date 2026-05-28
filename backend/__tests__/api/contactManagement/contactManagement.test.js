import { jest } from '@jest/globals';
import { contactValidate } from '../../../api/contactManagement/validator.js';
import { setContact } from '../../../api/contactManagement/controller.js';

jest.mock('../../../models/contact.js', () => ({
  default: {
    create: jest.fn().mockResolvedValue({ id: 1 }),
  },
}));

jest.mock('../../../modules/mail.js', () => ({
  default: {
    sendMail: jest.fn((options, callback) => callback(null, { response: 'ok' })),
  },
}));

describe('Contact Management', () => {
  describe('Validator', () => {
    it('should validate correctly formatted request body', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '1234567890',
          message: 'Hello!',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await contactValidate(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should fail validation if name is too short', async () => {
      const req = {
        body: {
          name: 'Jo',
          email: 'john@example.com',
          phoneNumber: '1234567890',
          message: 'Hello!',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await contactValidate(req, res, next);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe('Controller', () => {
    it('should post message successfully', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '1234567890',
          message: 'Hello!',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await setContact(req, res, next);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: 'message posted successfully' })
      );
    });
  });
});
