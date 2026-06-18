import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../src/models/booking.js', () => ({
  default: {
    update: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/config/winston-config.js', () => ({
  logger: {
    info: jest.fn(),
  },
}));

const booking = await import('../../../src/models/booking.js');
const { logger } = await import('../../../src/config/winston-config.js');
const controller = await import('../../../src/api/webHook/controller.js');

describe('Webhook Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Controller Functions', () => {
    it('should handle webhook success try block', async () => {
      booking.default.update.mockResolvedValue({ success: true });

      const req = {
        body: {
          data: {
            envelopeId: 'env-123',
            envelopeSummary: {
              recipients: ['test@example.com'],
            },
          },
        },
      };

      const res = {
        json: jest.fn(),
      };

      await controller.success(req, res);

      expect(booking.default.update).toHaveBeenCalledWith(
        { signed: 'Signed' },
        { where: { envelopeId: 'env-123' } }
      );
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should handle webhook success catch block on error', async () => {
      const err = new Error('Database Error');
      booking.default.update.mockRejectedValue(err);

      const req = {
        body: {
          data: {
            envelopeId: 'env-123',
            envelopeSummary: {
              recipients: ['test@example.com'],
            },
          },
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.success(req, res);

      expect(logger.info).toHaveBeenCalledWith(err);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database Error' });
    });
  });
});
