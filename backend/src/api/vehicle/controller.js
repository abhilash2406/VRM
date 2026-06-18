import {
  addVehicleService,
  getAllVehiclesService,
  getActiveVehiclesService,
  getVehicleByIdService,
  updateVehicleService,
  deleteVehicleService,
} from './service.js';

/**
 * Adds a new vehicle record.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const addVehicle = async (req, res) => {
  try {
    const token = req.header('Authorization')
      ? req.header('Authorization').replace('Bearer ', '')
      : null;
    const data = await addVehicleService(req.body, req.files, token);
    res.send({ success: true, message: 'Vehicle added successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Retrieves all vehicle records.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getAllVehicles = async (req, res) => {
  try {
    const data = await getAllVehiclesService();
    res.send({ success: true, message: 'Vehicles retrieved successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Retrieves only available vehicles.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getActiveVehicles = async (req, res) => {
  try {
    const data = await getActiveVehiclesService();
    res.send({ success: true, message: 'Available vehicles retrieved', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Retrieves a single vehicle by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getVehicleById = async (req, res) => {
  try {
    const data = await getVehicleByIdService(req.params.id);
    res.send({ success: true, message: 'Vehicle retrieved successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Updates an existing vehicle record.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updateVehicle = async (req, res) => {
  try {
    const data = await updateVehicleService(req.params.id, req.body, req.files);
    res.send({ success: true, message: 'Vehicle updated successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Deletes a vehicle record by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteVehicle = async (req, res) => {
  try {
    await deleteVehicleService(req.params.id);
    res.send({ success: true, message: 'Vehicle deleted successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};
