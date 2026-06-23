'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Rename existing status to availability_status (already succeeded in previous run)
    // await queryInterface.renameColumn('vehicles', 'status', 'availability_status');

    // Rename the underlying Postgres enum type so the new column can create a fresh one
    await queryInterface.sequelize.query('ALTER TYPE "enum_vehicles_status" RENAME TO "enum_vehicles_availability_status";');

    // 2. Add new generic status column
    await queryInterface.addColumn('vehicles', 'status', {
      type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'INACTIVE', 'DELETED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert: remove generic status
    await queryInterface.removeColumn('vehicles', 'status');

    // Revert: rename back to status
    await queryInterface.renameColumn('vehicles', 'availability_status', 'status');
  },
};
