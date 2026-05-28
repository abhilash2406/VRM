import { jest } from '@jest/globals';
import { driverValidate } from '../../../api/driverManagement/validator.js';
import * as controller from '../../../api/driverManagement/controller.js';

jest.mock('../../../models/driver.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Driver Management', () => {
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
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe('Controller Functions', () => {
    it('should define core driver operations', () => {
      expect(controller.getDriverDatas).toBeDefined();
      expect(controller.addDrivers).toBeDefined();
      expect(controller.viewDriver).toBeDefined();
    });
  });
});
