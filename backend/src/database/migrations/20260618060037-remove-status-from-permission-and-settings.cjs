'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('permissions', 'status');
    } catch (e) {
      console.log('Error removing status from permissions:', e.message);
    }
    try {
      await queryInterface.removeColumn('permissionSettings', 'status');
    } catch (e) {
      console.log('Error removing status from permissionSettings:', e.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Reverting not fully implemented, as adding it back requires ENUM knowledge.
  },
};
