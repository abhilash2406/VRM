const designation = require('../../models/designation');
const { Op } = require('sequelize');
const sequelize = require('../../config/sequelize-config');



exports.getDesignations = async (req, res, next) => {
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
