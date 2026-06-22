import { jest } from '@jest/globals';
import TokenAudience from '../../../src/common/enum/token-audience-enum.js';

// 1. Mock Stripe
const mockStripeInstance = {
  customers: {
    create: jest.fn(),
  },
  paymentIntents: {
    create: jest.fn(),
    confirm: jest.fn(),
  },
};

jest.unstable_mockModule('stripe', () => {
  return {
    default: jest.fn().mockImplementation(() => mockStripeInstance),
  };
});

// 2. Mock the service layer (controllers now delegate to services)
jest.unstable_mockModule('../../../src/api/authentication/service.js', () => ({
  loginUser: jest.fn(),
  addUsersService: jest.fn(),
  googleLoginService: jest.fn(),
  registerUser: jest.fn(),
  googleSignUpService: jest.fn(),
  signUpDriver: jest.fn(),
  processPayment: jest.fn(),
  verifyEmailService: jest.fn(),
  forgotPasswordService: jest.fn(),
  verifyResetOtpService: jest.fn(),
  resetPasswordService: jest.fn(),
}));

// 3. Mock nodemailer config
jest.unstable_mockModule('../../../src/config/nodemailer-config.js', () => ({
  default: {
    sendMail: jest.fn((options, callback) => {
      if (callback) {
        callback(null, { response: 'ok' });
        return;
      }
      return Promise.resolve({ response: 'ok' });
    }),
  },
}));

// Mock cookies.js
const mockSetAuthCookies = jest.fn();
jest.unstable_mockModule('../../../src/utils/cookies.js', () => ({
  setAuthCookies: mockSetAuthCookies,
}));

// 4. Import modules dynamically after defining all mocks
const { addUserValidate, registerValidate, verifyEmailValidate } =
  await import('../../../src/api/authentication/validator.js');
const controller = await import('../../../src/api/authentication/controller.js');
const service = await import('../../../src/api/authentication/service.js');

