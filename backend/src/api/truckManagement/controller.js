import { getTruckBrandsService, getTruckModelsService, getTruckVariantsService, correspondingDataService, addTrucksService, getAllTruckDataService, getActiveTrucksService, truckToEditService, dltTruckService, updateTruckService } from './service.js';

export const getTruckBrands = async (req, res, next) => {
  try {
    const data = await getTruckBrandsService();
    res.send({ success: true, message: 'brand fetched', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const getTruckModels = async (req, res, next) => {
  try {
    const data = await getTruckModelsService();
    res.send({ success: true, message: 'truck models fetched', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const getTruckVariants = async (req, res, next) => {
  try {
    const data = await getTruckVariantsService();
    res.send({ success: true, message: 'truck variants fetched', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const correspondingData = async (req, res, next) => {
  try {
    const data = await correspondingDataService(req.body);
    res.send({ success: true, ...data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const addTrucks = async (req, res, next) => {
  try {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;
    await addTrucksService(req.body, req.files, token);
    res.send({ success: true, message: 'truck added' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const getAllTruckData = async (req, res, next) => {
  try {
    const data = await getAllTruckDataService();
    res.send({ success: true, message: 'data retrieved successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const getActiveTrucks = async (req, res, next) => {
  try {
    const data = await getActiveTrucksService();
    res.send({ success: true, message: 'data retrieved successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const truckToEdit = async (req, res, next) => {
  try {
    const data = await truckToEditService(req.params.id);
    res.send({ success: true, message: 'data retrieved successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const dltTruck = async (req, res) => {
  try {
    await dltTruckService(req.params.id);
    res.send({ success: true, message: ' deleted successfully' });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

export const updateTruck = async (req, res, next) => {
  try {
    await updateTruckService(req.params.id, req.body, req.files);
    res.send({ success: true, message: 'updated successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};
