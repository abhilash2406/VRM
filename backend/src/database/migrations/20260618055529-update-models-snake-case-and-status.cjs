'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const enumType = Sequelize.ENUM('ACTIVE', 'INACTIVE', 'BLOCKED', 'DELETED');

    // Helper to safely add column
    const addStatus = async (tableName) => {
      try {
        await queryInterface.addColumn(tableName, 'status', {
          type: Sequelize.STRING, // Using STRING to avoid postgres ENUM type creation conflicts on simple migration
          allowNull: false,
          defaultValue: 'ACTIVE',
        });
      } catch (e) {
        console.log(e);
      }
    };

    const rename = async (tableName, oldCol, newCol) => {
      try {
        await queryInterface.renameColumn(tableName, oldCol, newCol);
      } catch (e) {
        console.log(e);
      }
    };

    // brands
    await rename('brands', 'brandId', 'brand_id');
    await addStatus('brands');

    // contacts
    await rename('contacts', 'phoneNumber', 'phone_number');
    try {
      await queryInterface.removeColumn('contacts', 'status');
    } catch (e) {}
    await addStatus('contacts');

    // designations
    await addStatus('designations');

    // drivers
    await rename('drivers', 'licenseNo', 'license_no');
    await rename('drivers', 'licensePhoto', 'license_photo');
    await rename('drivers', 'licenseType', 'license_type');
    await rename('drivers', 'dailyWage', 'daily_wage');
    await rename('drivers', 'truckId', 'truck_id');
    await rename('drivers', 'routeId', 'route_id');
    await rename('drivers', 'userId', 'user_id');
    try {
      await queryInterface.removeColumn('drivers', 'status');
    } catch (e) {}
    await addStatus('drivers');

    // loginHistories
    await rename('login_histories', 'userId', 'user_id');
    await rename('login_histories', 'loginTime', 'login_time');
    await rename('login_histories', 'ipAddress', 'ip_address');
    await rename('login_histories', 'status', 'login_status');
    await addStatus('login_histories');

    // permissions
    await rename('permissions', 'subMenu', 'sub_menu');
    await addStatus('permissions');

    // permissionSettings
    await rename('permissionSettings', 'designationId', 'designation_id');
    await rename('permissionSettings', 'permissionId', 'permission_id');
    await addStatus('permissionSettings');

    // routes
    try {
      await queryInterface.removeColumn('routes', 'status');
    } catch (e) {}
    await addStatus('routes');

    // transactions
    await rename('transactions', 'driverId', 'driver_id');
    await addStatus('transactions');

    // trips
    await rename('trips', 'driverId', 'driver_id');
    await rename('trips', 'truckId', 'truck_id');
    await rename('trips', 'routeId', 'route_id');
    await rename('trips', 'status', 'trip_status');
    await addStatus('trips');

    // trucks
    await rename('trucks', 'engineNo', 'engine_no');
    await rename('trucks', 'chassisNo', 'chassis_no');
    await rename('trucks', 'RCNo', 'rc_no');
    await rename('trucks', 'truckPhoto', 'truck_photo');
    await rename('trucks', 'isActive', 'is_active');
    await rename('trucks', 'createdBy', 'created_by');
    try {
      await queryInterface.removeColumn('trucks', 'status');
    } catch (e) {}
    await addStatus('trucks');

    // truckModels
    await rename('truckModels', 'modelId', 'model_id');
    await rename('truckModels', 'brandId', 'brand_id');
    await addStatus('truckModels');

    // users
    await rename('users', 'designationId', 'designation_id');

    // variants
    await rename('variants', 'modelId', 'model_id');
    await addStatus('variants');

    // bookings
    await rename('bookings', 'envelopeId', 'envelope_id');
    await addStatus('bookings');

    // galleries
    await addStatus('galleries');
  },

  down: async (queryInterface, Sequelize) => {
    // Reverting this mass migration is omitted for brevity as it's purely destructive/one-way
  },
};
