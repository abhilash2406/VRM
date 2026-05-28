import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../models/contact.js', () => ({
  default: {
    create: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../modules/mail.js', () => ({
  default: {
    sendMail: jest.fn(),
  },
}));

const { contactValidate } = await import('../../../api/contactManagement/validator.js');
const { setContact } = await import('../../../api/contactManagement/controller.js');
const mail = await import('../../../modules/mail.js');
const contact = await import('../../../models/contact.js');

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
    beforeEach(() => {
      jest.clearAllMocks();
      mail.default.sendMail.mockImplementation((options, callback) => callback(null, { response: 'ok' }));
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

    it('should handle error if user mail sending fails', async () => {
      mail.default.sendMail.mockImplementationOnce((options, callback) => callback(new Error('Mail fail'), null));
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
      // Fails due to 'e is not defined' ReferenceError on line 28 in the controller, caught in outer block
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });

    it('should handle error if admin mail sending fails', async () => {
      // First call (user email) succeeds, second call (admin email) fails
      mail.default.sendMail
        .mockImplementationOnce((options, callback) => callback(null, { response: 'ok' }))
        .mockImplementationOnce((options, callback) => callback(new Error('Admin mail fail'), null));
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
      // Verify both calls to res.send
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: 'message posted successfully' })
      );
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: new Error('Admin mail fail') })
      );
    });

    it('should handle errors in catch block', async () => {
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
