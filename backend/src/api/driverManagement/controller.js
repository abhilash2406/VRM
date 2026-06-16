import { getDriverDatasList, addDriversService, updateDriverService, viewDriverService, fetchActiveDriversService, rejectDriverService, approveDriversService, deleteDriverService } from './service.js';

export const getDriverDatas = async (req, res, next) => {
  try {
    const data = await getDriverDatasList();
    res.send({ success: true, message: 'data fetched ', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const addDrivers = async (req, res, next) => {
  try {
    await addDriversService(req.body, req.files);
    res.send({ success: true, message: ' driver Added successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const updateDriver = async (req, res) => {
  try {
    await updateDriverService(req.params.id, req.body, req.files);
    res.send({ success: true, message: 'data updated' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const viewDriver = async (req, res) => {
  try {
    const data = await viewDriverService(req.params.id);
    res.send({ success: true, message: 'driver fetch successfully', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const fetchActiveDrivers = async (req, res) => {
  try {
    const data = await fetchActiveDriversService();
    res.send({ success: true, message: 'data fetched ', data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const rejectDriver = async (req, res, next) => {
  try {
    await rejectDriverService(req.params.id);
    res.send({ success: true, message: 'rejected' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const approveDrivers = async (req, res, next) => {
  try {
    await approveDriversService(req.params.id, req.body);
    res.send({ success: true, message: 'approved' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    await deleteDriverService(req.params.id);
    res.send({ success: true, message: 'Driver, user, and login records deleted successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};
