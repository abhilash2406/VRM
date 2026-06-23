'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'blood_group', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('drivers', 'license_expiry_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('drivers', 'experience_years', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('drivers', 'aadhar_no', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('drivers', 'emergency_contact_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('drivers', 'emergency_contact_number', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('drivers', 'availability_status', {
      type: Sequelize.ENUM('AVAILABLE', 'ON_TRIP', 'ON_LEAVE', 'SICK'),
      allowNull: true,
      defaultValue: 'AVAILABLE',
    });

    await queryInterface.addColumn('drivers', 'rating', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'blood_group');
    await queryInterface.removeColumn('drivers', 'license_expiry_date');
    await queryInterface.removeColumn('drivers', 'experience_years');
    await queryInterface.removeColumn('drivers', 'aadhar_no');
    await queryInterface.removeColumn('drivers', 'emergency_contact_name');
    await queryInterface.removeColumn('drivers', 'emergency_contact_number');
    await queryInterface.removeColumn('drivers', 'availability_status');
    await queryInterface.removeColumn('drivers', 'rating');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_drivers_availability_status";'
    );
  },
};
