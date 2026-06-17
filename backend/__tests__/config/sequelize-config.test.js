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
});
