import { jest } from '@jest/globals';
import { TruckValidate } from '../../../api/truckManagement/validator.js';
import * as controller from '../../../api/truckManagement/controller.js';

jest.mock('../../../models/truck.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Truck Management', () => {
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
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe('Controller Functions', () => {
    it('should define core truck operations', () => {
      expect(controller.getAllTruckData).toBeDefined();
      expect(controller.addTrucks).toBeDefined();
      expect(controller.getTruckBrands).toBeDefined();
    });
  });
});
