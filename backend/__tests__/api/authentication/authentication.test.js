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
          phoneNumber: '9876543210',
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
          phoneNumber: '9876543210',
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
        data: expect.objectContaining({ accessToken: 'token' }),
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

  describe('Controller - addUsers', () => {
    it('should fail if user already exists', async () => {
      service.addUsersService.mockRejectedValue(new Error('user already exist'));
      const req = { body: { email: 'exists@example.com' } };
      const res = { send: jest.fn() };

      await controller.addUsers(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'user already exist',
      });
    });

    it('should add user successfully', async () => {
      service.addUsersService.mockResolvedValue(true);

      const req = {
        body: {
          email: 'new@example.com',
          name: 'New User',
          phoneNumber: '1234',
          designation: 'des-1',
        },
      };
      const res = { send: jest.fn() };

      await controller.addUsers(req, res);

      expect(service.addUsersService).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Added successfully',
      });
    });

    it('should handle addUsers failure', async () => {
      service.addUsersService.mockRejectedValue(new Error('Add fail'));
      const req = { body: { email: 'exists@example.com' } };
      const res = { send: jest.fn() };

      await controller.addUsers(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Add fail',
      });
    });
  });

  describe('Controller - googleLogin', () => {
    it('should fail google login if email is not registered', async () => {
      service.googleLoginService.mockRejectedValue(new Error('User Not Found'));
      const req = { body: { token: 'gtoken', data: { data: { email: 'g@example.com' } } } };
      const res = { send: jest.fn() };

      await controller.googleLogin(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'User Not Found',
      });
    });

    it('should fail google login with generic message for other errors', async () => {
      service.googleLoginService.mockRejectedValue(new Error('Some other error'));
      const req = { body: { token: 'gtoken', data: { data: { email: 'g@example.com' } } } };
      const res = { send: jest.fn() };

      await controller.googleLogin(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'non registered email',
      });
    });

    it('should handle google login successfully', async () => {
      service.googleLoginService.mockResolvedValue({
        user: 'Google User',
        designation: 'User',
        accessToken: 'gtoken',
        permission: [{ menu: 'Dashboard', subMenu: 'Home' }],
      });

      const req = { body: { token: 'gtoken', data: { data: { email: 'g@example.com' } } } };
      const res = { send: jest.fn() };

      await controller.googleLogin(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Login successfully',
        data: expect.objectContaining({ user: 'Google User' }),
      });
    });
  });

  describe('Controller - googleSignUp', () => {
    it('should fail if google user already exists', async () => {
      service.googleSignUpService.mockRejectedValue(new Error('This user already exists'));
      const req = { body: { data: { data: { email: 'exists@example.com' } } } };
      const res = { send: jest.fn() };

      await controller.googleSignUp(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'This user already exists',
      });
    });

    it('should google sign up successfully', async () => {
      service.googleSignUpService.mockResolvedValue('new@example.com');
      const req = { body: { data: { data: { email: 'new@example.com' } } } };
      const res = { send: jest.fn() };

      await controller.googleSignUp(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: true,
        data: 'new@example.com',
      });
    });

    it('should handle googleSignUp failure', async () => {
      service.googleSignUpService.mockRejectedValue(new Error('Google sign fail'));
      const req = { body: { data: { data: { email: 'new@example.com' } } } };
      const res = { send: jest.fn() };

      await controller.googleSignUp(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Google sign fail',
      });
    });
  });

  describe('Controller - signUpUser', () => {
    it('should fail if user already exists', async () => {
      service.signUpDriver.mockRejectedValue(new Error('User already exist'));

      const req = { body: { email: 'exists@example.com', password: 'pass' } };
      const res = { send: jest.fn() };

      await controller.signUpUser(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'User already exist',
      });
    });

    it('should register driver successfully with brand and model (create truck)', async () => {
      service.signUpDriver.mockResolvedValue({
        name: 'John',
        email: 'driver@example.com',
        phn: '1234',
        wage: 1000,
        driver: 'driver-1',
      });

      const req = {
        body: {
          email: 'driver@example.com',
          password: 'pass',
          first_name: 'John',
          phoneNumber: '1234',
          brand: 'b-1',
          model: 'm-1',
        },
        files: {},
      };
      const res = { send: jest.fn() };

      await controller.signUpUser(req, res);

      expect(service.signUpDriver).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ driver: 'driver-1' }),
      });
    });

    it('should register driver successfully without brand and model', async () => {
      service.signUpDriver.mockResolvedValue({
        name: 'John',
        email: 'driver@example.com',
        phn: '1234',
        wage: '500',
        driver: 'driver-1',
      });

      const req = {
        body: {
          email: 'driver@example.com',
          password: 'pass',
          first_name: 'John',
          phoneNumber: '1234',
          licenseNo: 'LIC123',
          dailyWage: '500',
        },
        files: {},
      };
      const res = { send: jest.fn() };

      await controller.signUpUser(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ wage: '500' }),
      });
    });
  });

  describe('Controller - proceedPayment', () => {
    it('should process Stripe payment successfully', async () => {
      service.processPayment.mockResolvedValue({ status: 'succeeded' });

      const req = {
        body: {
          id: 'pm-1',
          userData: {
            name: 'John',
            email: 'john@example.com',
            phn: '1234',
            mail: 'john@example.com',
            driver: 'driver-1',
          },
        },
      };
      const res = { send: jest.fn(), json: jest.fn() };

      await controller.proceedPayment(req, res);

      expect(service.processPayment).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        data: { status: 'succeeded' },
      });
    });

    it('should handle Stripe processing failures in catch block', async () => {
      service.processPayment.mockRejectedValue(new Error('Stripe error'));
      const req = {
        body: {
          id: 'pm-1',
          userData: {
            name: 'John',
          },
        },
      };
      const res = { send: jest.fn(), json: jest.fn() };

      await controller.proceedPayment(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });
});
