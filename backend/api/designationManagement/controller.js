const designation = require('../../models/designation');
const { Op } = require('sequelize');
const sequelize = require('../../config/sequelize-config');


exports.getAllDesignations = async (req, res, next) => {
  try {
    console.log('kevin')
    const data = await designation.findAll({
      where: {
        designation: {
          [Op.ne]: 'Admin',
        },
      },
    });
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


