import designation from '../../models/designation.js';
import { Op } from 'sequelize';
import sequelize from '../../config/sequelize-config.js';



export const getDesignations = async (req, res, next) => {
  try {
    const data = await designation.findAll({
      where: {
        designation: {
          [Op.ne]: 'Admin',
        },
      },
    });
    console.log('data', data)
    res.send({
      success: true,
      message: 'data retrieval success',
      data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e,
    });
  }
};
