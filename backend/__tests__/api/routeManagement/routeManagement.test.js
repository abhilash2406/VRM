import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../src/models/route.js', () => ({
  default: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

const { routeValidate } = await import('../../../src/api/routeManagement/validator.js');
const controller = await import('../../../src/api/routeManagement/controller.js');
const routes = await import('../../../src/models/route.js');

describe('Route Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validator', () => {
    it('should validate correct route properties', async () => {
      const req = {
        body: {
          from: 'London',
          to: 'Manchester',
          country: 'UK',
          state: 'Greater London',
          locations: [{ longitude: '-0.1278', latitude: '51.5074' }],
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
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('Controller Functions', () => {
    describe('addRoutes', () => {
      it('should add route successfully', async () => {
        routes.default.create.mockResolvedValue({ id: '1' });
        const req = {
          body: {
            from: 'A',
            to: 'B',
            locations: [{ longitude: '1.2', latitude: '3.4' }],
          },
        };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addRoutes(req, res, next);

        expect(routes.default.create).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'route added successfully',
        });
      });

      it('should handle failure in addRoutes', async () => {
        routes.default.create.mockRejectedValue(new Error('DB write failed'));
        const req = {
          body: {
            from: 'A',
            to: 'B',
            locations: [{ longitude: '1.2', latitude: '3.4' }],
          },
        };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await controller.addRoutes(req, res, next);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'DB write failed',
        });
      });
    });

    describe('getAllRoutes', () => {
      it('should return all routes', async () => {
        const mockRoutes = [{ id: '1', title: 'A-B' }];
        routes.default.findAll.mockResolvedValue(mockRoutes);

        const req = {};
        const res = { send: jest.fn() };

        await controller.getAllRoutes(req, res);

        expect(routes.default.findAll).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          data: mockRoutes,
        });
      });

      it('should handle failure in getAllRoutes', async () => {
        routes.default.findAll.mockRejectedValue(new Error('Fetch failed'));

        const req = {};
        const res = { send: jest.fn() };

        await controller.getAllRoutes(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Fetch failed',
        });
      });
    });

    describe('deleteRoute', () => {
      it('should delete a route', async () => {
        const mockDestroy = jest.fn().mockResolvedValue(true);
        routes.default.findByPk.mockResolvedValue({
          id: '1',
          destroy: mockDestroy,
        });

        const req = { params: { id: '1' } };
        const res = { send: jest.fn() };

        await controller.deleteRoute(req, res);

        expect(routes.default.findByPk).toHaveBeenCalledWith('1');
        expect(mockDestroy).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          message: 'deleted successfully',
        });
      });

      it('should handle error in deleteRoute', async () => {
        routes.default.findByPk.mockRejectedValue(new Error('Delete error'));

        const req = { params: { id: '1' } };
        const res = { send: jest.fn() };

        await controller.deleteRoute(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Delete error',
        });
      });

      it('should handle route not found in deleteRoute', async () => {
        routes.default.findByPk.mockResolvedValue(null);

        const req = { params: { id: 'notfound' } };
        const res = { send: jest.fn() };

        await controller.deleteRoute(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Route not found',
        });
      });
    });

    describe('getRoute', () => {
      it('should get route by ID', async () => {
        const mockRoute = { id: '1', title: 'A-B' };
        routes.default.findByPk.mockResolvedValue(mockRoute);

        const req = { params: { id: '1' } };
        const res = { send: jest.fn() };

        await controller.getRoute(req, res);

        expect(routes.default.findByPk).toHaveBeenCalledWith('1');
        expect(res.send).toHaveBeenCalledWith({
          success: true,
          data: mockRoute,
        });
      });

      it('should handle error in getRoute', async () => {
        routes.default.findByPk.mockRejectedValue(new Error('Get error'));

        const req = { params: { id: '1' } };
        const res = { send: jest.fn() };

        await controller.getRoute(req, res);

        expect(res.send).toHaveBeenCalledWith({
          success: false,
          message: 'Get error',
        });
      });
    });
  });
});
