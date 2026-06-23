'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('drivers', 'truck_id');
    await queryInterface.removeColumn('drivers', 'route_id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('drivers', 'truck_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'vehicles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('drivers', 'route_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'routes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
};
