import { jest } from '@jest/globals';

const mockConnect = jest.fn();
const mockQuit = jest.fn();
const mockOn = jest.fn();

const mockRedisClient = {
  connect: mockConnect,
  quit: mockQuit,
  on: mockOn,
  isOpen: true,
};

jest.unstable_mockModule('redis', () => ({
  createClient: jest.fn(() => mockRedisClient),
}));

jest.unstable_mockModule('../../src/config/winston-config.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Redis Config', () => {
  let redisConfig;
  let logger;
  const originalEnv = process.env;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...originalEnv };

    redisConfig = await import('../../src/config/redis-config.js');
    logger = (await import('../../src/config/winston-config.js')).logger;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('connectRedis', () => {
    it('should connect to redis successfully', async () => {
      mockConnect.mockResolvedValueOnce();

      await redisConfig.connectRedis();

      expect(mockConnect).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Redis connected successfully')
      );
    });

    it('should handle redis connection errors', async () => {
      const err = new Error('Connection failed');
      mockConnect.mockRejectedValueOnce(err);

      await expect(redisConfig.connectRedis()).rejects.toThrow('Connection failed');
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Unable to connect to Redis')
      );
    });

    it('should handle redis connection errors with non-Error object', async () => {
      mockConnect.mockRejectedValueOnce('String connection error');

      await expect(redisConfig.connectRedis()).rejects.toEqual('String connection error');
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Unable to connect to Redis: String connection error')
      );
    });
  });

  describe('closeRedis', () => {
    it('should close redis connection if it is open', async () => {
      mockRedisClient.isOpen = true;
      mockQuit.mockResolvedValueOnce();

      await redisConfig.closeRedis();

      expect(mockQuit).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('Redis connection closed');
    });

    it('should not call quit if redis connection is not open', async () => {
      mockRedisClient.isOpen = false;

      await redisConfig.closeRedis();

      expect(mockQuit).not.toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('Redis connection closed');
    });
  });

  describe('redisClient event listeners', () => {
    it('should set an error listener on the redis client', async () => {
      expect(mockOn).toHaveBeenCalledWith('error', expect.any(Function));

      // Extract the error callback and test it
      const errorCallback = mockOn.mock.calls.find((call) => call[0] === 'error')[1];
      const testError = new Error('Test redis error');

      errorCallback(testError);

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Redis client error: Test redis error')
      );
    });

    it('should set an error listener that handles non-Error objects', async () => {
      const errorCallback = mockOn.mock.calls.find((call) => call[0] === 'error')[1];
      errorCallback('String error on listener');

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Redis client error: String error on listener')
      );
    });
  });
});
