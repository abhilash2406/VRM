import logger from './logger';
const isProd = process.env.NODE_ENV === 'production';

const logger = {
  info: (...args) => {
    if (!isProd) {
      logger.info(...args);
    }
  },
  error: (...args) => {
    if (!isProd) {
      logger.error(...args);
    }
  },
  warn: (...args) => {
    if (!isProd) {
      logger.warn(...args);
    }
  },
  debug: (...args) => {
    if (!isProd) {
      logger.debug(...args);
    }
  },
};

export default logger;
