import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import {
  signUserAccessToken,
  signAdminAccessToken,
  ACCESS_TOKEN_TTL_SECONDS,
} from '../../src/utils/jwt.js';
import TokenAudience from '../../src/common/enum/token-audience-enum.js';

describe('JWT Utility', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.JWT_SECRET = 'test-secret';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('signUserAccessToken', () => {
    it('should generate a valid user JWT', () => {
      const payload = { userId: 'user-123', role: 'driver' };
      const token = signUserAccessToken(payload);

      const decoded = jwt.verify(token, 'test-secret');
      expect(decoded.sub).toBe('user-123');
      expect(decoded.type).toBe('driver');
      expect(decoded.aud).toBe(TokenAudience.USER);
      expect(decoded.exp).toBeDefined();
    });
    it('should use default secret if JWT_SECRET is missing', () => {
      delete process.env.JWT_SECRET;
      const payload = { userId: 'user-123', role: 'driver' };
      const token = signUserAccessToken(payload);

      const decoded = jwt.verify(token, 'secret');
      expect(decoded.sub).toBe('user-123');
    });
  });

  describe('signAdminAccessToken', () => {
    it('should generate a valid admin JWT with roleId', () => {
      const payload = { userId: 'admin-123', role: 'admin', roleId: 'role-1' };
      const token = signAdminAccessToken(payload);

      const decoded = jwt.verify(token, 'test-secret');
      expect(decoded.sub).toBe('admin-123');
      expect(decoded.type).toBe('admin');
      expect(decoded.role_id).toBe('role-1');
      expect(decoded.aud).toBe(TokenAudience.ADMIN);
      expect(decoded.exp).toBeDefined();
    });

    it('should generate a valid admin JWT without roleId', () => {
      const payload = { userId: 'admin-123', role: 'admin' };
      const token = signAdminAccessToken(payload);

      const decoded = jwt.verify(token, 'test-secret');
      expect(decoded.sub).toBe('admin-123');
      expect(decoded.type).toBe('admin');
      expect(decoded.role_id).toBeNull();
      expect(decoded.aud).toBe(TokenAudience.ADMIN);
    });

    it('should use default secret if JWT_SECRET is missing for admin', () => {
      delete process.env.JWT_SECRET;
      const payload = { userId: 'admin-123', role: 'admin' };
      const token = signAdminAccessToken(payload);

      const decoded = jwt.verify(token, 'secret');
      expect(decoded.sub).toBe('admin-123');
    });
  });

  describe('ACCESS_TOKEN_TTL_SECONDS', () => {
    it('should parse ACCESS_TOKEN_TTL_SECONDS from env if set', async () => {
      jest.resetModules();
      process.env.ACCESS_TOKEN_TTL_SECONDS = '1200';
      const jwtModule = await import('../../src/utils/jwt.js');
      expect(jwtModule.ACCESS_TOKEN_TTL_SECONDS).toBe(1200);
    });
  });
});
