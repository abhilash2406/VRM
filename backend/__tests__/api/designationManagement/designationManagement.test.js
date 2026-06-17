import { jest } from '@jest/globals';

// 1. Mock the module using unstable_mockModule before importing it or any module that depends on it
jest.unstable_mockModule('../../../src/models/designation.js', () => ({
  default: {
    findAll: jest.fn(),
  },
}));

// 2. Dynamically import the mocked module and the controller that depends on it
const designation = await import('../../../src/models/designation.js');
const controller = await import('../../../src/api/designationManagement/controller.js');

describe('Designation Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Controller Functions', () => {
    it('should retrieve designations successfully', async () => {
      const mockData = [{ id: '1', designation: 'Driver' }];
      designation.default.findAll.mockResolvedValue(mockData);

      const req = {};
      const res = { send: jest.fn() };
      const next = jest.fn();

      await controller.getDesignations(req, res, next);

      expect(designation.default.findAll).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'data retrieval success',
        data: mockData,
      });
    });

    it('should handle errors in getDesignations', async () => {
      const errorMsg = 'Database error';
      designation.default.findAll.mockRejectedValue(errorMsg);

      const req = {};
      const res = { send: jest.fn() };
      const next = jest.fn();

      await controller.getDesignations(req, res, next);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: errorMsg,
      });
    });
  });
});
