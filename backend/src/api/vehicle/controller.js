import {
  addVehicleService,
  getAllVehiclesService,
  getVehicleByIdService,
  updateVehicleService,
  updateVehicleStatusService,
  updateVehicleAvailabilityService,
} from './service.js';

/**
 * Adds a new vehicle record.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const addVehicle = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const data = await addVehicleService(req.body, userId);
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
    const data = await updateVehicleService(req.params.id, req.body);
    res.send({ success: true, message: 'Vehicle updated successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Updates the lifecycle status of a vehicle.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updateVehicleStatus = async (req, res) => {
  try {
    const data = await updateVehicleStatusService(req.params.id, req.body.status);
    res.send({ success: true, message: 'Vehicle status updated successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Updates the business availability status of a vehicle.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updateVehicleAvailability = async (req, res) => {
  try {
    const data = await updateVehicleAvailabilityService(req.params.id, req.body.availability_status);
    res.send({ success: true, message: 'Vehicle availability updated successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};


