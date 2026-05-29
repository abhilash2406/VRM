import { jest } from '@jest/globals';

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

// 2. Mock mail module to support both callbacks and promises
jest.unstable_mockModule('../../../modules/mail.js', () => ({
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

// 3. Mock Sequelize Models
jest.unstable_mockModule('../../../models/users.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/login.js', () => ({
  default: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    verifyPassword: jest.fn(),
    generateAuthToken: jest.fn(),
    generateSalt: jest.fn(),
    hashPassword: jest.fn(),
    update: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/designation.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/permissionSetting.js', () => ({
  default: {
    findAll: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/permission.js', () => ({
  default: {},
}));

jest.unstable_mockModule('../../../models/driver.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/transaction.js', () => ({
  default: {
    create: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/brand.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/truckModel.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/variant.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../models/truck.js', () => ({
  default: {
    findAll: jest.fn(),
    create: jest.fn(),
  },
}));

// 4. Import modules dynamically after defining all mocks
const { addUserValidate } = await import('../../../api/authentication/validator.js');
const controller = await import('../../../api/authentication/controller.js');
const users = await import('../../../models/users.js');
const login = await import('../../../models/login.js');
const designations = await import('../../../models/designation.js');
const permissionSetting = await import('../../../models/permissionSetting.js');
const permissions = await import('../../../models/permission.js');
const drivers = await import('../../../models/driver.js');
const transactions = await import('../../../models/transaction.js');
const transporter = await import('../../../modules/mail.js');
const Brand = await import('../../../models/brand.js');
const TruckModel = await import('../../../models/truckModel.js');
const Variant = await import('../../../models/variant.js');
const trucks = await import('../../../models/truck.js');

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

  describe('Controller - Login', () => {
    it('should return error if user does not exist', async () => {
      login.default.findOne.mockResolvedValue(null);
      const req = { body: { email: 'wrong@example.com', password: 'password' } };
      const res = { send: jest.fn() };

      await controller.Login(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
    });

    it('should handle driver login successfully (approved)', async () => {
      const mockUserLogin = {
        id: 'login-1',
        designationId: 'des-driver',
        password: 'hash',
        salt: 'salt',
      };
      login.default.findOne.mockResolvedValue(mockUserLogin);
      designations.default.findOne.mockResolvedValue({ id: 'des-driver', designation: 'Driver' });
      users.default.findOne.mockResolvedValue({ id: 'user-1' });
      drivers.default.findOne.mockResolvedValue({ id: 'driver-1', status: 'approved' });
      login.default.verifyPassword.mockResolvedValue(true);
      login.default.generateAuthToken.mockReturnValue('token');

      const mockUpdate = jest.fn();
      login.default.findByPk.mockResolvedValue({ id: 'login-1', update: mockUpdate });

      permissionSetting.default.findAll.mockResolvedValue([
        { permission: { menu: 'Dashboard', subMenu: 'Home' } },
      ]);

      const req = { body: { email: 'driver@example.com', password: 'password' } };
      const res = { send: jest.fn() };

      await controller.Login(req, res);

      expect(mockUpdate).toHaveBeenCalledWith({ token: 'token' });
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Login successfully',
        data: expect.objectContaining({ accessToken: 'token' }),
      });
    });

    it('should fail driver login if needs approval', async () => {
      const mockUserLogin = {
        id: 'login-1',
        designationId: 'des-driver',
        password: 'hash',
        salt: 'salt',
      };
      login.default.findOne.mockResolvedValue(mockUserLogin);
      designations.default.findOne.mockResolvedValue({ id: 'des-driver', designation: 'Driver' });
      users.default.findOne.mockResolvedValue({ id: 'user-1' });
      drivers.default.findOne.mockResolvedValue({ id: 'driver-1', status: 'pending' });

      const req = { body: { email: 'driver@example.com', password: 'password' } };
      const res = { send: jest.fn() };

      await controller.Login(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'admin approval needed',
      });
    });

    it('should fail driver login if password is wrong', async () => {
      const mockUserLogin = {
        id: 'login-1',
        designationId: 'des-driver',
        password: 'hash',
        salt: 'salt',
      };
      login.default.findOne.mockResolvedValue(mockUserLogin);
      designations.default.findOne.mockResolvedValue({ id: 'des-driver', designation: 'Driver' });
      users.default.findOne.mockResolvedValue({ id: 'user-1' });
      drivers.default.findOne.mockResolvedValue({ id: 'driver-1', status: 'approved' });
      login.default.verifyPassword.mockResolvedValue(false);

      const req = { body: { email: 'driver@example.com', password: 'wrong' } };
      const res = { send: jest.fn() };

      await controller.Login(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
    });

    it('should handle standard non-driver login successfully', async () => {
      const mockUserLogin = {
        id: 'login-1',
        designationId: 'des-admin',
        password: 'hash',
        salt: 'salt',
      };
      login.default.findOne.mockResolvedValue(mockUserLogin);
      designations.default.findOne.mockResolvedValue({ id: 'des-admin', designation: 'Admin' });
      login.default.verifyPassword.mockResolvedValue(true);
      login.default.generateAuthToken.mockReturnValue('token');

      const mockUpdate = jest.fn();
      login.default.findByPk.mockResolvedValue({ id: 'login-1', update: mockUpdate });
      users.default.findOne.mockResolvedValue({ name: 'Admin User' });

      permissionSetting.default.findAll.mockResolvedValue([
        { permission: { menu: 'Dashboard', subMenu: 'Home' } },
      ]);

      const req = { body: { email: 'admin@example.com', password: 'password' } };
      const res = { send: jest.fn() };

      await controller.Login(req, res);

      expect(mockUpdate).toHaveBeenCalledWith({ token: 'token' });
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Login successfully',
        data: expect.objectContaining({ designation: 'Admin' }),
      });
    });

    it('should fail standard non-driver login if password is wrong', async () => {
      const mockUserLogin = {
        id: 'login-1',
        designationId: 'des-admin',
        password: 'hash',
        salt: 'salt',
      };
      login.default.findOne.mockResolvedValue(mockUserLogin);
      designations.default.findOne.mockResolvedValue({ id: 'des-admin', designation: 'Admin' });
      login.default.verifyPassword.mockResolvedValue(false);

      const req = { body: { email: 'admin@example.com', password: 'wrong' } };
      const res = { send: jest.fn() };

      await controller.Login(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
    });

    it('should handle Login failures', async () => {
      login.default.findOne.mockRejectedValue(new Error('Login DB fail'));
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
      login.default.findOne.mockResolvedValue({ id: 'login-1' });
      const req = { body: { email: 'exists@example.com' } };
      const res = { send: jest.fn() };

      await controller.addUsers(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'user already exist',
      });
    });

    it('should add user successfully', async () => {
      login.default.findOne.mockResolvedValue(null);
      login.default.generateSalt.mockResolvedValue('salt');
      login.default.hashPassword.mockResolvedValue('hash');
      designations.default.findOne.mockResolvedValue({ id: 'des-1' });
      login.default.create.mockResolvedValue({ id: 'login-1' });
      users.default.create.mockResolvedValue({ id: 'user-1' });

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

      expect(login.default.create).toHaveBeenCalled();
      expect(users.default.create).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Added successfully',
      });
    });

    it('should handle addUsers failure', async () => {
      login.default.findOne.mockRejectedValue(new Error('Add fail'));
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
      login.default.findOne.mockResolvedValue(null);
      const req = { body: { token: 'gtoken', data: { data: { email: 'g@example.com' } } } };
      const res = { send: jest.fn() };

      await controller.googleLogin(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'non registered email',
      });
    });

    it('should handle google login successfully', async () => {
      const mockLogin = { id: 'login-1', designationId: 'des-1' };
      login.default.findOne.mockResolvedValue(mockLogin);
      users.default.findOne.mockResolvedValue({ name: 'Google User' });

      const mockUpdate = jest.fn();
      login.default.findByPk.mockResolvedValue({ id: 'login-1', update: mockUpdate });
      designations.default.findOne.mockResolvedValue({ id: 'des-1', designation: 'User' });
      permissionSetting.default.findAll.mockResolvedValue([
        { permission: { menu: 'Dashboard', subMenu: 'Home' } },
      ]);

      const req = { body: { token: 'gtoken', data: { data: { email: 'g@example.com' } } } };
      const res = { send: jest.fn() };

      await controller.googleLogin(req, res);

      expect(mockUpdate).toHaveBeenCalledWith({ token: 'gtoken' });
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Login successfully',
        data: expect.objectContaining({ user: 'Google User' }),
      });
    });
  });

  describe('Controller - SignUp', () => {
    it('should fail if user already exists', async () => {
      login.default.findOne.mockResolvedValue({ id: '1' });
      const req = { body: { email: 'exists@example.com' } };
      const res = { send: jest.fn() };

      await controller.SignUp(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'This user already exists',
      });
    });

    it('should sign up successfully', async () => {
      login.default.findOne.mockResolvedValue(null);
      const req = { body: { email: 'new@example.com' } };
      const res = { send: jest.fn() };

      await controller.SignUp(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: true,
        data: 'new@example.com',
      });
    });

    it('should handle SignUp failure', async () => {
      login.default.findOne.mockRejectedValue(new Error('Sign fail'));
      const req = { body: { email: 'new@example.com' } };
      const res = { send: jest.fn() };

      await controller.SignUp(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Sign fail',
      });
    });
  });

  describe('Controller - googleSignUp', () => {
    it('should fail if google user already exists', async () => {
      login.default.findOne.mockResolvedValue({ id: '1' });
      const req = { body: { data: { data: { email: 'exists@example.com' } } } };
      const res = { send: jest.fn() };

      await controller.googleSignUp(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'This user already exists',
      });
    });

    it('should google sign up successfully', async () => {
      login.default.findOne.mockResolvedValue(null);
      const req = { body: { data: { data: { email: 'new@example.com' } } } };
      const res = { send: jest.fn() };

      await controller.googleSignUp(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: true,
        data: 'new@example.com',
      });
    });

    it('should handle googleSignUp failure', async () => {
      login.default.findOne.mockRejectedValue(new Error('Google sign fail'));
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
      designations.default.findOne.mockResolvedValue({ id: 'des-driver' });
      login.default.findOne.mockResolvedValue({ id: 'login-1' });

      const req = { body: { email: 'exists@example.com', password: 'pass' } };
      const res = { send: jest.fn() };

      await controller.signUpUser(req, res);

      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'User already exist',
      });
    });

    it('should register driver successfully with brand and model (create truck)', async () => {
      designations.default.findOne.mockResolvedValue({ id: 'des-driver' });
      login.default.findOne.mockResolvedValue(null);
      login.default.create.mockResolvedValue({ id: 'login-1' });
      users.default.create.mockResolvedValue({ id: 'user-1' });
      trucks.default.findAll.mockResolvedValue([]);
      Brand.default.findOne.mockResolvedValue({ name: 'Volvo' });
      TruckModel.default.findOne.mockResolvedValue({ name: 'FH16' });
      Variant.default.findOne.mockResolvedValue({ name: 'Standard' });
      trucks.default.create.mockResolvedValue({ id: 'truck-1' });
      drivers.default.create.mockResolvedValue({ id: 'driver-1' });

      const req = {
        body: {
          email: 'driver@example.com',
          password: 'pass',
          first_name: 'John',
          phoneNumber: '1234',
          brand: 'b-1',
          model: 'm-1',
          variant: 'v-1',
          VIN: 'VIN123',
          engineNo: 'ENG123',
          chassisNo: 'CH123',
          RCNo: 'RC123',
          yrManufacture: '2023',
          condition: 'working',
          status: 'active',
          licenseNo: 'LIC123',
          licenseType: ['Heavy'],
        },
        files: {
          rcPhoto: [{ path: 'public/rc.png' }],
          truckPhoto: [{ path: 'public/truck.png' }],
          licensePhoto: [{ path: 'public/lic.png' }],
          userPhoto: [{ path: 'public/usr.png' }],
        },
      };
      const res = { send: jest.fn() };

      await controller.signUpUser(req, res);

      expect(trucks.default.create).toHaveBeenCalled();
      expect(drivers.default.create).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ driver: 'driver-1' }),
      });
    });

    it('should register driver successfully without brand and model', async () => {
      designations.default.findOne.mockResolvedValue({ id: 'des-driver' });
      login.default.findOne.mockResolvedValue(null);
      login.default.create.mockResolvedValue({ id: 'login-1' });
      users.default.create.mockResolvedValue({ id: 'user-1' });
      drivers.default.create.mockResolvedValue({ id: 'driver-1' });

      const req = {
        body: {
          email: 'driver@example.com',
          password: 'pass',
          first_name: 'John',
          phoneNumber: '1234',
          licenseNo: 'LIC123',
          licenseType: ['Heavy'],
          dailyWage: '500',
        },
        files: {
          licensePhoto: [{ path: 'public/lic.png' }],
          userPhoto: [{ path: 'public/usr.png' }],
        },
      };
      const res = { send: jest.fn() };

      await controller.signUpUser(req, res);

      expect(trucks.default.create).not.toHaveBeenCalled();
      expect(drivers.default.create).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ wage: '500' }),
      });
    });
  });

  describe('Controller - proceedPayment', () => {
    it('should process Stripe payment successfully', async () => {
      mockStripeInstance.customers.create.mockResolvedValue({ id: 'cust-1' });
      transactions.default.create.mockResolvedValue({ id: 'tx-1' });
      mockStripeInstance.paymentIntents.create.mockResolvedValue({ id: 'pi-1' });
      mockStripeInstance.paymentIntents.confirm.mockResolvedValue({ status: 'succeeded' });

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

      expect(mockStripeInstance.customers.create).toHaveBeenCalled();
      expect(transactions.default.create).toHaveBeenCalled();
      expect(mockStripeInstance.paymentIntents.create).toHaveBeenCalled();
      expect(mockStripeInstance.paymentIntents.confirm).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        data: { status: 'succeeded' },
      });
    });

    it('should handle Stripe processing failures in catch block', async () => {
      mockStripeInstance.customers.create.mockRejectedValue(new Error('Stripe error'));
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
