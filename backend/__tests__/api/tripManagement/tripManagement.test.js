import { jest } from '@jest/globals';
import { tripValidate } from '../../../api/tripManagement/validator.js';
import * as controller from '../../../api/tripManagement/controller.js';

jest.mock('../../../models/trip.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Trip Management', () => {
  describe('Validator', () => {
    it('should validate correct trip properties', async () => {
      const req = {
        body: {
          date: '2023-10-15',
          driverId: 'd3b07384-d113-4956-a534-7c4b37061d15',
          truckId: 'e8b07384-e113-4956-e534-7c4b37061d16',
          routeId: 'f8b07384-f113-4956-f534-7c4b37061d17',
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
          driverId: 'invalid-uuid',
          truckId: 'e8b07384-e113-4956-e534-7c4b37061d16',
          routeId: 'f8b07384-f113-4956-f534-7c4b37061d17',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await tripValidate(req, res, next);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe('Controller Functions', () => {
    it('should define core trip operations', () => {
      expect(controller.getTrips).toBeDefined();
      expect(controller.addTrips).toBeDefined();
    });
  });
});
