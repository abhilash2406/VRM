import Brand from '../../models/brand.js';
import TruckModel from '../../models/truckModel.js';
import Variant from '../../models/variant.js';
import trucks from '../../models/truck.js';
import users from '../../models/users.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

/**
 * Retrieves all truck brands.
 * @returns {Promise<Array>} List of brand records.
 */
export const getTruckBrandsService = async () => {
  return await Brand.findAll();
};

/**
 * Retrieves all truck models.
 * @returns {Promise<Array>} List of truck model records.
 */
export const getTruckModelsService = async () => {
  return await TruckModel.findAll();
};

/**
 * Retrieves all truck variants.
 * @returns {Promise<Array>} List of variant records.
 */
export const getTruckVariantsService = async () => {
  return await Variant.findAll();
};

/**
 * Dynamically fetches brands, models, or variants depending on the provided payload IDs.
 * @param {Object} data - Payload containing optional brand_id or model_id.
 * @returns {Promise<Object>} Object containing the corresponding lookup data.
 */
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

/**
 * Registers a new truck in the system.
 * @param {Object} data - The truck details payload.
 * @param {Object} files - The uploaded files (rcPhoto, truck_photo).
 * @param {string} token - The authenticated user's JWT token.
 * @returns {Promise<boolean>} True if the truck is added.
 * @throws {Error} If the truck VIN or RC No already exists.
 */
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

/**
 * Retrieves all registered trucks.
 * @returns {Promise<Array>} List of all trucks.
 */
export const getAllTruckDataService = async () => {
  return await trucks.findAll();
};

/**
 * Retrieves only active trucks that are in working condition.
 * @returns {Promise<Array>} List of active trucks.
 */
export const getActiveTrucksService = async () => {
  return await trucks.findAll({ where: { is_active: true } });
};

/**
 * Fetches a single truck's record by ID.
 * @param {string} id - The truck UUID.
 * @returns {Promise<Object>} The truck record.
 */
export const truckToEditService = async (id) => {
  return await trucks.findByPk(id);
};

/**
 * Deletes a truck record.
 * @param {string} id - The truck UUID.
 * @returns {Promise<boolean>} True if deleted successfully.
 * @throws {Error} If the truck is not found.
 */
export const dltTruckService = async (id) => {
  const feedback = await trucks.findByPk(id);
  if (!feedback) {
    throw new Error('not matching data found to delete');
  }
  await feedback.destroy();
  return true;
};

/**
 * Updates an existing truck record.
 * @param {string} id - The truck UUID.
 * @param {Object} data - The updated truck payload.
 * @param {Object} files - The newly uploaded files.
 * @returns {Promise<boolean>} True if successfully updated.
 * @throws {Error} If the truck does not exist.
 */
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
