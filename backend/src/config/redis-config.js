import { createClient } from 'redis';

import { logger } from './winston-config.js';

export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
});

redisClient.on('error', (error) => {
  logger.error(`Redis client error: ${error instanceof Error ? error.message : String(error)}`);
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info(
      `Redis connected successfully (${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379})`
    );
  } catch (error) {
    logger.error(
      `Unable to connect to Redis: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }
};

export const closeRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
  logger.info('Redis connection closed');
};
