import designation from '../../models/designation.js';
import { Op } from 'sequelize';

export const getDesignationsList = async () => {
  return await designation.findAll({
    where: {
      designation: {
        [Op.ne]: 'Admin',
      },
    },
  });
};
