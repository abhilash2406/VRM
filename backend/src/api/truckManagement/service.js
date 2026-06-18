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
  if (!data.brand_id && !data.model_id) {
    const brand_data = await Brand.findAll({});
    return { brand: brand_data };
  } else if (data.brand_id && !data.model_id) {
    const brand_data = await Brand.findAll({});
    const model_data = await TruckModel.findAll({ where: { brand_id: data.brand_id } });
    return { model: model_data, brand: brand_data };
  } else {
    const brand_data = await Brand.findAll({});
    const model_data = await TruckModel.findAll({ where: { brand_id: data.brand_id } });
    const variant_data = await Variant.findAll({ where: { model_id: data.model_id } });
    return { model: model_data, brand: brand_data, variant: variant_data };
  }
};

export const addTrucksService = async (data, files, token) => {
  const truck_exist = await trucks.findAll({
    where: {
      [Op.or]: [
        { VIN: { [Op.like]: `%${data.VIN}%` } },
        { rc_no: { [Op.like]: `%${data.rc_no}%` } },
      ],
    },
  });

  if (truck_exist.length) {
    throw new Error('this truck is already added');
  }

  const rcPhotoPath = files['rcPhoto'][0].path.replace(/^public/, '');
  const truckPhotoPath = files['truck_photo'][0].path.replace(/^public/, '');

  const truckBrand = await Brand.findOne({ where: { brand_id: data.brand } });
  const truckModel = await TruckModel.findOne({ where: { model_id: data.model } });
  const truckVariant = await Variant.findOne({ where: { id: data.variant } });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const crctUser = await users.findByPk(decoded.id);

  await trucks.create({
    brand: truckBrand.name,
    model: truckModel.name,
    variant: truckVariant.name,
    VIN: data.VIN,
    engine_no: data.engine_no,
    chassis_no: data.chassis_no,
    rc_no: data.rc_no,
    yrManufacture: data.yrManufacture,
    rcPhoto: rcPhotoPath,
    truck_photo: truckPhotoPath,
    condition: data.condition,
    status: data.status,
    is_active: data.status === 'active' && data.condition === 'working',
    created_by: crctUser.id,
  });

  return true;
};

export const getAllTruckDataService = async () => {
  return await trucks.findAll();
};

export const getActiveTrucksService = async () => {
  return await trucks.findAll({ where: { is_active: true } });
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
  const truckPhotoPath = files['truck_photo'][0].path.replace(/^public/, '');

  const truckBrand = await Brand.findOne({ where: { brand_id: data.brand } });
  const truckModel = await TruckModel.findOne({ where: { model_id: data.model } });
  const truckVariant = await Variant.findOne({ where: { id: data.variant } });

  await truck_exist.update({
    brand: truckBrand.name,
    model: truckModel.name,
    variant: truckVariant.name,
    VIN: data.VIN,
    engine_no: data.engine_no,
    chassis_no: data.chassis_no,
    rc_no: data.rc_no,
    yrManufacture: data.yrManufacture,
    rcPhoto: rcPhotoPath,
    truck_photo: truckPhotoPath,
    condition: data.condition,
    status: data.status,
    is_active: data.status === 'active' && data.condition === 'working',
  });

  return true;
};
