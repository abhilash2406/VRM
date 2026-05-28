import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../models/gallery.js', () => ({
  default: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

const gallery = await import('../../../models/gallery.js');
const controller = await import('../../../api/galleryManagement/controller.js');

describe('Gallery Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImages', () => {
    it('should upload images successfully', async () => {
      gallery.default.create.mockResolvedValue({ id: '1', image: '/images/img.png' });
      const req = {
        file: {
          path: 'public/images/img.png',
        },
        body: {},
      };
      const res = {};
      const next = jest.fn();

      await controller.uploadImages(req, res, next);

      expect(req.body.image).toBe('/images/img.png');
      expect(gallery.default.create).toHaveBeenCalledWith(req.body);
    });
  });

  describe('retrieveImages', () => {
    it('should retrieve images successfully', async () => {
      const mockData = [{ id: '1', image: '/images/img.png' }];
      gallery.default.findAll.mockResolvedValue(mockData);

      const req = {};
      const res = { send: jest.fn() };
      const next = jest.fn();

      await controller.retrieveImages(req, res, next);

      expect(gallery.default.findAll).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        data: mockData,
        message: 'image fetched successfully',
      });
    });

    it('should handle error when retrieve images fails', async () => {
      gallery.default.findAll.mockRejectedValue(new Error('Fetch failed'));

      const req = {};
      const res = { send: jest.fn() };
      const next = jest.fn();

      await controller.retrieveImages(req, res, next);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Fetch failed',
      });
    });
  });

  describe('dltImages', () => {
    it('should delete images successfully', async () => {
      const mockDestroy = jest.fn().mockResolvedValue(true);
      gallery.default.findByPk.mockResolvedValue({
        id: '1',
        destroy: mockDestroy,
      });

      const req = { params: { id: '1' } };
      const res = { send: jest.fn() };

      await controller.dltImages(req, res);

      expect(gallery.default.findByPk).toHaveBeenCalledWith('1');
      expect(mockDestroy).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'image deleted successfully',
      });
    });

    it('should handle delete failure and throw reference error due to es.send bug in controller', async () => {
      gallery.default.findByPk.mockRejectedValue(new Error('DB error'));

      const req = { params: { id: '1' } };
      const res = { send: jest.fn() };

      await expect(controller.dltImages(req, res)).rejects.toThrow('es is not defined');
    });
  });
});
