import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../src/models/vehicle.js', () => ({
  default: {
    findByPk: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/models/route.js', () => ({
  default: {
    findByPk: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/models/driver.js', () => ({
  default: {
    findByPk: jest.fn(),
    update: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/models/trip.js', () => ({
  default: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
  },
}));

const { tripValidate } = await import('../../../src/api/tripManagement/validator.js');
const controller = await import('../../../src/api/tripManagement/controller.js');
const trucks = await import('../../../src/models/vehicle.js');
const routes = await import('../../../src/models/route.js');
const drivers = await import('../../../src/models/driver.js');
const trips = await import('../../../src/models/trip.js');

describe('Trip Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validator', () => {
    it('should validate correct trip properties', async () => {
      const req = {
        body: {
          date: '2023-10-15',
          driver_id: 'd3b07384-d113-4956-a534-7c4b37061d15',
          truck_id: 'e8b07384-e113-4956-e534-7c4b37061d16',
          route_id: 'f8b07384-f113-4956-f534-7c4b37061d17',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await tripValidate(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should fail validation if driverId is not a valid UUID', async () => {
      const req = {
        body: {
          date: '2023-10-15',
          driver_id: 'invalid-uuid',
          truck_id: 'e8b07384-e113-4956-e534-7c4b37061d16',
          route_id: 'f8b07384-f113-4956-f534-7c4b37061d17',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await tripValidate(req, res, next);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('Controller Functions', () => {
    describe('addTrips', () => {
      it('should fail if truck does not exist', async () => {
        trucks.default.findByPk.mockResolvedValue(null);
        const req = { body: { truckId: 't-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addTrips(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'This vehicle does not exist',
        });
      });

      it('should fail if route does not exist', async () => {
        trucks.default.findByPk.mockResolvedValue({ id: 't-1' });
        routes.default.findByPk.mockResolvedValue(null);
        const req = { body: { truckId: 't-1', routeId: 'r-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addTrips(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'This route does not exist',
        });
      });

      it('should fail if driver does not exist', async () => {
        trucks.default.findByPk.mockResolvedValue({ id: 't-1' });
        routes.default.findByPk.mockResolvedValue({ id: 'r-1' });
        drivers.default.findByPk.mockResolvedValue(null);
        const req = { body: { truckId: 't-1', routeId: 'r-1', driverId: 'd-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addTrips(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'This driver does not exist',
        });
      });

      it('should fail if driver needs approval', async () => {
        trucks.default.findByPk.mockResolvedValue({ id: 't-1' });
        routes.default.findByPk.mockResolvedValue({ id: 'r-1' });
        drivers.default.findByPk.mockResolvedValue({ id: 'd-1', status: 'pending' });
        const req = { body: { truckId: 't-1', routeId: 'r-1', driverId: 'd-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addTrips(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'This driver needs approval',
        });
      });

      it('should create trip successfully (scheduled date)', async () => {
        trucks.default.findByPk.mockResolvedValue({ id: 't-1' });
        routes.default.findByPk.mockResolvedValue({ id: 'r-1' });
        drivers.default.findByPk.mockResolvedValue({ id: 'd-1', status: 'approved' });
        const mockTrip = { id: 'trip-1' };
        trips.default.create.mockResolvedValue(mockTrip);
        drivers.default.update.mockResolvedValue([1]);

        const req = {
          body: {
            truckId: 't-1',
            routeId: 'r-1',
            driverId: 'd-1',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          },
        };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addTrips(req, res, next);

        expect(trips.default.create).toHaveBeenCalled();
        expect(drivers.default.update).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'Trip created successfully',
          data: mockTrip,
        });
      });

      it('should create trip successfully (past date)', async () => {
        trucks.default.findByPk.mockResolvedValue({ id: 't-1' });
        routes.default.findByPk.mockResolvedValue({ id: 'r-1' });
        drivers.default.findByPk.mockResolvedValue({ id: 'd-1', status: 'approved' });
        const mockTrip = { id: 'trip-1' };
        trips.default.create.mockResolvedValue(mockTrip);
        drivers.default.update.mockResolvedValue([1]);

        const req = {
          body: {
            truckId: 't-1',
            routeId: 'r-1',
            driverId: 'd-1',
            date: '2020-01-01',
          },
        };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addTrips(req, res, next);

        expect(trips.default.create).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'Trip created successfully',
          data: mockTrip,
        });
      });

      it('should handle errors in addTrips catch block', async () => {
        trucks.default.findByPk.mockRejectedValue(new Error('Catch error'));
        const req = { body: { truckId: 't-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addTrips(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Catch error',
        });
      });
    });

    describe('getTrips', () => {
      it('should fetch all trips successfully', async () => {
        const mockTrips = [{ id: '1' }];
        trips.default.findAll.mockResolvedValue(mockTrips);

        const req = {};
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getTrips(req, res, next);

        expect(trips.default.findAll).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'successfully fetched',
          data: mockTrips,
        });
      });

      it('should handle failure in getTrips', async () => {
        trips.default.findAll.mockRejectedValue(new Error('Fetch failed'));

        const req = {};
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getTrips(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Fetch failed',
        });
      });
    });

    describe('getTripData', () => {
      it('should fetch a single trip by ID successfully', async () => {
        const mockTrip = { id: 'trip-1' };
        trips.default.findOne.mockResolvedValue(mockTrip);

        const req = { params: { id: 'trip-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getTripData(req, res, next);

        expect(trips.default.findOne).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'successfully fetched',
          data: mockTrip,
        });
      });

      it('should handle failure in getTripData', async () => {
        trips.default.findOne.mockRejectedValue(new Error('Fetch ID failed'));

        const req = { params: { id: 'trip-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getTripData(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Fetch ID failed',
        });
      });
    });

    describe('deleteTrip', () => {
      it('should fail if trip not found', async () => {
        trips.default.findByPk.mockResolvedValue(null);

        const req = { params: { id: 'trip-1' } };
        const res = { send: jest.fn() };

        await controller.deleteTrip(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Trip not found',
        });
      });

      it('should fail if associated driver not found', async () => {
        trips.default.findByPk.mockResolvedValue({ id: 'trip-1', driverId: 'd-1' });
        drivers.default.findByPk.mockResolvedValue(null);

        const req = { params: { id: 'trip-1' } };
        const res = { send: jest.fn() };

        await controller.deleteTrip(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Driver not found',
        });
      });

      it('should delete trip successfully', async () => {
        const mockDestroy = jest.fn().mockResolvedValue(true);
        trips.default.findByPk.mockResolvedValue({
          id: 'trip-1',
          driverId: 'd-1',
          destroy: mockDestroy,
        });

        const mockUpdate = jest.fn().mockResolvedValue(true);
        drivers.default.findByPk.mockResolvedValue({ id: 'd-1', update: mockUpdate });

        const req = { params: { id: 'trip-1' } };
        const res = { send: jest.fn() };

        await controller.deleteTrip(req, res);

        expect(mockUpdate).toHaveBeenCalledWith({ route_id: null, truck_id: null });
        expect(mockDestroy).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'Trip deleted successfully',
        });
      });

      it('should handle error when deleting trip fails', async () => {
        trips.default.findByPk.mockRejectedValue(new Error('Delete fail'));

        const req = { params: { id: 'trip-1' } };
        const res = { send: jest.fn() };

        await controller.deleteTrip(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Delete fail',
        });
      });
    });

    describe('updateTrip', () => {
      it('should fail if truck does not exist', async () => {
        trucks.default.findByPk.mockResolvedValue(null);
        const req = { params: { id: 'trip-1' }, body: { truckId: 't-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.updateTrip(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'This vehicle does not exist',
        });
      });

      it('should fail if route does not exist', async () => {
        trucks.default.findByPk.mockResolvedValue({ id: 't-1' });
        routes.default.findByPk.mockResolvedValue(null);
        const req = { params: { id: 'trip-1' }, body: { truckId: 't-1', routeId: 'r-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.updateTrip(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'This route does not exist',
        });
      });

      it('should fail if driver does not exist', async () => {
        trucks.default.findByPk.mockResolvedValue({ id: 't-1' });
        routes.default.findByPk.mockResolvedValue({ id: 'r-1' });
        drivers.default.findByPk.mockResolvedValue(null);
        const req = {
          params: { id: 'trip-1' },
          body: { truckId: 't-1', routeId: 'r-1', driverId: 'd-1' },
        };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.updateTrip(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'This driver does not exist',
        });
      });

      it('should fail if driver needs approval', async () => {
        trucks.default.findByPk.mockResolvedValue({ id: 't-1' });
        routes.default.findByPk.mockResolvedValue({ id: 'r-1' });
        drivers.default.findByPk.mockResolvedValue({ id: 'd-1', status: 'pending' });
        const req = {
          params: { id: 'trip-1' },
          body: { truckId: 't-1', routeId: 'r-1', driverId: 'd-1' },
        };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.updateTrip(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'This driver needs approval',
        });
      });

      it('should update trip successfully', async () => {
        trucks.default.findByPk.mockResolvedValue({ id: 't-1' });
        routes.default.findByPk.mockResolvedValue({ id: 'r-1' });
        drivers.default.findByPk.mockResolvedValue({ id: 'd-1', status: 'approved' });
        trips.default.update.mockResolvedValue([1]);
        drivers.default.update.mockResolvedValue([1]);

        const req = {
          params: { id: 'trip-1' },
          body: {
            truckId: 't-1',
            routeId: 'r-1',
            driverId: 'd-1',
            date: '2020-01-01',
          },
        };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.updateTrip(req, res, next);

        expect(trips.default.update).toHaveBeenCalled();
        expect(drivers.default.update).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'Trip updated successfully',
          data: true,
        });
      });

      it('should handle errors in updateTrip catch block', async () => {
        trucks.default.findByPk.mockRejectedValue(new Error('Update Catch error'));
        const req = { params: { id: 'trip-1' }, body: { truckId: 't-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.updateTrip(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Update Catch error',
        });
      });
    });

    describe('noOfTrips', () => {
      it('should count no of trips successfully', async () => {
        const mockTrips = [{ id: '1' }];
        trips.default.findAll.mockResolvedValue(mockTrips);

        const req = {};
        const res = { send: jest.fn() };

        await controller.noOfTrips(req, res);

        expect(trips.default.findAll).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'no of trip in last 30 days',
          data: mockTrips,
        });
      });

      it('should handle error when counting trips fails', async () => {
        trips.default.findAll.mockRejectedValue(new Error('Count failed'));

        const req = {};
        const res = { send: jest.fn() };

        await controller.noOfTrips(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Count failed',
        });
      });
    });
  });
});
