import { jest } from '@jest/globals';

jest.unstable_mockModule('basic-auth', () => ({
  default: jest.fn(),
}));

const basicAuth = (await import('basic-auth')).default;
const swaggerAuth = (await import('../../src/middlewares/swagger-auth.js')).default;

describe('Swagger Auth Middleware', () => {
  let req, res, next;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    req = {};
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should bypass authentication in development environment', () => {
    process.env.NODE_ENV = 'development';
    swaggerAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should bypass authentication in test environment', () => {
    process.env.NODE_ENV = 'test';
    swaggerAuth(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should reject if no credentials provided in production', () => {
    process.env.NODE_ENV = 'production';
    basicAuth.mockReturnValue(undefined);

    swaggerAuth(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('WWW-Authenticate', 'Basic realm="Swagger UI"');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Authentication required.');
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject if incorrect credentials provided in staging', () => {
    process.env.NODE_ENV = 'staging';
    process.env.SWAGGER_USERNAME = 'admin';
    process.env.SWAGGER_PASSWORD = 'password123';

    basicAuth.mockReturnValue({ name: 'admin', pass: 'wrongpass' });

    swaggerAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if correct credentials provided in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.SWAGGER_USERNAME = 'admin';
    process.env.SWAGGER_PASSWORD = 'password123';

    basicAuth.mockReturnValue({ name: 'admin', pass: 'password123' });

    swaggerAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
