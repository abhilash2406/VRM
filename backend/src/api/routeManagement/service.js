import routes from '../../models/route.js';

export const addRoutesService = async (data) => {
  data.title = data.from + '-' + data.to;
  data.longitude = data.locations.map((d) => d.longitude);
  data.latitude = data.locations.map((d) => d.latitude);
  data.status = 'read';
  
  return await routes.create(data);
};

export const getAllRoutesService = async () => {
  return await routes.findAll({});
};

export const deleteRouteService = async (id) => {
  const Routes = await routes.findByPk(id);
  if (!Routes) {
    throw new Error('Route not found');
  }
  await Routes.destroy();
  return true;
};

export const getRouteService = async (id) => {
  return await routes.findByPk(id);
};
