import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../src/api/vehicle/service.js', () => ({
  addVehicleService: jest.fn(),
  getAllVehiclesService: jest.fn(),
  getVehicleByIdService: jest.fn(),
  updateVehicleService: jest.fn(),
  updateVehicleStatusService: jest.fn(),
  updateVehicleAvailabilityService: jest.fn(),
}));

const { VehicleValidate, VehicleStatusValidate, VehicleAvailabilityValidate } =
  await import('../../../src/api/vehicle/validator.js');
const controller = await import('../../../src/api/vehicle/controller.js');
const service = await import('../../../src/api/vehicle/service.js');

describe('Vehicle Management API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validators', () => {
    describe('VehicleValidate', () => {
      it('should validate correctly formatted vehicle payload', async () => {
        const req = {
          body: {
            registration_number: 'KA-01-HH-1234',
            manufacturer: 'Toyota',
            model_name: 'Innova',
            manufacturing_year: 2022,
            vehicle_type: 'four-wheeler',
          },
        };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await VehicleValidate(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
      });

      it('should fail validation if registration_number is missing', async () => {
        const req = {
          body: {
            manufacturer: 'Toyota',
            model_name: 'Innova',
            manufacturing_year: 2022,
            vehicle_type: 'four-wheeler',
          },
        };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await VehicleValidate(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
      });
    });

    describe('VehicleStatusValidate', () => {
      it('should validate correct status', async () => {
        const req = { body: { status: 'ACTIVE' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await VehicleStatusValidate(req, res, next);
        expect(next).toHaveBeenCalled();
      });

      it('should fail with invalid status', async () => {
        const req = { body: { status: 'INVALID_STATUS' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await VehicleStatusValidate(req, res, next);
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
      });
    });

    describe('VehicleAvailabilityValidate', () => {
      it('should validate correct availability status', async () => {
        const req = { body: { availability_status: 'booked' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await VehicleAvailabilityValidate(req, res, next);
        expect(next).toHaveBeenCalled();
      });

      it('should fail with invalid availability status', async () => {
        const req = { body: { availability_status: 'free' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await VehicleAvailabilityValidate(req, res, next);
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
      });
    });
  });

  describe('Controllers', () => {
    describe('addVehicle', () => {
      it('should add a vehicle successfully', async () => {
        const mockData = { id: 'veh-1' };
        service.addVehicleService.mockResolvedValue(mockData);

        const req = {
          body: { registration_number: 'KA-01-HH-1234' },
          user: { id: 'user-1' },
        };
        const res = { send: jest.fn() };

        await controller.addVehicle(req, res);

        expect(service.addVehicleService).toHaveBeenCalledWith(req.body, 'user-1');
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'Vehicle added successfully',
          data: mockData,
        });
      });

      it('should handle service failure', async () => {
        service.addVehicleService.mockRejectedValue(new Error('Add failed'));

        const req = { body: {}, user: { id: 'user-1' } };
        const res = { send: jest.fn() };

        await controller.addVehicle(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Add failed',
        });
      });
    });

    describe('getAllVehicles', () => {
      it('should retrieve all vehicles successfully', async () => {
        const mockResult = { rows: [{ id: 'veh-1' }], count: 1, page: 1, limit: 10 };
        service.getAllVehiclesService.mockResolvedValue(mockResult);

        const req = { query: { page: 1, limit: 10 } };
        const res = { send: jest.fn() };

        await controller.getAllVehicles(req, res);

        expect(service.getAllVehiclesService).toHaveBeenCalledWith(req.query);
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'Vehicles retrieved successfully',
          data: mockResult.rows,
          meta: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        });
      });

      it('should handle retrieval failure', async () => {
        service.getAllVehiclesService.mockRejectedValue(new Error('Fetch failed'));

        const req = { query: {} };
        const res = { send: jest.fn() };

        await controller.getAllVehicles(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Fetch failed',
        });
      });
    });

    describe('getVehicleById', () => {
      it('should retrieve vehicle by id successfully', async () => {
        const mockData = { id: 'veh-1' };
        service.getVehicleByIdService.mockResolvedValue(mockData);

        const req = { params: { id: 'veh-1' } };
        const res = { send: jest.fn() };

        await controller.getVehicleById(req, res);

        expect(service.getVehicleByIdService).toHaveBeenCalledWith('veh-1');
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'Vehicle retrieved successfully',
          data: mockData,
        });
      });

      it('should handle retrieve by id failure', async () => {
        service.getVehicleByIdService.mockRejectedValue(new Error('Not found'));

        const req = { params: { id: 'veh-1' } };
        const res = { send: jest.fn() };

        await controller.getVehicleById(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Not found',
        });
      });
    });

    describe('updateVehicle', () => {
      it('should update vehicle successfully', async () => {
        const mockData = { id: 'veh-1', updated: true };
        service.updateVehicleService.mockResolvedValue(mockData);

        const req = { params: { id: 'veh-1' }, body: { manufacturer: 'Honda' } };
        const res = { send: jest.fn() };

        await controller.updateVehicle(req, res);

        expect(service.updateVehicleService).toHaveBeenCalledWith('veh-1', req.body);
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'Vehicle updated successfully',
          data: mockData,
        });
      });

      it('should handle update failure', async () => {
        service.updateVehicleService.mockRejectedValue(new Error('Update failed'));

        const req = { params: { id: 'veh-1' }, body: {} };
        const res = { send: jest.fn() };

        await controller.updateVehicle(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Update failed',
        });
      });
    });

    describe('updateVehicleStatus', () => {
      it('should update vehicle status successfully', async () => {
        const mockData = { id: 'veh-1', status: 'INACTIVE' };
        service.updateVehicleStatusService.mockResolvedValue(mockData);

        const req = { params: { id: 'veh-1' }, body: { status: 'INACTIVE' } };
        const res = { send: jest.fn() };

        await controller.updateVehicleStatus(req, res);

        expect(service.updateVehicleStatusService).toHaveBeenCalledWith('veh-1', 'INACTIVE');
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'Vehicle status updated successfully',
          data: mockData,
        });
      });

      it('should handle status update failure', async () => {
        service.updateVehicleStatusService.mockRejectedValue(new Error('Status update failed'));

        const req = { params: { id: 'veh-1' }, body: { status: 'INACTIVE' } };
        const res = { send: jest.fn() };

        await controller.updateVehicleStatus(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Status update failed',
        });
      });
    });

    describe('updateVehicleAvailability', () => {
      it('should update vehicle availability successfully', async () => {
        const mockData = { id: 'veh-1', availability_status: 'booked' };
        service.updateVehicleAvailabilityService.mockResolvedValue(mockData);

        const req = { params: { id: 'veh-1' }, body: { availability_status: 'booked' } };
        const res = { send: jest.fn() };

        await controller.updateVehicleAvailability(req, res);

        expect(service.updateVehicleAvailabilityService).toHaveBeenCalledWith('veh-1', 'booked');
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'Vehicle availability updated successfully',
          data: mockData,
        });
      });

      it('should handle availability update failure', async () => {
        service.updateVehicleAvailabilityService.mockRejectedValue(new Error('Availability update failed'));

        const req = { params: { id: 'veh-1' }, body: { availability_status: 'booked' } };
        const res = { send: jest.fn() };

        await controller.updateVehicleAvailability(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Availability update failed',
        });
      });
    });
  });
});
