'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('trucks', 'yrManufacture', 'year_of_manufacture');
    await queryInterface.renameColumn('trucks', 'rcPhoto', 'rc_photo');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('trucks', 'year_of_manufacture', 'yrManufacture');
    await queryInterface.renameColumn('trucks', 'rc_photo', 'rcPhoto');
  },
};
