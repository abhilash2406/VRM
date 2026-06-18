const isProd = process.env.NODE_ENV === 'production';

const logger = {
  info: (...args) => {
    if (!isProd) {
      console.info(...args);
    }
  },
  error: (...args) => {
    if (!isProd) {
      console.error(...args);
    }
  },
  warn: (...args) => {
    if (!isProd) {
      console.warn(...args);
    }
  },
  debug: (...args) => {
    if (!isProd) {
      console.debug(...args);
    }
  },
};

export default logger;
