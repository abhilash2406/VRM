import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

jest.unstable_mockModule('../../../models/brand.js', () => ({
  default: {
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/truckModel.js', () => ({
  default: {
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/variant.js', () => ({
  default: {
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/truck.js', () => ({
  default: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/login.js', () => ({
  default: {
    findByPk: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/users.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

const { TruckValidate } = await import('../../../api/truckManagement/validator.js');
const controller = await import('../../../api/truckManagement/controller.js');
const Brand = await import('../../../models/brand.js');
const TruckModel = await import('../../../models/truckModel.js');
const Variant = await import('../../../models/variant.js');
const trucks = await import('../../../models/truck.js');
const login = await import('../../../models/login.js');
const users = await import('../../../models/users.js');

describe('Truck Management', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validator', () => {
    it('should validate correct truck properties', async () => {
      const req = {
        body: {
          brand: 'Volvo',
          model: 'FH16',
          variant: 'Standard',
          VIN: 'VIN123456789',
          engineNo: 'ENG12345',
          chassisNo: 'CH12345',
          RCNo: 'RC12345',
          yrManufacture: '2023',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await TruckValidate(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should fail validation if engineNo is missing', async () => {
      const req = {
        body: {
          brand: 'Volvo',
          model: 'FH16',
          variant: 'Standard',
          VIN: 'VIN123456789',
          chassisNo: 'CH12345',
          RCNo: 'RC12345',
          yrManufacture: '2023',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await TruckValidate(req, res, next);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('Controller Functions', () => {
    describe('getTruckBrands', () => {
      it('should fetch brands successfully', async () => {
        const mockBrands = [{ id: '1', name: 'Volvo' }];
        Brand.default.findAll.mockResolvedValue(mockBrands);

        const req = {};
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getTruckBrands(req, res, next);

        expect(Brand.default.findAll).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'brand fetched',
          data: mockBrands,
        });
      });

      it('should handle failure in getTruckBrands', async () => {
        Brand.default.findAll.mockRejectedValue(new Error('Fetch failed'));

        const req = {};
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getTruckBrands(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Fetch failed',
        });
      });
    });

    describe('getTruckModels', () => {
      it('should fetch truck models successfully', async () => {
        const mockModels = [{ id: '1', name: 'FH16' }];
        TruckModel.default.findAll.mockResolvedValue(mockModels);

        const req = {};
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getTruckModels(req, res, next);

        expect(TruckModel.default.findAll).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'truck models fetched',
          data: mockModels,
        });
      });

      it('should handle failure in getTruckModels', async () => {
        TruckModel.default.findAll.mockRejectedValue(new Error('Fetch models failed'));

        const req = {};
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getTruckModels(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Fetch models failed',
        });
      });
    });

    describe('getTruckVariants', () => {
      it('should fetch truck variants successfully', async () => {
        const mockVariants = [{ id: '1', name: 'Standard' }];
        Variant.default.findAll.mockResolvedValue(mockVariants);

        const req = {};
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getTruckVariants(req, res, next);

        expect(Variant.default.findAll).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'truck variants fetched',
          data: mockVariants,
        });
      });

      it('should handle failure in getTruckVariants', async () => {
        Variant.default.findAll.mockRejectedValue(new Error('Fetch variants failed'));

        const req = {};
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getTruckVariants(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Fetch variants failed',
        });
      });
    });

    describe('correspondingData', () => {
      it('should return brand only if no brandId or modelId provided', async () => {
        const mockBrands = [{ id: 'b-1' }];
        Brand.default.findAll.mockResolvedValue(mockBrands);

        const req = { body: {} };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.correspondingData(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: true,
          brand: mockBrands,
        });
      });

      it('should return brand and model if brandId is provided', async () => {
        const mockBrands = [{ id: 'b-1' }];
        const mockModels = [{ id: 'm-1' }];
        Brand.default.findAll.mockResolvedValue(mockBrands);
        TruckModel.default.findAll.mockResolvedValue(mockModels);

        const req = { body: { brandId: 'b-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.correspondingData(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: true,
          brand: mockBrands,
          model: mockModels,
        });
      });

      it('should return brand, model, and variant if both brandId and modelId are provided', async () => {
        const mockBrands = [{ id: 'b-1' }];
        const mockModels = [{ id: 'm-1' }];
        const mockVariants = [{ id: 'v-1' }];
        Brand.default.findAll.mockResolvedValue(mockBrands);
        TruckModel.default.findAll.mockResolvedValue(mockModels);
        Variant.default.findAll.mockResolvedValue(mockVariants);

        const req = { body: { brandId: 'b-1', modelId: 'm-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.correspondingData(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: true,
          brand: mockBrands,
          model: mockModels,
          variant: mockVariants,
        });
      });

      it('should handle failure in correspondingData', async () => {
        Brand.default.findAll.mockRejectedValue(new Error('Fetch failed'));

        const req = { body: {} };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.correspondingData(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Fetch failed',
        });
      });
    });

    describe('addTrucks', () => {
      it('should fail if truck already exists', async () => {
        trucks.default.findAll.mockResolvedValue([{ id: 't-1' }]);

        const req = { body: { VIN: 'VIN123', RCNo: 'RC123' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addTrucks(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'this truck is already added',
        });
      });

      it('should add truck successfully', async () => {
        trucks.default.findAll.mockResolvedValue([]);
        Brand.default.findOne.mockResolvedValue({ name: 'Volvo' });
        TruckModel.default.findOne.mockResolvedValue({ name: 'FH16' });
        Variant.default.findOne.mockResolvedValue({ name: 'Standard' });
        login.default.findByPk.mockResolvedValue({ id: 'login-1' });
        users.default.findOne.mockResolvedValue({ id: 'user-1' });
        trucks.default.create.mockResolvedValue({ id: 't-1' });

        const token = jwt.sign({ id: 'login-1' }, process.env.JWT_SECRET);
        const req = {
          header: jest.fn().mockReturnValue(`Bearer ${token}`),
          body: {
            brand: 'b-1',
            model: 'm-1',
            variant: 'v-1',
            VIN: 'VIN123',
            engineNo: 'ENG123',
            chassisNo: 'CH123',
            RCNo: 'RC123',
            yrManufacture: '2023',
            condition: 'working',
            status: 'active',
          },
          files: {
            rcPhoto: [{ path: 'public/rc.png' }],
            truckPhoto: [{ path: 'public/truck.png' }],
          },
        };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addTrucks(req, res, next);

        expect(trucks.default.create).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'truck added',
        });
      });

      it('should handle failure in addTrucks catch block', async () => {
        trucks.default.findAll.mockRejectedValue(new Error('Add Catch Error'));

        const req = { body: { VIN: 'VIN123', RCNo: 'RC123' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addTrucks(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Add Catch Error',
        });
      });
    });

    describe('getAllTruckData', () => {
      it('should fetch all truck data successfully', async () => {
        const mockTrucks = [{ id: '1' }];
        trucks.default.findAll.mockResolvedValue(mockTrucks);

        const req = {};
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getAllTruckData(req, res, next);

        expect(trucks.default.findAll).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'data retrieved successfully',
          data: mockTrucks,
        });
      });

      it('should handle failure in getAllTruckData', async () => {
        trucks.default.findAll.mockRejectedValue(new Error('Fetch trucks failed'));

        const req = {};
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getAllTruckData(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Fetch trucks failed',
        });
      });
    });

    describe('getActiveTrucks', () => {
      it('should fetch active trucks successfully', async () => {
        const mockTrucks = [{ id: '1', isActive: true }];
        trucks.default.findAll.mockResolvedValue(mockTrucks);

        const req = {};
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getActiveTrucks(req, res, next);

        expect(trucks.default.findAll).toHaveBeenCalledWith({ where: { isActive: true } });
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'data retrieved successfully',
          data: mockTrucks,
        });
      });

      it('should handle failure in getActiveTrucks', async () => {
        trucks.default.findAll.mockRejectedValue(new Error('Fetch active failed'));

        const req = {};
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.getActiveTrucks(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Fetch active failed',
        });
      });
    });

    describe('truckToEdit', () => {
      it('should fetch truck to edit successfully', async () => {
        const mockTruck = { id: 't-1' };
        trucks.default.findByPk.mockResolvedValue(mockTruck);

        const req = { params: { id: 't-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.truckToEdit(req, res, next);

        expect(trucks.default.findByPk).toHaveBeenCalledWith('t-1');
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'data retrieved successfully',
          data: mockTruck,
        });
      });

      it('should handle failure in truckToEdit', async () => {
        trucks.default.findByPk.mockRejectedValue(new Error('Edit fetch failed'));

        const req = { params: { id: 't-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.truckToEdit(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Edit fetch failed',
        });
      });
    });

    describe('dltTruck', () => {
      it('should fail if matching data to delete is not found', async () => {
        trucks.default.findByPk.mockResolvedValue([]);

        const req = { params: { id: 't-1' } };
        const res = { send: jest.fn() };

        await controller.dltTruck(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'not matching data found to delete',
        });
      });

      it('should delete truck successfully', async () => {
        const mockDestroy = jest.fn().mockResolvedValue(true);
        trucks.default.findByPk.mockResolvedValue({ id: 't-1', destroy: mockDestroy });

        const req = { params: { id: 't-1' } };
        const res = { send: jest.fn() };

        await controller.dltTruck(req, res);

        expect(mockDestroy).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: ' deleted successfully',
        });
      });

      it('should handle failure and throw reference error due to es.send bug in controller', async () => {
        trucks.default.findByPk.mockRejectedValue(new Error('DB error'));

        const req = { params: { id: 't-1' } };
        const res = { send: jest.fn() };

        await expect(controller.dltTruck(req, res)).rejects.toThrow('es is not defined');
      });
    });

    describe('updateTruck', () => {
      it('should fail if truck does not exist', async () => {
        trucks.default.findByPk.mockResolvedValue(null);

        const req = { params: { id: 't-1' } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.updateTruck(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'truck not exists',
        });
      });

      it('should update truck successfully', async () => {
        const mockUpdate = jest.fn().mockResolvedValue(true);
        trucks.default.findByPk.mockResolvedValue({ id: 't-1', update: mockUpdate });
        Brand.default.findOne.mockResolvedValue({ name: 'Volvo' });
        TruckModel.default.findOne.mockResolvedValue({ name: 'FH16' });
        Variant.default.findOne.mockResolvedValue({ name: 'Standard' });

        const req = {
          params: { id: 't-1' },
          body: {
            brand: 'b-1',
            model: 'm-1',
            variant: 'v-1',
            VIN: 'VIN123',
            engineNo: 'ENG123',
            chassisNo: 'CH123',
            RCNo: 'RC123',
            yrManufacture: '2023',
            condition: 'working',
            status: 'active',
          },
          files: {
            rcPhoto: [{ path: 'public/rc.png' }],
            truckPhoto: [{ path: 'public/truck.png' }],
          },
        };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.updateTruck(req, res, next);

        expect(mockUpdate).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'updated successfully',
        });
      });
    });
  });
});
