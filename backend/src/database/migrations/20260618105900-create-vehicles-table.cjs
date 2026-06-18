'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vehicles', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      registration_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      make: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      model_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('available', 'booked', 'maintenance'),
        allowNull: false,
        defaultValue: 'available',
      },
      insurance_expiry: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      last_service_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      next_service_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      vehicle_photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rc_photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vehicles');
  },
};
