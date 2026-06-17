import { jest } from '@jest/globals';

describe('Config Index', () => {
  const originalEnv = process.env;
  let configModule;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should load configuration successfully when all required env vars are present', async () => {
    const requiredVars = [
      'DB_HOST',
      'DB_NAME',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_PORT',
      'DB_LOGGING',
      'DB_DIALECT',
      'JWT_SECRET',
      'ADMIN_MAIL',
      'ADMIN_PASS',
      'STRIPE_PUBLISHABLE_KEY',
      'STRIPE_SECRET_KEY',
      'MAIL_HOST',
      'MAIL_SERVICE',
      'MAIL_EMAIL',
      'MAIL_PASS',
      'SECRET_PASS',
    ];

    requiredVars.forEach((v) => {
      process.env[v] = 'test_value';
    });
    process.env.DB_PORT = '5432';

    configModule = await import('../../src/config/index.js');
    configModule.validateEnvironmentVars();

    expect(configModule.database).toBeDefined();
    expect(configModule.database.host).toBe('test_value');
    expect(configModule.database.port).toBe(5432);
    expect(configModule.stripe).toBeDefined();
    expect(configModule.mail).toBeDefined();
  });

  it('should throw an error if a required env variable is missing', async () => {
    const requiredVars = [
      'DB_HOST',
      'DB_NAME',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_PORT',
      'DB_LOGGING',
      'DB_DIALECT',
      'JWT_SECRET',
      'ADMIN_MAIL',
      'ADMIN_PASS',
      'STRIPE_PUBLISHABLE_KEY',
      'STRIPE_SECRET_KEY',
      'MAIL_HOST',
      'MAIL_SERVICE',
      'MAIL_EMAIL',
      'MAIL_PASS',
      'SECRET_PASS',
    ];
    requiredVars.forEach((v) => {
      process.env[v] = 'test_value';
    });

    delete process.env.JWT_SECRET;

    expect(() => {
      configModule.validateEnvironmentVars();
    }).toThrow('Missing required env variable JWT_SECRET');
  });

  it('should set NODE_ENV to development if undefined', async () => {
    const requiredVars = [
      'DB_HOST',
      'DB_NAME',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_PORT',
      'DB_LOGGING',
      'DB_DIALECT',
      'JWT_SECRET',
      'ADMIN_MAIL',
      'ADMIN_PASS',
      'STRIPE_PUBLISHABLE_KEY',
      'STRIPE_SECRET_KEY',
      'MAIL_HOST',
      'MAIL_SERVICE',
      'MAIL_EMAIL',
      'MAIL_PASS',
      'SECRET_PASS',
    ];
    requiredVars.forEach((v) => {
      process.env[v] = 'test_value';
    });

    delete process.env.NODE_ENV;

    configModule.validateEnvironmentVars();
    expect(process.env.NODE_ENV).toBe('development');
  });
});
