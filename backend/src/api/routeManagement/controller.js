import {
  addRoutesService,
  getAllRoutesService,
  deleteRouteService,
  getRouteService,
} from './service.js';

/**
 * Adds a new route for truck trips.
 * @param {import('express').Request} req - The Express request object containing route data.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const addRoutes = async (req, res, next) => {
  try {
    await addRoutesService(req.body);
    res.send({ success: true, message: 'route added successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Retrieves all defined routes.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const getAllRoutes = async (req, res) => {
  try {
    const data = await getAllRoutesService();
    res.send({ success: true, data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Deletes a route by its ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const deleteRoute = async (req, res) => {
  try {
    await deleteRouteService(req.params.id);
    res.send({ success: true, message: 'deleted successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Retrieves a single route by its ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const getRoute = async (req, res) => {
  try {
    const data = await getRouteService(req.params.id);
    res.send({ success: true, data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};
