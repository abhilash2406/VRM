import { jest } from '@jest/globals';
import driver from '../../src/models/driver.js';
import loginHistory from '../../src/models/loginHistory.js';
import permissionSetting from '../../src/models/permissionSetting.js';
import transaction from '../../src/models/transaction.js';
import trip from '../../src/models/trip.js';
import truck from '../../src/models/truck.js';
import users from '../../src/models/users.js';

describe('Models Associations', () => {
  it('should test associations', () => {
    const mockBelongsTo = jest.fn();
    const mockHasMany = jest.fn();
    const mockModels = {
      users: { belongsTo: mockBelongsTo, hasMany: mockHasMany },
      truck: { belongsTo: mockBelongsTo },
      route: { belongsTo: mockBelongsTo },
      designation: { belongsTo: mockBelongsTo },
      permission: { belongsTo: mockBelongsTo },
      driver: { belongsTo: mockBelongsTo },
      loginHistory: { belongsTo: mockBelongsTo },
    };

    // spy on each model's belongsTo or mock it
    driver.belongsTo = mockBelongsTo;
    loginHistory.belongsTo = mockBelongsTo;
    permissionSetting.belongsTo = mockBelongsTo;
    transaction.belongsTo = mockBelongsTo;
    trip.belongsTo = mockBelongsTo;
    truck.belongsTo = mockBelongsTo;
    users.belongsTo = mockBelongsTo;
    users.hasMany = mockHasMany;

    // Call associates
    driver.associate(mockModels);
    loginHistory.associate(mockModels);
    permissionSetting.associate(mockModels);
    transaction.associate(mockModels);
    trip.associate(mockModels);
    truck.associate(mockModels);
    users.associate(mockModels);

    expect(mockBelongsTo).toHaveBeenCalled();
  });

  it('should have users model with auth prototype methods', () => {
    const userInstance = Object.create(users.prototype);
    expect(typeof userInstance.verifyPassword).toBe('function');
    expect(typeof userInstance.generateAuthToken).toBe('function');
  });
});
