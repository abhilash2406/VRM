'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('drivers', 'userPhoto');
    await queryInterface.addColumn('users', 'photo', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'photo');
    await queryInterface.addColumn('drivers', 'userPhoto', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
