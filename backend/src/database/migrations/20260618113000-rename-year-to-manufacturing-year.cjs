'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('vehicles', 'year', 'manufacturing_year');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('vehicles', 'manufacturing_year', 'year');
  },
};
