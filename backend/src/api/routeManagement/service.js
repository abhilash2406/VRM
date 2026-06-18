import routes from '../../models/route.js';

/**
 * Formats data and creates a new route in the database.
 * @param {Object} data - The route payload, containing locations array, from, and to details.
 * @returns {Promise<Object>} The created route record.
 */
export const addRoutesService = async (data) => {
  data.title = data.from + '-' + data.to;
  data.longitude = data.locations.map((d) => d.longitude);
  data.latitude = data.locations.map((d) => d.latitude);
  data.status = 'read';

  return await routes.create(data);
};

/**
 * Retrieves all routes.
 * @returns {Promise<Array>} List of route objects.
 */
export const getAllRoutesService = async () => {
  return await routes.findAll({});
};

/**
 * Deletes a route record by ID.
 * @param {string} id - The route UUID.
 * @returns {Promise<boolean>} True if successfully deleted.
 * @throws {Error} If the route is not found.
 */
export const deleteRouteService = async (id) => {
  const Routes = await routes.findByPk(id);
  if (!Routes) {
    throw new Error('Route not found');
  }
  await Routes.destroy();
  return true;
};

/**
 * Fetches a single route record by ID.
 * @param {string} id - The route UUID.
 * @returns {Promise<Object>} The route object.
 */
export const getRouteService = async (id) => {
  return await routes.findByPk(id);
};
