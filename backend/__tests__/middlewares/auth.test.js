import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

jest.unstable_mockModule('../../src/config/winston-config.js', () => ({
  logger: { info: jest.fn(), error: jest.fn() },
}));

jest.unstable_mockModule('../../src/models/users.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

const authMiddleware = (await import('../../src/middlewares/auth.js')).default;
const users = await import('../../src/models/users.js');
const { logger } = await import('../../src/config/winston-config.js');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';

    req = {
      originalUrl: '/api/protected',
      header: jest.fn(),
    };
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('should bypass middleware for /auth route', async () => {
    req.originalUrl = '/auth/login';
    await authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.header).not.toHaveBeenCalled();
  });

  it('should bypass middleware for /contact route', async () => {
    req.originalUrl = '/contact';
    await authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should bypass middleware for /gallery route', async () => {
    req.originalUrl = '/gallery/upload';
    await authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should reject if no Authorization header is present', async () => {
    req.header.mockReturnValue(null);
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Unauthorized Access' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject if token is the string "undefined"', async () => {
    req.header.mockReturnValue('Bearer undefined');
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Unauthorized Access' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject if token is the string "null"', async () => {
    req.header.mockReturnValue('Bearer null');
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Unauthorized Access' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject if token verification fails', async () => {
    req.header.mockReturnValue('Bearer invalidtoken');
    await authMiddleware(req, res, next);
    expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Invalid Token' });
    expect(logger.info).toHaveBeenCalled();
  });

  it('should reject if token is expired', async () => {
    const expiredToken = jwt.sign(
      { id: '1', exp: Math.floor(Date.now() / 1000) - 60 },
      'test-secret'
    );
    req.header.mockReturnValue(`Bearer ${expiredToken}`);

    await authMiddleware(req, res, next);

    // Note: jwt.verify throws TokenExpiredError, so it hits the catch block
    expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Invalid Token' });
  });

  it('should reject if user does not exist in db', async () => {
    const validToken = jwt.sign(
      { id: '1', exp: Math.floor(Date.now() / 1000) + 60 },
      'test-secret'
    );
    req.header.mockReturnValue(`Bearer ${validToken}`);

    users.default.findOne.mockResolvedValue(null);

    await authMiddleware(req, res, next);

    expect(users.default.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Access Denied' });
  });

  it('should reject if token validity string does not match db', async () => {
    const validToken = jwt.sign(
      { id: '1', exp: Math.floor(Date.now() / 1000) + 60, validity: 'wrongvalidity' },
      'test-secret'
    );
    req.header.mockReturnValue(`Bearer ${validToken}`);

    users.default.findOne.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password_hash: 'hashedpass',
    });

    await authMiddleware(req, res, next);

    expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Access Denied' });
  });

  it('should call next and attach user to req on successful validation', async () => {
    const payload = {
      id: '1',
      validity: 'hashedpass1test@example.com',
      exp: Math.floor(Date.now() / 1000) + 60,
    };
    const validToken = jwt.sign(payload, 'test-secret');
    req.header.mockReturnValue(`Bearer ${validToken}`);

    users.default.findOne.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password_hash: 'hashedpass',
    });

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.id).toBe('1');
    expect(req.user.validity).toBe('hashedpass1test@example.com');
  });

  it('should reject if decoded is null', async () => {
    req.header.mockReturnValue('Bearer validformattokenthatreturnnull');
    jest.spyOn(jwt, 'verify').mockReturnValueOnce(null);

    await authMiddleware(req, res, next);

    expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Invalid token' });
    jwt.verify.mockRestore();
  });

  it('should reject if decoded has past exp without throwing error', async () => {
    req.header.mockReturnValue('Bearer validformattokenthatreturnsexp');
    jest
      .spyOn(jwt, 'verify')
      .mockReturnValueOnce({ id: '1', exp: Math.floor(Date.now() / 1000) - 100 });

    await authMiddleware(req, res, next);

    expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Token expired' });
    jwt.verify.mockRestore();
  });
});
