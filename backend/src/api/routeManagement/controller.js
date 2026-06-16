import { addRoutesService, getAllRoutesService, deleteRouteService, getRouteService } from './service.js';

export const addRoutes = async (req, res, next) => {
  try {
    await addRoutesService(req.body);
    res.send({ success: true, message: 'route added successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const getAllRoutes = async (req, res) => {
  try {
    const data = await getAllRoutesService();
    res.send({ success: true, data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    await deleteRouteService(req.params.id);
    res.send({ success: true, message: 'deleted successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const getRoute = async (req, res) => {
  try {
    const data = await getRouteService(req.params.id);
    res.send({ success: true, data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};
