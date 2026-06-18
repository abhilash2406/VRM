import designation from '../../models/designation.js';
import { Op } from 'sequelize';

/**
 * Fetches all designations excluding the 'Admin' role.
 * @returns {Promise<Array>} List of designation objects.
 */
export const getDesignationsList = async () => {
  return await designation.findAll({
    where: {
      designation: {
        [Op.ne]: 'Admin',
      },
    },
  });
};
