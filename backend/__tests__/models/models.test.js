import { jest } from '@jest/globals';
import driver from '../../models/driver.js';
import login from '../../models/login.js';
import permissionSetting from '../../models/permissionSetting.js';
import transaction from '../../models/transaction.js';
import trip from '../../models/trip.js';
import truck from '../../models/truck.js';
import users from '../../models/users.js';

describe('Models Associations and Helpers', () => {
  it('should test associations', () => {
    const mockBelongsTo = jest.fn();
    const mockModels = {
      users: { belongsTo: mockBelongsTo },
      truck: { belongsTo: mockBelongsTo },
      route: { belongsTo: mockBelongsTo },
      designation: { belongsTo: mockBelongsTo },
      permission: { belongsTo: mockBelongsTo },
      driver: { belongsTo: mockBelongsTo },
      login: { belongsTo: mockBelongsTo },
    };

    // spy on each model's belongsTo or mock it
    driver.belongsTo = mockBelongsTo;
    login.belongsTo = mockBelongsTo;
    permissionSetting.belongsTo = mockBelongsTo;
    transaction.belongsTo = mockBelongsTo;
    trip.belongsTo = mockBelongsTo;
    truck.belongsTo = mockBelongsTo;
    users.belongsTo = mockBelongsTo;

    // Call associates
    driver.associate(mockModels);
    login.associate(mockModels);
    permissionSetting.associate(mockModels);
    transaction.associate(mockModels);
    trip.associate(mockModels);
    truck.associate(mockModels);
    users.associate(mockModels);

    expect(mockBelongsTo).toHaveBeenCalled();
  });

  it('should test login helper methods', async () => {
    expect(login.validatePassword('password123')).toBe(true);
    expect(login.validatePassword('short')).toBe(false);

    const salt = await login.generateSalt();
    expect(salt).toBeDefined();

    const hash = await login.hashPassword('password123', salt);
    expect(hash).toBeDefined();

    const verify = await login.verifyPassword('password123', hash, salt);
    expect(verify).toBe(true);

    const token = login.generateAuthToken({
      id: '123',
      email: 'test@example.com',
      password: 'pass',
      rememberMe: true,
    });
    expect(token).toBeDefined();

    const token2 = login.generateAuthToken({
      id: '123',
      email: 'test@example.com',
      password: 'pass',
      rememberMe: false,
    });
    expect(token2).toBeDefined();
  });
});
