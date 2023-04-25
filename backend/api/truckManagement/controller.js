const Brand = require('../../models/brand');
const TruckModel = require('../../models/truckModel');
const Variant = require('../../models/variant');

exports.getTruckBrands = async (req, res, next) => {
  try {
    const data = await Brand.findAll();
    res.send({
      success: true,
      message: 'brand fetched',
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

exports.getTruckModels = async (req, res, next) => {
  try {
    const data = await TruckModel.findAll();
    res.send({
      success: true,
      message: 'truck models fetched',
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

exports.getTruckVariants = async (req, res, next) => {
  try {
    const data = await Variant.findAll();
    res.send({
      success: true,
      message: 'truck variants fetched',
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};
