import {
  getDriverDatasList,
  addDriversService,
  updateDriverService,
  viewDriverService,
  fetchActiveDriversService,
  rejectDriverService,
  approveDriversService,
  deleteDriverService,
} from './service.js';

/**
 * Fetches the list of all drivers along with their associated user and login history.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const getDriverDatas = async (req, res, next) => {
  try {
    const data = await getDriverDatasList();
    res.send({ success: true, message: 'data fetched ', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Adds a new driver to the system. Also creates a linked user account and sends an email.
 * @param {import('express').Request} req - The Express request object containing driver details.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const addDrivers = async (req, res, next) => {
  try {
    await addDriversService(req.body, req.files);
    res.send({ success: true, message: ' driver Added successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Updates an existing driver's details and associated user profile.
 * @param {import('express').Request} req - The Express request object containing driver details and files.
 * @param {import('express').Response} res - The Express response object.
 */
export const updateDriver = async (req, res) => {
  try {
    await updateDriverService(req.params.id, req.body, req.files);
    res.send({ success: true, message: 'data updated' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Retrieves a single driver's profile by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const viewDriver = async (req, res) => {
  try {
    const data = await viewDriverService(req.params.id);
    res.send({ success: true, message: 'driver fetch successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Fetches all drivers with an 'approved' status.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const fetchActiveDrivers = async (req, res) => {
  try {
    const data = await fetchActiveDriversService();
    res.send({ success: true, message: 'data fetched ', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Rejects a driver's application.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const rejectDriver = async (req, res, next) => {
  try {
    await rejectDriverService(req.params.id);
    res.send({ success: true, message: 'rejected' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Approves a driver's application after verifying payment transaction.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const approveDrivers = async (req, res, next) => {
  try {
    await approveDriversService(req.params.id, req.body);
    res.send({ success: true, message: 'approved' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Deletes a driver along with their associated user and trip records.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const deleteDriver = async (req, res) => {
  try {
    await deleteDriverService(req.params.id);
    res.send({ success: true, message: 'Driver, user, and login records deleted successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};
