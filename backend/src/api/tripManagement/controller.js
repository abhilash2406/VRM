import { addTripsService, getTripsService, getTripDataService, deleteTripService, updateTripService, noOfTripsService } from './service.js';

export const addTrips = async (req, res, next) => {
  try {
    const data = await addTripsService(req.body);
    res.send({ success: true, message: 'Trip created successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const getTrips = async (req, res, next) => {
  try {
    const data = await getTripsService();
    res.send({ success: true, message: 'successfully fetched', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const getTripData = async (req, res, next) => {
  try {
    const data = await getTripDataService(req.params.id);
    res.send({ success: true, message: 'successfully fetched', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    await deleteTripService(req.params.id);
    res.send({ success: true, message: 'Trip deleted successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    const data = await updateTripService(req.params.id, req.body);
    res.send({ success: true, message: 'Trip updated successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const noOfTrips = async (req, res) => {
  try {
    const data = await noOfTripsService();
    res.send({ success: true, message: 'no of trip in last 30 days', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};
