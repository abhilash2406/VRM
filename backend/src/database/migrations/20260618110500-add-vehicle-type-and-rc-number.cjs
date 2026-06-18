'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add vehicle_type column
    await queryInterface.addColumn('vehicles', 'vehicle_type', {
      type: Sequelize.ENUM('two-wheeler', 'four-wheeler', 'heavy-vehicle'),
      allowNull: false,
      defaultValue: 'four-wheeler',
      after: 'status',
    });

    // Add rc_number column
    await queryInterface.addColumn('vehicles', 'rc_number', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'vehicle_type',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'rc_number');
    await queryInterface.removeColumn('vehicles', 'vehicle_type');
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_vehicles_vehicle_type;"
    );
  },
};
