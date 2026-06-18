import {
  getTruckBrandsService,
  getTruckModelsService,
  getTruckVariantsService,
  correspondingDataService,
  addTrucksService,
  getAllTruckDataService,
  getActiveTrucksService,
  truckToEditService,
  dltTruckService,
  updateTruckService,
} from './service.js';

/**
 * Retrieves a list of all available truck brands.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const getTruckBrands = async (req, res, next) => {
  try {
    const data = await getTruckBrandsService();
    res.send({ success: true, message: 'brand fetched', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Retrieves a list of all truck models.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const getTruckModels = async (req, res, next) => {
  try {
    const data = await getTruckModelsService();
    res.send({ success: true, message: 'truck models fetched', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Retrieves a list of all truck variants.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const getTruckVariants = async (req, res, next) => {
  try {
    const data = await getTruckVariantsService();
    res.send({ success: true, message: 'truck variants fetched', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Fetches corresponding brands, models, or variants based on the provided IDs.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const correspondingData = async (req, res, next) => {
  try {
    const data = await correspondingDataService(req.body);
    res.send({ success: true, ...data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Adds a new truck to the database and associates it with the authenticated user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const addTrucks = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
      ? req.header('Authorization').replace('Bearer ', '')
      : null;
    await addTrucksService(req.body, req.files, token);
    res.send({ success: true, message: 'truck added' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Retrieves all truck records.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const getAllTruckData = async (req, res, next) => {
  try {
    const data = await getAllTruckDataService();
    res.send({ success: true, message: 'data retrieved successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Retrieves only the active truck records (is_active: true).
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const getActiveTrucks = async (req, res, next) => {
  try {
    const data = await getActiveTrucksService();
    res.send({ success: true, message: 'data retrieved successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Retrieves a specific truck's data by its ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const truckToEdit = async (req, res, next) => {
  try {
    const data = await truckToEditService(req.params.id);
    res.send({ success: true, message: 'data retrieved successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Deletes a truck record by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const dltTruck = async (req, res) => {
  try {
    await dltTruckService(req.params.id);
    res.send({ success: true, message: ' deleted successfully' });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

/**
 * Updates an existing truck record.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const updateTruck = async (req, res, next) => {
  try {
    await updateTruckService(req.params.id, req.body, req.files);
    res.send({ success: true, message: 'updated successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};
