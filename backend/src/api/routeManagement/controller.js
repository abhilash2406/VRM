import * as services from './service.js';

export const addRoutes = async (req, res, next) => {
  try {
    await services.addRoutesService(req.body);
    res.send({ success: true, message: 'route added successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const getAllRoutes = async (req, res) => {
  try {
    const data = await services.getAllRoutesService();
    res.send({ success: true, data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    await services.deleteRouteService(req.params.id);
    res.send({ success: true, message: 'deleted successfully' });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};

export const getRoute = async (req, res) => {
  try {
    const data = await services.getRouteService(req.params.id);
    res.send({ success: true, data });
  } catch (e) {
    res.send({ success: false, message: e.message });
  }
};
