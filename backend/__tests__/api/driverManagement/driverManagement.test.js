import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../src/models/driver.js', () => ({
  default: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/models/users.js', () => ({
  default: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/models/loginHistory.js', () => ({
  default: {
    create: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/models/designation.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/models/transaction.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/models/trip.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/utils/sendEmail.js', () => ({
  default: jest.fn().mockResolvedValue(true),
}));

const { driverValidate } = await import('../../../src/api/driverManagement/validator.js');
const controller = await import('../../../src/api/driverManagement/controller.js');
const drivers = await import('../../../src/models/driver.js');
const users = await import('../../../src/models/users.js');
const designations = await import('../../../src/models/designation.js');
const transactions = await import('../../../src/models/transaction.js');
const trips = await import('../../../src/models/trip.js');

describe('Driver Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validator', () => {
    it('should validate correct driver properties', async () => {
      const req = {
        body: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          licenseNo: 'DL12345',
          phoneNumber: '1234567890',
          licenseType: 'Heavy',
          shift: 'Day',
          dailyWage: '500',
          bata: '50',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await driverValidate(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should fail validation if licenseNo is missing', async () => {
      const req = {
        body: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          phoneNumber: '1234567890',
          licenseType: 'Heavy',
          shift: 'Day',
          dailyWage: '500',
          bata: '50',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await driverValidate(req, res, next);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('Controller Functions', () => {
    describe('getDriverDatas', () => {
      it('should fetch driver data successfully', async () => {
        const mockDrivers = [{ id: '1', licenseNo: 'DL123' }];
        drivers.default.findAll.mockResolvedValue(mockDrivers);

        const req = {};
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getDriverDatas(req, res, next);

        expect(drivers.default.findAll).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'data fetched ',
          data: mockDrivers,
        });
      });

      it('should handle error when fetching fails', async () => {
        drivers.default.findAll.mockRejectedValue(new Error('Fetch failed'));

        const req = {};
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getDriverDatas(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Fetch failed',
        });
      });
    });

    describe('addDrivers', () => {
      it('should fail if user already exists with email', async () => {
        users.default.findOne.mockResolvedValue({ id: 'user-1' });

        const req = { body: { email: 'test@example.com' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addDrivers(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'user already exist with this email',
        });
      });

      it('should fail if driver license is already submitted', async () => {
        users.default.findOne.mockResolvedValue(null);
        drivers.default.findAll.mockResolvedValue([{ id: 'driver-1' }]);

        const req = { body: { email: 'test@example.com', licenseNo: 'DL123' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addDrivers(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'this license is already submitted',
        });
      });

      it('should add driver successfully', async () => {
        users.default.findOne.mockResolvedValue(null);
        drivers.default.findAll.mockResolvedValue([]);
        designations.default.findOne.mockResolvedValue({ id: 'des-1' });
        users.default.create.mockResolvedValue({ id: 'user-1' });
        drivers.default.create.mockResolvedValue({ id: 'driver-1' });

        const req = {
          body: {
            email: 'test@example.com',
            licenseNo: 'DL123',
            name: 'John',
            phoneNumber: '1234',
            licenseType: ['Heavy'],
            shift: 'day',
            dailyWage: '500',
            bata: '50',
          },
          files: {
            licensePhoto: [{ path: 'public/lic.png' }],
            userPhoto: [{ path: 'public/usr.png' }],
          },
        };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addDrivers(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: ' driver Added successfully',
        });
      });

      it('should handle catch block', async () => {
        users.default.findOne.mockRejectedValue(new Error('Catch Error'));

        const req = { body: { email: 'test@example.com' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addDrivers(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Catch Error',
        });
      });
    });

    describe('updateDriver', () => {
      it('should fail if driver not found', async () => {
        drivers.default.findByPk.mockResolvedValue(null);

        const req = { params: { id: 'drv-1' } };
        const res = { send: jest.fn() };

        await controller.updateDriver(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'this driver not exists',
        });
      });

      it('should update driver successfully', async () => {
        const mockUpdateDriver = jest.fn();
        drivers.default.findByPk.mockResolvedValue({
          id: 'drv-1',
          userId: 'user-1',
          update: mockUpdateDriver,
        });

        const mockUpdateUser = jest.fn();
        users.default.findByPk.mockResolvedValue({
          id: 'user-1',
          update: mockUpdateUser,
        });

        const req = {
          params: { id: 'drv-1' },
          body: {
            name: 'New Name',
            phoneNumber: '4321',
            licenseNo: 'DL789',
            licenseType: ['Heavy'],
            shift: 'night',
            dailyWage: '600',
            bata: '60',
          },
          files: {
            licensePhoto: [{ path: 'public/lic.png' }],
            userPhoto: [{ path: 'public/usr.png' }],
          },
        };
        const res = { send: jest.fn() };

        await controller.updateDriver(req, res);

        expect(mockUpdateUser).toHaveBeenCalledWith({
          first_name: 'New Name',
          phone_number: '4321',
        });
        expect(mockUpdateDriver).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'data updated',
        });
      });

      it('should handle error when update fails', async () => {
        drivers.default.findByPk.mockRejectedValue(new Error('Update failed'));

        const req = { params: { id: 'drv-1' } };
        const res = { send: jest.fn() };

        await controller.updateDriver(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Update failed',
        });
      });
    });

    describe('viewDriver', () => {
      it('should view driver successfully', async () => {
        const mockDriver = { id: 'drv-1', licenseNo: 'DL123' };
        drivers.default.findOne.mockResolvedValue(mockDriver);

        const req = { params: { id: 'drv-1' } };
        const res = { send: jest.fn() };

        await controller.viewDriver(req, res);

        expect(drivers.default.findOne).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'driver fetch successfully',
          data: mockDriver,
        });
      });

      it('should handle failure in viewDriver', async () => {
        drivers.default.findOne.mockRejectedValue(new Error('View error'));

        const req = { params: { id: 'drv-1' } };
        const res = { send: jest.fn() };

        await controller.viewDriver(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'View error',
        });
      });
    });

    describe('fetchActiveDrivers', () => {
      it('should fetch active drivers successfully', async () => {
        const mockDrivers = [{ id: 'drv-1', status: 'approved' }];
        drivers.default.findAll.mockResolvedValue(mockDrivers);

        const req = {};
        const res = { send: jest.fn() };

        await controller.fetchActiveDrivers(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'data fetched ',
          data: mockDrivers,
        });
      });

      it('should handle failure in fetchActiveDrivers', async () => {
        drivers.default.findAll.mockRejectedValue(new Error('Fetch active failed'));

        const req = {};
        const res = { send: jest.fn() };

        await controller.fetchActiveDrivers(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Fetch active failed',
        });
      });
    });

    describe('rejectDriver', () => {
      it('should reject driver successfully', async () => {
        drivers.default.update.mockResolvedValue([1]);

        const req = { params: { id: 'drv-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.rejectDriver(req, res, next);

        expect(drivers.default.update).toHaveBeenCalledWith(
          { status: 'reject' },
          { where: { id: 'drv-1' } }
        );
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'rejected',
        });
      });

      it('should handle error in rejectDriver', async () => {
        drivers.default.update.mockRejectedValue(new Error('Reject failed'));

        const req = { params: { id: 'drv-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.rejectDriver(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Reject failed',
        });
      });
    });

    describe('approveDrivers', () => {
      it('should fail if transaction not found', async () => {
        transactions.default.findOne.mockResolvedValue(null);

        const req = { params: { id: 'drv-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.approveDrivers(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'not paid',
        });
      });

      it('should approve driver successfully', async () => {
        transactions.default.findOne.mockResolvedValue({ id: 'tx-1' });
        drivers.default.update.mockResolvedValue([1]);

        const req = {
          params: { id: 'drv-1' },
          body: {
            dailyWage: '500',
            bata: '50',
            shift: 'day',
          },
        };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.approveDrivers(req, res, next);

        expect(drivers.default.update).toHaveBeenCalledWith(
          {
            status: 'approved',
            dailyWage: '500',
            bata: '50',
            shift: 'day',
          },
          { where: { id: 'drv-1' } }
        );
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'approved',
        });
      });

      it('should handle error in approveDrivers', async () => {
        transactions.default.findOne.mockRejectedValue(new Error('Approve error'));

        const req = { params: { id: 'drv-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.approveDrivers(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Approve error',
        });
      });
    });

    describe('deleteDriver', () => {
      it('should fail if driver is not found', async () => {
        drivers.default.findByPk.mockResolvedValue(null);

        const req = { params: { id: 'drv-1' } };
        const res = { send: jest.fn() };

        await controller.deleteDriver(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Driver not found',
        });
      });

      it('should delete driver, user, login, and trip successfully', async () => {
        const mockDestroyDriver = jest.fn();
        drivers.default.findByPk.mockResolvedValue({
          id: 'drv-1',
          userId: 'user-1',
          destroy: mockDestroyDriver,
        });

        const mockDestroyTrip = jest.fn();
        trips.default.findOne.mockResolvedValue({
          id: 'trip-1',
          destroy: mockDestroyTrip,
        });

        const mockDestroyUser = jest.fn();
        users.default.findOne.mockResolvedValue({
          id: 'user-1',
          destroy: mockDestroyUser,
        });

        const req = { params: { id: 'drv-1' } };
        const res = { send: jest.fn() };

        await controller.deleteDriver(req, res);

        expect(mockDestroyTrip).toHaveBeenCalled();
        expect(mockDestroyUser).toHaveBeenCalled();
        expect(mockDestroyDriver).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'Driver, user, and login records deleted successfully',
        });
      });

      it('should handle error when delete fails', async () => {
        drivers.default.findByPk.mockRejectedValue(new Error('Delete error'));

        const req = { params: { id: 'drv-1' } };
        const res = { send: jest.fn() };

        await controller.deleteDriver(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Delete error',
        });
      });
    });
  });
});
