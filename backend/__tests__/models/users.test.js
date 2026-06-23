import { jest } from '@jest/globals';

const mockDefine = jest.fn((name, attributes, options) => {
  const model = function () {};
  model.options = options;
  model.prototype = {};
  model.hasMany = jest.fn();
  model.belongsTo = jest.fn();
  return model;
});

jest.unstable_mockModule('sequelize', () => ({
  Sequelize: { UUIDV4: 'UUIDV4' },
  DataTypes: {
    UUID: 'UUID',
    STRING: 'STRING',
    BOOLEAN: 'BOOLEAN',
    ENUM: jest.fn(() => 'ENUM'),
  },
}));

jest.unstable_mockModule('../../src/config/sequelize-config.js', () => ({
  default: {
    define: mockDefine,
  },
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: {
    genSalt: jest.fn(),
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn(),
  },
}));

jest.unstable_mockModule('../../src/config/winston-config.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Users Model', () => {
  let usersModel;
  let bcrypt;
  let jwt;

  beforeEach(async () => {
    jest.clearAllMocks();

    bcrypt = (await import('bcrypt')).default;
    jwt = (await import('jsonwebtoken')).default;
    usersModel = (await import('../../src/models/users.js')).default;
  });

  describe('Hooks', () => {
    it('beforeCreate should hash password if password_hash is provided', async () => {
      const { beforeCreate } = usersModel.options.hooks;
      bcrypt.genSalt.mockResolvedValue('test-salt');
      bcrypt.hash.mockResolvedValue('hashed-password');

      const user = { password_hash: 'plain-password' };
      await beforeCreate(user);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('plain-password', 'test-salt');
      expect(user.password_hash).toBe('hashed-password');
    });

    it('beforeCreate should not hash password if password_hash is not provided', async () => {
      const { beforeCreate } = usersModel.options.hooks;
      const user = { password_hash: null };

      await beforeCreate(user);

      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('beforeUpdate should hash password if password_hash has changed', async () => {
      const { beforeUpdate } = usersModel.options.hooks;
      bcrypt.genSalt.mockResolvedValue('test-salt');
      bcrypt.hash.mockResolvedValue('new-hashed-password');

      const user = {
        password_hash: 'new-plain-password',
        changed: jest.fn().mockReturnValue(true),
      };

      await beforeUpdate(user);

      expect(user.changed).toHaveBeenCalledWith('password_hash');
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('new-plain-password', 'test-salt');
      expect(user.password_hash).toBe('new-hashed-password');
    });

    it('beforeUpdate should not hash password if password_hash has not changed', async () => {
      const { beforeUpdate } = usersModel.options.hooks;
      const user = {
        password_hash: 'existing-password',
        changed: jest.fn().mockReturnValue(false),
      };

      await beforeUpdate(user);

      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  describe('Methods', () => {
    it('verifyPassword should compare passwords correctly', async () => {
      bcrypt.compare.mockResolvedValue(true);

      const context = { password_hash: 'stored-hash' };
      const result = await usersModel.prototype.verifyPassword.call(context, 'plain-text');

      expect(bcrypt.compare).toHaveBeenCalledWith('plain-text', 'stored-hash');
      expect(result).toBe(true);
    });

    it('generateAuthToken should generate token without rememberMe', async () => {
      jwt.sign.mockReturnValue('mock-token');
      process.env.JWT_SECRET = 'test-secret';

      const context = {
        id: 'user-123',
        email: 'test@example.com',
        password_hash: 'hash',
      };

      const token = usersModel.prototype.generateAuthToken.call(context);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: 'user-123',
          email: 'test@example.com',
          validity: 'hashuser-123test@example.com',
        },
        'test-secret',
        expect.objectContaining({ expiresIn: expect.any(Number) })
      );
      expect(token).toBe('mock-token');
    });

    it('generateAuthToken should generate token with rememberMe', async () => {
      jwt.sign.mockReturnValue('mock-token-long');
      process.env.JWT_SECRET = 'test-secret';

      const context = {
        id: 'user-123',
        email: 'test@example.com',
        password_hash: 'hash',
      };

      usersModel.prototype.generateAuthToken.call(context, true);

      expect(jwt.sign).toHaveBeenCalled();
    });

    it('generateAuthToken should use default secret if JWT_SECRET is not set', async () => {
      jwt.sign.mockReturnValue('mock-token-default');
      delete process.env.JWT_SECRET;

      const context = {
        id: 'user-123',
        email: 'test@example.com',
        password_hash: 'hash',
      };

      usersModel.prototype.generateAuthToken.call(context);

      expect(jwt.sign).toHaveBeenCalledWith(expect.any(Object), 'qwerty', expect.any(Object));
    });
  });

  describe('Associations', () => {
    it('should create associations correctly', () => {
      const models = {
        loginHistory: {},
        designation: {},
      };

      usersModel.associate(models);

      expect(usersModel.hasMany).toHaveBeenCalledWith(models.loginHistory, {
        foreignKey: 'user_id',
      });
      expect(usersModel.belongsTo).toHaveBeenCalledWith(models.designation, {
        foreignKey: 'designation_id',
      });
    });

    it('should handle missing optional associations gracefully', () => {
      const models = {
        loginHistory: {},
        // Missing designation
      };

      usersModel.associate(models);

      expect(usersModel.hasMany).toHaveBeenCalledWith(models.loginHistory, {
        foreignKey: 'user_id',
      });
      expect(usersModel.belongsTo).not.toHaveBeenCalled();
    });
  });
});
