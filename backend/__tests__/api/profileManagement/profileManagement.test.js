import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

jest.unstable_mockModule('../../../models/users.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/login.js', () => ({
  default: {
    findByPk: jest.fn(),
    verifyPassword: jest.fn(),
    generateSalt: jest.fn(),
    hashPassword: jest.fn(),
    update: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/designation.js', () => ({
  default: {
    findByPk: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/permissionSetting.js', () => ({
  default: {
    findAll: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/contact.js', () => ({
  default: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
  },
}));

const users = await import('../../../models/users.js');
const login = await import('../../../models/login.js');
const designations = await import('../../../models/designation.js');
const permissionSetting = await import('../../../models/permissionSetting.js');
const contacts = await import('../../../models/contact.js');
const controller = await import('../../../api/profileManagement/controller.js');

describe('Profile Management', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
  });

  beforeEach(() => {
    jest.clearAllMocks();
    global.errorMessage = jest.fn();
  });

  afterEach(() => {
    delete global.errorMessage;
  });

  describe('viewProfile', () => {
    it('should view profile successfully', async () => {
      const mockUser = { id: 'user-1', name: 'John' };
      const token = jwt.sign({ id: 'login-1' }, process.env.JWT_SECRET);

      login.default.findByPk.mockResolvedValue({ id: 'login-1' });
      users.default.findOne.mockResolvedValue(mockUser);

      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
      };
      const res = { send: jest.fn() };

      await controller.viewProfile(req, res);

      expect(login.default.findByPk).toHaveBeenCalledWith('login-1');
      expect(users.default.findOne).toHaveBeenCalledWith({ where: { loginId: 'login-1' } });
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'data fetched successfully',
        data: mockUser,
      });
    });

    it('should handle viewProfile failure', async () => {
      const req = {
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
      const token = jwt.sign({ id: 'login-1' }, process.env.JWT_SECRET);
      login.default.findByPk.mockResolvedValue({ id: 'login-1', designationId: 'des-1' });
      permissionSetting.default.findAll.mockResolvedValue([
        { permission: { menu: 'Dashboard', subMenu: 'Home' } },
      ]);
      designations.default.findByPk.mockResolvedValue({ id: 'des-1', designation: 'Admin' });

      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
      };
      const res = { send: jest.fn() };

      await controller.ProfilePermissions(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: true,
        data: {
          permission: [{ menu: 'Dashboard', subMenu: 'Home' }],
          designation: 'Admin',
        },
      });
    });

    it('should handle ProfilePermissions failure', async () => {
      const req = {
        header: jest.fn().mockReturnValue(null),
      };
      const res = { send: jest.fn() };

      await controller.ProfilePermissions(req, res);

      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('changePassword', () => {
    const secretKey = 'XkhZG4fW2t2W';

    it('should change password successfully', async () => {
      const currentPasswordEncrypted = CryptoJS.AES.encrypt('current123', secretKey).toString();
      const newPasswordEncrypted = CryptoJS.AES.encrypt('new123', secretKey).toString();
      const confirmPasswordEncrypted = CryptoJS.AES.encrypt('new123', secretKey).toString();

      const token = jwt.sign({ id: 'login-1' }, process.env.JWT_SECRET);
      login.default.findByPk.mockResolvedValue({
        id: 'login-1',
        password: 'old_hashed_password',
        salt: 'old_salt',
      });
      login.default.verifyPassword.mockResolvedValue(true);
      login.default.generateSalt.mockResolvedValue('new_salt');
      login.default.hashPassword.mockResolvedValue('new_hashed_password');
      login.default.update.mockResolvedValue([1]);

      const req = {
        body: {
          currentPassword: currentPasswordEncrypted,
          newPassword: newPasswordEncrypted,
          confirmPassword: confirmPasswordEncrypted,
        },
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
      };
      const res = { send: jest.fn() };

      await controller.changePassword(req, res);

      expect(login.default.verifyPassword).toHaveBeenCalledWith(
        'current123',
        'old_hashed_password',
        'old_salt'
      );
      expect(login.default.update).toHaveBeenCalledWith(
        { salt: 'new_salt', password: 'new_hashed_password' },
        { where: { id: 'login-1' } }
      );
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'password changed successfully',
      });
    });

    it('should call errorMessage and throw when user is not found due to controller missing return bug', async () => {
      const currentPasswordEncrypted = CryptoJS.AES.encrypt('current123', secretKey).toString();
      const newPasswordEncrypted = CryptoJS.AES.encrypt('new123', secretKey).toString();
      const confirmPasswordEncrypted = CryptoJS.AES.encrypt('new123', secretKey).toString();

      const token = jwt.sign({ id: 'login-1' }, process.env.JWT_SECRET);
      login.default.findByPk.mockResolvedValue(null);

      const req = {
        body: {
          currentPassword: currentPasswordEncrypted,
          newPassword: newPasswordEncrypted,
          confirmPassword: confirmPasswordEncrypted,
        },
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
      };
      const res = { send: jest.fn() };

      await expect(controller.changePassword(req, res)).rejects.toThrow(
        "Cannot read properties of null (reading 'password')"
      );

      expect(global.errorMessage).toHaveBeenCalledWith(
        res,
        'You dont have the permission to change the password'
      );
    });

    it('should call errorMessage when old password verification fails', async () => {
      const currentPasswordEncrypted = CryptoJS.AES.encrypt('wrongpass', secretKey).toString();
      const newPasswordEncrypted = CryptoJS.AES.encrypt('new123', secretKey).toString();
      const confirmPasswordEncrypted = CryptoJS.AES.encrypt('new123', secretKey).toString();

      const token = jwt.sign({ id: 'login-1' }, process.env.JWT_SECRET);
      login.default.findByPk.mockResolvedValue({
        id: 'login-1',
        password: 'old_hashed_password',
        salt: 'old_salt',
      });
      login.default.verifyPassword.mockResolvedValue(false);

      const req = {
        body: {
          currentPassword: currentPasswordEncrypted,
          newPassword: newPasswordEncrypted,
          confirmPassword: confirmPasswordEncrypted,
        },
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
      };
      const res = { send: jest.fn() };

      await controller.changePassword(req, res);

      expect(login.default.verifyPassword).toHaveBeenCalledWith(
        'wrongpass',
        'old_hashed_password',
        'old_salt'
      );
      expect(global.errorMessage).toHaveBeenCalledWith(res, 'You entered the Wrong Password');
    });
  });
});
