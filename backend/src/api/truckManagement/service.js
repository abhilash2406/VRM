import Brand from '../../models/brand.js';
import TruckModel from '../../models/truckModel.js';
import Variant from '../../models/variant.js';
import trucks from '../../models/truck.js';
import users from '../../models/users.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

export const getTruckBrandsService = async () => {
  return await Brand.findAll();
};

export const getTruckModelsService = async () => {
  return await TruckModel.findAll();
};

export const getTruckVariantsService = async () => {
  return await Variant.findAll();
};

export const correspondingDataService = async (data) => {
  if (!data.brandId && !data.modelId) {
    const brand_data = await Brand.findAll({});
    return { brand: brand_data };
  } else if (data.brandId && !data.modelId) {
    const brand_data = await Brand.findAll({});
    const model_data = await TruckModel.findAll({ where: { brandId: data.brandId } });
    return { model: model_data, brand: brand_data };
  } else {
    const brand_data = await Brand.findAll({});
    const model_data = await TruckModel.findAll({ where: { brandId: data.brandId } });
    const variant_data = await Variant.findAll({ where: { modelId: data.modelId } });
    return { model: model_data, brand: brand_data, variant: variant_data };
  }
};

export const addTrucksService = async (data, files, token) => {
  const truck_exist = await trucks.findAll({
    where: {
      [Op.or]: [{ VIN: { [Op.like]: `%${data.VIN}%` } }, { RCNo: { [Op.like]: `%${data.RCNo}%` } }],
    },
  });

  if (truck_exist.length) {
    throw new Error('this truck is already added');
  }

  const rcPhotoPath = files['rcPhoto'][0].path.replace(/^public/, '');
  const truckPhotoPath = files['truckPhoto'][0].path.replace(/^public/, '');

  const truckBrand = await Brand.findOne({ where: { brandId: data.brand } });
  const truckModel = await TruckModel.findOne({ where: { modelId: data.model } });
  const truckVariant = await Variant.findOne({ where: { id: data.variant } });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const crctUser = await users.findByPk(decoded.id);

  await trucks.create({
    brand: truckBrand.name,
    model: truckModel.name,
    variant: truckVariant.name,
    VIN: data.VIN,
    engineNo: data.engineNo,
    chassisNo: data.chassisNo,
    RCNo: data.RCNo,
    yrManufacture: data.yrManufacture,
    rcPhoto: rcPhotoPath,
    truckPhoto: truckPhotoPath,
    condition: data.condition,
    status: data.status,
    isActive: data.status === 'active' && data.condition === 'working',
    createdBy: crctUser.id,
  });

  return true;
};

export const getAllTruckDataService = async () => {
  return await trucks.findAll();
};

export const getActiveTrucksService = async () => {
  return await trucks.findAll({ where: { isActive: true } });
};

export const truckToEditService = async (id) => {
  return await trucks.findByPk(id);
};

export const dltTruckService = async (id) => {
  const feedback = await trucks.findByPk(id);
  if (!feedback) {
    throw new Error('not matching data found to delete');
  }
  await feedback.destroy();
  return true;
};

export const updateTruckService = async (id, data, files) => {
  const truck_exist = await trucks.findByPk(id);
  if (!truck_exist) {
    throw new Error('truck not exists');
  }

  const rcPhotoPath = files['rcPhoto'][0].path.replace(/^public/, '');
  const truckPhotoPath = files['truckPhoto'][0].path.replace(/^public/, '');

  const truckBrand = await Brand.findOne({ where: { brandId: data.brand } });
  const truckModel = await TruckModel.findOne({ where: { modelId: data.model } });
  const truckVariant = await Variant.findOne({ where: { id: data.variant } });

  await truck_exist.update({
    brand: truckBrand.name,
    model: truckModel.name,
    variant: truckVariant.name,
    VIN: data.VIN,
    engineNo: data.engineNo,
    chassisNo: data.chassisNo,
    RCNo: data.RCNo,
    yrManufacture: data.yrManufacture,
    rcPhoto: rcPhotoPath,
    truckPhoto: truckPhotoPath,
    condition: data.condition,
    status: data.status,
    isActive: data.status === 'active' && data.condition === 'working',
  });

  return true;
};
