'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add vehicle_subtype column
    await queryInterface.addColumn('vehicles', 'vehicle_subtype', {
      type: Sequelize.ENUM(
        'motorcycle', 'scooter',
        'sedan', 'suv', 'mpv', 'hatchback',
        'truck', 'mini-bus', 'full-bus', 'tempo'
      ),
      allowNull: true,
      after: 'vehicle_type',
    });

    // Add seating_capacity column
    await queryInterface.addColumn('vehicles', 'seating_capacity', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'vehicle_subtype',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'seating_capacity');
    await queryInterface.removeColumn('vehicles', 'vehicle_subtype');
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_vehicles_vehicle_subtype;"
    );
  },
};