describe('Authentication Module', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validator', () => {
    it('should validate correctly formatted request body for adding a user', async () => {
      const req = {
        body: {
          name: 'John Smith',
          email: 'johnsmith@example.com',
          phone_number: '9876543210',
          designation: 'Admin',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await addUserValidate(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should fail if email is invalid', async () => {
      const req = {
        body: {
          name: 'John Smith',
          email: 'invalid-email',
          phone_number: '9876543210',
          designation: 'Admin',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await addUserValidate(req, res, next);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('Register Validator', () => {
    it('should validate correctly formatted request body for registering', async () => {
      const req = {
        body: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'johndoe@example.com',
          password: 'Password@123',
          phone_number: '1234567890',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await registerValidate(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should fail if password does not meet complexity requirements', async () => {
      const req = {
        body: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'johndoe@example.com',
          password: 'weakpassword',
          phone_number: '1234567890',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await registerValidate(req, res, next);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('Verify Email Validator', () => {
    it('should validate correctly formatted request body for verify email', async () => {
      const req = {
        body: {
          email: 'johndoe@example.com',
          otp: '123456',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await verifyEmailValidate(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should fail if otp is invalid length', async () => {
      const req = {
        body: {
          email: 'johndoe@example.com',
          otp: '1234',
        },
      };
      const res = { send: jest.fn() };
      const next = jest.fn();

      await verifyEmailValidate(req, res, next);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('Controller - verifyEmail', () => {
    let originalEnv;

    beforeEach(() => {
      originalEnv = process.env;
      process.env = {
        ...originalEnv,
        ACCESS_TOKEN_TTL_SECONDS: '900',
        REFRESH_TOKEN_TTL_SECONDS: '2592000',
      };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should verify email and set cookies successfully', async () => {
      const mockData = { accessToken: 'access-token', refreshToken: 'refresh-token' };
      service.verifyEmailService.mockResolvedValue(mockData);

      const req = { body: { email: 'test@example.com', otp: '123456' } };
      const res = { send: jest.fn() };

      await controller.verifyEmail(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Email verified',
        accessToken: 'access-token',
      });
    });

    it('should use default TTL values if env vars are missing', async () => {
      delete process.env.ACCESS_TOKEN_TTL_SECONDS;
      delete process.env.REFRESH_TOKEN_TTL_SECONDS;
      const mockData = { accessToken: 'access-token', refreshToken: 'refresh-token' };
      service.verifyEmailService.mockResolvedValue(mockData);

      const req = { body: { email: 'test@example.com', otp: '123456' } };
      const res = { send: jest.fn() };

      await controller.verifyEmail(req, res);

      expect(mockSetAuthCookies).toHaveBeenCalledWith(
        res,
        TokenAudience.USER,
        expect.objectContaining({
          accessTtlMs: 900000,
          refreshTtlMs: 2592000000,
        })
      );
    });

    it('should return 404 if user not found', async () => {
      service.verifyEmailService.mockRejectedValue(new Error('User not found'));

      const req = { body: { email: 'wrong@example.com', otp: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await controller.verifyEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ success: false, message: 'User not found' });
    });

    it('should return 403 if account issues', async () => {
      service.verifyEmailService.mockRejectedValue(new Error('Account is blocked'));

      const req = { body: { email: 'blocked@example.com', otp: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await controller.verifyEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Account is blocked' });
    });

    it('should return 400 for other errors', async () => {
      service.verifyEmailService.mockRejectedValue(new Error('Invalid OTP'));

      const req = { body: { email: 'test@example.com', otp: 'wrong' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await controller.verifyEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Invalid OTP' });
    });
  });

  describe('Controller - register', () => {
    it('should register successfully', async () => {
      const mockData = { id: 'user-1' };
      service.registerUser.mockResolvedValue(mockData);

      const req = { body: { email: 'test@example.com', password: 'password' } };
      const res = { send: jest.fn() };

      await controller.register(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Registered successfully',
        data: mockData,
      });
    });

    it('should handle register failure', async () => {
      service.registerUser.mockRejectedValue(new Error('Email already exists'));

      const req = { body: { email: 'existing@example.com', password: 'password' } };
      const res = { send: jest.fn() };

      await controller.register(req, res);

      expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Email already exists' });
    });
  });

  describe('Controller - Login', () => {
    it('should return error if user does not exist', async () => {
      service.loginUser.mockRejectedValue(new Error('Invalid email or password'));
      const req = { body: { email: 'wrong@example.com', password: 'password' } };
      const res = { send: jest.fn() };

      await controller.Login(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
    });

    it('should handle driver login successfully (approved)', async () => {
      service.loginUser.mockResolvedValue({
        user: 'John Driver',
        designation: 'Driver',
        accessToken: 'token',
        refreshToken: 'refresh-token',
        permission: [{ menu: 'Dashboard', subMenu: 'Home' }],
      });

      const req = { body: { email: 'driver@example.com', password: 'password' } };
      const res = { send: jest.fn() };

      await controller.Login(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Login successfully',
        accessToken: 'token',
        refreshToken: 'refresh-token',
        data: expect.objectContaining({ designation: 'Driver' }),
      });
    });

    it('should fail driver login if needs approval', async () => {
      service.loginUser.mockRejectedValue(new Error('admin approval needed'));

      const req = { body: { email: 'driver@example.com', password: 'password' } };
      const res = { send: jest.fn() };

      await controller.Login(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'admin approval needed',
      });
    });

    it('should fail driver login if password is wrong', async () => {
      service.loginUser.mockRejectedValue(new Error('Invalid email or password'));

      const req = { body: { email: 'driver@example.com', password: 'wrong' } };
      const res = { send: jest.fn() };

      await controller.Login(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
    });

    it('should handle standard non-driver login successfully', async () => {
      service.loginUser.mockResolvedValue({
        user: 'Admin User',
        designation: 'Admin',
        accessToken: 'token',
        refreshToken: 'refresh-token',
        permission: [{ menu: 'Dashboard', subMenu: 'Home' }],
      });

      const req = { body: { email: 'admin@example.com', password: 'password' } };
      const res = { send: jest.fn() };

      await controller.Login(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Login successfully',
        accessToken: 'token',
        refreshToken: 'refresh-token',
        data: expect.objectContaining({ designation: 'Admin' }),
      });
    });

    it('should fail standard non-driver login if password is wrong', async () => {
      service.loginUser.mockRejectedValue(new Error('Invalid email or password'));

      const req = { body: { email: 'admin@example.com', password: 'wrong' } };
      const res = { send: jest.fn() };

      await controller.Login(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
    });

    it('should handle Login failures', async () => {
      service.loginUser.mockRejectedValue(new Error('Login DB fail'));
      const req = { body: { email: 'admin@example.com', password: 'wrong' } };
      const res = { send: jest.fn() };

      await controller.Login(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Login DB fail',
      });
    });
  });

  describe('Controller - googleLogin', () => {
    it('should login via google successfully', async () => {
      service.googleLoginService.mockResolvedValue({
        accessToken: 'google-token',
        refreshToken: 'google-refresh',
        user: 'Google User',
      });

      const req = { body: { token: 'google-token-id' } };
      const res = { send: jest.fn() };

      await controller.googleLogin(req, res);

      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Login successfully',
          accessToken: 'google-token',
        })
      );
    });

    it('should handle User Not Found in google login', async () => {
      service.googleLoginService.mockRejectedValue(new Error('User Not Found'));

      const req = { body: { token: 'google-token-id' } };
      const res = { send: jest.fn() };

      await controller.googleLogin(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'User Not Found',
      });
    });

    it('should handle non registered email in google login', async () => {
      service.googleLoginService.mockRejectedValue(new Error('Some other error'));

      const req = { body: { token: 'google-token-id' } };
      const res = { send: jest.fn() };

      await controller.googleLogin(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'non registered email',
      });
    });
  });

  describe('Controller - password workflows', () => {
    it('should handle forgotPassword successfully', async () => {
      service.forgotPasswordService.mockResolvedValue({ message: 'OTP sent' });

      const req = { body: { email: 'test@example.com' } };
      const res = { send: jest.fn() };

      await controller.forgotPassword(req, res);

      expect(res.send).toHaveBeenCalledWith({ success: true, message: 'OTP sent' });
    });

    it('should handle forgotPassword error', async () => {
      service.forgotPasswordService.mockRejectedValue(new Error('User not found'));

      const req = { body: { email: 'test@example.com' } };
      const res = { send: jest.fn() };

      await controller.forgotPassword(req, res);

      expect(res.send).toHaveBeenCalledWith({ success: false, message: 'User not found' });
    });

    it('should handle verifyResetOtp successfully', async () => {
      service.verifyResetOtpService.mockResolvedValue({ message: 'OTP verified' });

      const req = { body: { email: 'test@example.com', otp: '123456' } };
      const res = { send: jest.fn() };

      await controller.verifyResetOtp(req, res);

      expect(res.send).toHaveBeenCalledWith({ success: true, message: 'OTP verified' });
    });

    it('should handle verifyResetOtp error', async () => {
      service.verifyResetOtpService.mockRejectedValue(new Error('Invalid OTP'));

      const req = { body: { email: 'test@example.com', otp: '123456' } };
      const res = { send: jest.fn() };

      await controller.verifyResetOtp(req, res);

      expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Invalid OTP' });
    });

    it('should handle resetPassword successfully', async () => {
      service.resetPasswordService.mockResolvedValue({ message: 'Password reset' });

      const req = { body: { email: 'test@example.com', password: 'newpass' } };
      const res = { send: jest.fn() };

      await controller.resetPassword(req, res);

      expect(res.send).toHaveBeenCalledWith({ success: true, message: 'Password reset' });
    });

    it('should handle resetPassword error', async () => {
      service.resetPasswordService.mockRejectedValue(new Error('Reset failed'));

      const req = { body: { email: 'test@example.com', password: 'newpass' } };
      const res = { send: jest.fn() };

      await controller.resetPassword(req, res);

      expect(res.send).toHaveBeenCalledWith({ success: false, message: 'Reset failed' });
    });
  });
});
