import { jest } from '@jest/globals';
import { routeValidate } from '../../../api/routeManagement/validator.js';
import * as controller from '../../../api/routeManagement/controller.js';

jest.mock('../../../models/route.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Route Management', () => {
  describe('Validator', () => {
    it('should validate correct route properties', async () => {
      const req = {
        body: {
          from: 'London',
          to: 'Manchester',
          country: 'UK',
          state: 'Greater London',
          locations: [
            { longitude: '-0.1278', latitude: '51.5074' },
          ],
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await routeValidate(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should fail validation if locations array is empty or missing', async () => {
      const req = {
        body: {
          from: 'London',
          to: 'Manchester',
          country: 'UK',
          state: 'Greater London',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await routeValidate(req, res, next);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe('Controller Functions', () => {
    it('should define core route operations', () => {
      expect(controller.getAllRoutes).toBeDefined();
      expect(controller.addRoutes).toBeDefined();
    });
  });
});
