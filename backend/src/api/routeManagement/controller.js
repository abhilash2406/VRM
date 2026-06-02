import { logger } from '../../config/winston-config.js';
import routes from '../../models/route.js';

export const addRoutes = async (req, res, next) => {
  try {
    // logger.info('req.body', req.body);
    req.body.title = req.body.from + '-' + req.body.to;
    req.body.longitude = req.body.locations.map((data) => data.longitude);
    req.body.latitude = req.body.locations.map((data) => data.latitude);

    req.body.status = 'read';
    const data = await routes.create(req.body);
    res.send({
      success: true,
      message: 'route added successfully',
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

export const getAllRoutes = async (req, res) => {
  try {
    let data = await routes.findAll({});
    // logger.info('data', data);
    res.send({
      success: true,
      data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

//delete route
export const deleteRoute = async (req, res) => {
  const id = req.params.id;
  try {
    const Routes = await routes.findByPk(id);

    await Routes.destroy();
    res.send({
      success: true,
      message: 'deleted successfully',
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

//get route data
export const getRoute = async (req, res) => {
  const id = req.params.id;
  try {
    let data = await routes.findByPk(id);
    // logger.info('data', data);
    res.send({
      success: true,
      data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};
