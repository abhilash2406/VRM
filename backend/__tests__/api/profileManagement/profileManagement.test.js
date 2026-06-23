import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

jest.unstable_mockModule('../../../src/models/users.js', () => ({
  default: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/models/designation.js', () => ({
  default: {
    findByPk: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/models/permissionSetting.js', () => ({
  default: {
    findAll: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/models/contact.js', () => ({
  default: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
  },
}));

const users = await import('../../../src/models/users.js');
const designations = await import('../../../src/models/designation.js');
const permissionSetting = await import('../../../src/models/permissionSetting.js');
const contacts = await import('../../../src/models/contact.js');
const controller = await import('../../../src/api/profileManagement/controller.js');

describe('Profile Management', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('viewProfile', () => {
    it('should view profile successfully', async () => {
      const mockUser = { id: 'user-1', first_name: 'John' };
      const token = jwt.sign({ id: 'user-1' }, process.env.JWT_SECRET);

      users.default.findByPk.mockResolvedValue(mockUser);

      const req = {
        user: { id: 'user-1' },
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
      };
      const res = { send: jest.fn() };

      await controller.viewProfile(req, res);

      expect(users.default.findByPk).toHaveBeenCalledWith('user-1');
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'data fetched successfully',
        data: mockUser,
      });
    });

    it('should handle viewProfile failure', async () => {
      users.default.findByPk.mockRejectedValue(new Error('Fetch failed'));
      const req = {
        user: { id: 'user-1' },
        header: jest.fn().mockReturnValue(null),
      };
      const res = { send: jest.fn() };

      await controller.viewProfile(req, res);

      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('getUserMessages', () => {
    it('should fetch user messages successfully', async () => {
      const mockMessages = [{ id: '1', message: 'Hello' }];
      contacts.default.findAll.mockResolvedValue(mockMessages);

      const req = {};
      const res = { send: jest.fn() };

      await controller.getUserMessages(req, res);

      expect(contacts.default.findAll).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'successfully fetched',
        data: mockMessages,
      });
    });

    it('should handle getUserMessages failure', async () => {
      contacts.default.findAll.mockRejectedValue(new Error('Fetch failed'));

      const req = {};
      const res = { send: jest.fn() };

      await controller.getUserMessages(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Fetch failed',
      });
    });
  });

  describe('getMsgToRead', () => {
    it('should mark message as read successfully', async () => {
      const mockFeedback = { id: '1', status: 'unread' };
      contacts.default.findByPk.mockResolvedValue(mockFeedback);
      contacts.default.update.mockResolvedValue([1]);

      const req = { params: { id: '1' } };
      const res = { send: jest.fn() };

      await controller.getMsgToRead(req, res);

      expect(contacts.default.findByPk).toHaveBeenCalledWith('1');
      expect(contacts.default.update).toHaveBeenCalledWith(
        { status: 'read' },
        { where: { id: '1' } }
      );
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'marked as read',
        data: mockFeedback,
      });
    });

    it('should handle getMsgToRead failure', async () => {
      contacts.default.findByPk.mockRejectedValue(new Error('Update failed'));

      const req = { params: { id: '1' } };
      const res = { send: jest.fn() };

      await controller.getMsgToRead(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Update failed',
      });
    });
  });

  describe('dltFeedback', () => {
    it('should delete feedback successfully', async () => {
      const mockDestroy = jest.fn().mockResolvedValue(true);
      contacts.default.findByPk.mockResolvedValue({ id: '1', destroy: mockDestroy });

      const req = { params: { id: '1' } };
      const res = { send: jest.fn() };

      await controller.dltFeedback(req, res);

      expect(contacts.default.findByPk).toHaveBeenCalledWith('1');
      expect(mockDestroy).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: ' deleted successfully',
      });
    });

    it('should handle dltFeedback failure', async () => {
      contacts.default.findByPk.mockRejectedValue(new Error('Delete failed'));

      const req = { params: { id: '1' } };
      const res = { send: jest.fn() };

      await controller.dltFeedback(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Delete failed',
      });
    });
  });

  describe('ProfilePermissions', () => {
    it('should fetch profile permissions successfully', async () => {
      const token = jwt.sign({ id: 'user-1' }, process.env.JWT_SECRET);
      users.default.findByPk.mockResolvedValue({ id: 'user-1', designationId: 'des-1' });
      permissionSetting.default.findAll.mockResolvedValue([
        { permission: { menu: 'Dashboard', sub_menu: 'Home' } },
      ]);
      designations.default.findByPk.mockResolvedValue({ id: 'des-1', designation: 'Admin' });

      const req = {
        user: { id: 'user-1' },
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
      };
      const res = { send: jest.fn() };

      await controller.ProfilePermissions(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: true,
        data: {
          permission: [{ menu: 'Dashboard', sub_menu: 'Home' }],
          designation: 'Admin',
        },
      });
    });

    it('should handle ProfilePermissions failure', async () => {
      users.default.findByPk.mockRejectedValue(new Error('Fetch failed'));
      const req = {
        user: { id: 'user-1' },
        header: jest.fn().mockReturnValue(null),
      };
      const res = { send: jest.fn() };

      await controller.ProfilePermissions(req, res);

      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const mockUpdate = jest.fn().mockResolvedValue(true);
      const mockVerifyPassword = jest.fn().mockResolvedValue(true);
      users.default.findByPk.mockResolvedValue({
        id: 'user-1',
        password_hash: 'old_hashed_password',
        verifyPassword: mockVerifyPassword,
        update: mockUpdate,
      });

      const req = {
        user: { id: 'user-1' },
        body: {
          oldPassword: 'current123',
          newPassword: 'new123',
          confirmPassword: 'new123',
        },
      };
      const res = { send: jest.fn() };

      await controller.changePassword(req, res);

      expect(mockVerifyPassword).toHaveBeenCalledWith('current123');
      expect(mockUpdate).toHaveBeenCalledWith({ password_hash: 'new123' });
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'password changed successfully',
      });
    });

    it('should fail when user not found', async () => {
      users.default.findByPk.mockResolvedValue(null);

      const req = {
        user: { id: 'user-1' },
        body: {
          oldPassword: 'current123',
          newPassword: 'new123',
          confirmPassword: 'new123',
        },
      };
      const res = { send: jest.fn() };

      await controller.changePassword(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'You do not have permission to change the password',
      });
    });

    it('should fail when old password verification fails', async () => {
      const mockVerifyPassword = jest.fn().mockResolvedValue(false);
      users.default.findByPk.mockResolvedValue({
        id: 'user-1',
        password_hash: 'old_hashed_password',
        verifyPassword: mockVerifyPassword,
      });

      const req = {
        user: { id: 'user-1' },
        body: {
          oldPassword: 'wrongpass',
          newPassword: 'new123',
          confirmPassword: 'new123',
        },
      };
      const res = { send: jest.fn() };

      await controller.changePassword(req, res);

      expect(mockVerifyPassword).toHaveBeenCalledWith('wrongpass');
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'The old password you entered is incorrect',
      });
    });
  });
});
