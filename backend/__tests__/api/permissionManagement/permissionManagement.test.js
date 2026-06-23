import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../src/models/permission.js', () => ({
  default: {
    findAll: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/models/designation.js', () => ({
  default: {
    findByPk: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/models/permissionSetting.js', () => ({
  default: {
    destroy: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));

const permissions = await import('../../../src/models/permission.js');
const designations = await import('../../../src/models/designation.js');
const permissionSetting = await import('../../../src/models/permissionSetting.js');
const controller = await import('../../../src/api/permissionManagement/controller.js');

describe('Permission Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPermissions', () => {
    it('should fetch all permissions successfully', async () => {
      const mockData = [{ id: '1', menu: 'Home' }];
      permissions.default.findAll.mockResolvedValue(mockData);

      const req = {};
      const res = { send: jest.fn() };
      const next = jest.fn();

      await controller.getAllPermissions(req, res, next);

      expect(permissions.default.findAll).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        data: mockData,
      });
    });

    it('should handle error when fetching permissions fails', async () => {
      const err = new Error('DB Error');
      permissions.default.findAll.mockRejectedValue(err);

      const req = {};
      const res = { send: jest.fn() };
      const next = jest.fn();

      await controller.getAllPermissions(req, res, next);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: err.message,
      });
    });
  });

  describe('grantPermissions', () => {
    it('should grant permissions successfully', async () => {
      permissionSetting.default.destroy.mockResolvedValue(1);
      permissionSetting.default.create.mockResolvedValue({
        designationId: 'role-1',
        permissionId: 'perm-1',
      });
      permissionSetting.default.findAll.mockResolvedValue([
        {
          designation_id: 'role-1',
          permission: { menu: 'Dashboard', sub_menu: 'Home' },
        },
      ]);
      designations.default.findByPk.mockResolvedValue({ id: 'role-1', designation: 'Admin' });

      const mockSocket = { emit: jest.fn() };
      const req = {
        params: { id: 'role-1' },
        body: [{ designationId: 'role-1', permissionId: 'perm-1' }],
        app: {
          locals: {
            socket: mockSocket,
          },
        },
      };
      const res = { send: jest.fn(), json: jest.fn() };
      const next = jest.fn();

      await controller.grantPermissions(req, res, next);

      expect(permissionSetting.default.destroy).toHaveBeenCalledWith({
        where: { designation_id: 'role-1' },
      });
      expect(permissionSetting.default.create).toHaveBeenCalled();
      expect(designations.default.findByPk).toHaveBeenCalledWith('role-1');
      expect(mockSocket.emit).toHaveBeenCalledWith('GetPermissions', {
        data: [{ menu: 'Dashboard', sub_menu: 'Home' }],
        role: 'Admin',
      });
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Updated successfully',
      });
    });

    it('should handle errors when granting permissions fails', async () => {
      const err = new Error('Grant failed');
      permissionSetting.default.destroy.mockRejectedValue(err);

      const req = {
        params: { id: 'role-1' },
        body: [],
        app: { locals: { socket: { emit: jest.fn() } } },
      };
      const res = { send: jest.fn(), json: jest.fn() };
      const next = jest.fn();

      await controller.grantPermissions(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: err.message,
      });
    });
  });

  describe('getUserData', () => {
    it('should fetch allowed designation settings successfully', async () => {
      permissionSetting.default.findAll.mockResolvedValue([
        { permission_id: 'perm-1', designation_id: 'role-1' },
      ]);

      const req = { params: { id: 'role-1' } };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await controller.getUserData(req, res, next);

      expect(permissionSetting.default.findAll).toHaveBeenCalledWith({
        where: { designation_id: 'role-1' },
      });
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'successfully fetched data',
        data: [{ permission_id: 'perm-1', designation_id: 'role-1' }],
      });
    });

    it('should handle error when fetching allowed designation settings fails', async () => {
      const err = new Error('Fetch allowed error');
      permissionSetting.default.findAll.mockRejectedValue(err);

      const req = { params: { id: 'role-1' } };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await controller.getUserData(req, res, next);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: err.message,
      });
    });
  });
});
