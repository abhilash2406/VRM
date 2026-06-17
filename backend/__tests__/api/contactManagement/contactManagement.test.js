import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../src/models/contact.js', () => ({
  default: {
    create: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/utils/sendEmail.js', () => ({
  default: jest.fn().mockResolvedValue(true),
}));

jest.unstable_mockModule('../../../src/config/winston-config.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

const { contactValidate } = await import('../../../src/api/contactManagement/validator.js');
const { setContact } = await import('../../../src/api/contactManagement/controller.js');
const sendEmails = await import('../../../src/utils/sendEmail.js');
const contact = await import('../../../src/models/contact.js');

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
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('Controller', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      sendEmails.default.mockResolvedValue(true);
      contact.default.create.mockResolvedValue({ id: 1 });
    });

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

    it('should handle error if email sending fails', async () => {
      sendEmails.default.mockRejectedValueOnce(new Error('Mail fail'));
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
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    it('should handle errors in catch block when DB fails', async () => {
      contact.default.create.mockRejectedValue(new Error('Database error'));
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
        expect.objectContaining({ success: false, message: 'Database error' })
      );
    });
  });
});
