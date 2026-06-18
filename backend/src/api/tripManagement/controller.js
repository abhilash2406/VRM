import {
  addTripsService,
  getTripsService,
  getTripDataService,
  deleteTripService,
  updateTripService,
  noOfTripsService,
} from './service.js';

/**
 * Creates a new trip assignment connecting a driver, a truck, and a route.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const addTrips = async (req, res, next) => {
  try {
    const data = await addTripsService(req.body);
    res.send({ success: true, message: 'Trip created successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Retrieves all trips along with their associated driver, truck, and route records.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const getTrips = async (req, res, next) => {
  try {
    const data = await getTripsService();
    res.send({ success: true, message: 'successfully fetched', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Retrieves a specific trip's data by its ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const getTripData = async (req, res, next) => {
  try {
    const data = await getTripDataService(req.params.id);
    res.send({ success: true, message: 'successfully fetched', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Deletes a trip and unassigns the truck and route from the driver.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const deleteTrip = async (req, res) => {
  try {
    await deleteTripService(req.params.id);
    res.send({ success: true, message: 'Trip deleted successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Updates an existing trip's truck, route, driver, and date.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export const updateTrip = async (req, res, next) => {
  try {
    const data = await updateTripService(req.params.id, req.body);
    res.send({ success: true, message: 'Trip updated successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

/**
 * Retrieves the count and records of trips scheduled in the last 30 days.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const noOfTrips = async (req, res) => {
  try {
    const data = await noOfTripsService();
    res.send({ success: true, message: 'no of trip in last 30 days', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};
