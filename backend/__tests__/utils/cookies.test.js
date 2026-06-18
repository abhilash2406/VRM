import { jest } from '@jest/globals';
import { cookieNamesFor, setAuthCookies, clearAuthCookies } from '../../src/utils/cookies.js';

describe('Cookies Utility', () => {
  let mockRes;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    mockRes = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('cookieNamesFor', () => {
    it('should return correct cookie names', () => {
      const names = cookieNamesFor('admin');
      expect(names).toEqual({
        access: 'access_token',
        refresh: 'refresh_token',
      });
    });
  });

  describe('setAuthCookies', () => {
    it('should set cookies with correct options in development', () => {
      process.env.NODE_ENV = 'development';
      const payload = {
        accessToken: 'access-123',
        refreshToken: 'refresh-123',
        accessTtlMs: 15 * 60 * 1000,
        refreshTtlMs: 7 * 24 * 60 * 60 * 1000,
      };

      setAuthCookies(mockRes, 'user', payload);

      const expectedBaseOptions = {
        httpOnly: true,
        secure: false, // development
        sameSite: 'lax',
        domain: undefined,
        path: '/',
      };

      expect(mockRes.cookie).toHaveBeenCalledWith('access_token', 'access-123', {
        ...expectedBaseOptions,
        maxAge: payload.accessTtlMs,
      });

      expect(mockRes.cookie).toHaveBeenCalledWith('refresh_token', 'refresh-123', {
        ...expectedBaseOptions,
        maxAge: payload.refreshTtlMs,
      });
    });

    it('should set cookies with correct options in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.COOKIE_DOMAIN = 'example.com';
      process.env.COOKIE_SAME_SITE = 'strict';

      const payload = {
        accessToken: 'access-456',
        refreshToken: 'refresh-456',
        accessTtlMs: 1000,
        refreshTtlMs: 2000,
      };

      setAuthCookies(mockRes, 'admin', payload);

      const expectedBaseOptions = {
        httpOnly: true,
        secure: true, // production
        sameSite: 'strict',
        domain: 'example.com',
        path: '/',
      };

      expect(mockRes.cookie).toHaveBeenCalledWith('access_token', 'access-456', {
        ...expectedBaseOptions,
        maxAge: 1000,
      });

      expect(mockRes.cookie).toHaveBeenCalledWith('refresh_token', 'refresh-456', {
        ...expectedBaseOptions,
        maxAge: 2000,
      });
    });
  });

  describe('clearAuthCookies', () => {
    it('should clear access and refresh cookies', () => {
      process.env.NODE_ENV = 'development';
      clearAuthCookies(mockRes, 'user');

      const expectedBaseOptions = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        domain: undefined,
        path: '/',
      };

      expect(mockRes.clearCookie).toHaveBeenCalledWith('access_token', expectedBaseOptions);
      expect(mockRes.clearCookie).toHaveBeenCalledWith('refresh_token', expectedBaseOptions);
    });
  });
});
