import { jest } from '@jest/globals';

const mockSequelizeConstructor = jest.fn();

jest.unstable_mockModule('sequelize', () => ({
  default: class MockSequelize {
    constructor(...args) {
      mockSequelizeConstructor(...args);
    }
  },
}));

jest.unstable_mockModule('../../src/config/index.js', () => ({
  database: {
    host: 'localhost',
    database: 'test_db',
    dialect: 'postgres',
  },
}));

const mockDnsLookup = jest.fn((hostname, options, callback) => {
  if (typeof options === 'function') {
    options(null, '127.0.0.1', 4);
  } else {
    // If it's the neon.tech test case with multiple addresses
    if (hostname === 'ep-test.neon.tech' && options && options.all) {
      callback(
        null,
        [
          { address: '1.2.3.4', family: 4 },
          { address: '::1', family: 6 },
        ],
        4
      );
      return;
    }
    if (hostname === 'error.com') {
      callback(new Error('lookup failed'), null, null);
      return;
    }
    callback(null, '127.0.0.1', 4);
  }
});

jest.unstable_mockModule('dns', () => ({
  default: {
    lookup: mockDnsLookup,
  },
}));

describe('Sequelize Config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize Sequelize with correct config', async () => {
    await import('../../src/config/sequelize-config.js');

    expect(mockSequelizeConstructor).toHaveBeenCalledWith({
      host: 'localhost',
      database: 'test_db',
      dialect: 'postgres',
    });
  });

  describe('dns.lookup patch', () => {
    it('should handle callback as second argument', async () => {
      const dns = (await import('dns')).default;
      await import('../../src/config/sequelize-config.js');

      const callback = jest.fn();
      dns.lookup('localhost', callback);
      expect(callback).toHaveBeenCalledWith(null, '127.0.0.1', 4);
    });

    it('should handle options object', async () => {
      const dns = (await import('dns')).default;
      await import('../../src/config/sequelize-config.js');

      const callback = jest.fn();
      dns.lookup('localhost', {}, callback);
      expect(callback).toHaveBeenCalledWith(null, '127.0.0.1', 4);
    });

    it('should return only first IPv4 for neon.tech with all: true', async () => {
      const dns = (await import('dns')).default;
      await import('../../src/config/sequelize-config.js');

      const callback = jest.fn();
      dns.lookup('ep-test.neon.tech', { all: true }, callback);
      expect(callback).toHaveBeenCalledWith(null, [{ address: '1.2.3.4', family: 4 }]);
    });

    it('should pass through errors', async () => {
      const dns = (await import('dns')).default;
      await import('../../src/config/sequelize-config.js');

      const callback = jest.fn();
      dns.lookup('error.com', {}, callback);
      expect(callback).toHaveBeenCalledWith(expect.any(Error), null, null);
    });
  });
});
