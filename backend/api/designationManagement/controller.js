const designation = require('../../models/designation');
const { Op } = require('sequelize');
const sequelize = require('../../config/sequelize-config');

exports.getAllDesignations = async (req, res, next) => {
  try {
    const data = await designation.findAll({ attributes: ['id', 'designation']});
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

exports.getDesignations = async (req, res, next) => {
  try {
    const data = await designation.findAll({
      where: {
        Designation: {
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
