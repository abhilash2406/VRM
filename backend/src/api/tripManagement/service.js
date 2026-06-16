import trucks from '../../models/truck.js';
import routes from '../../models/route.js';
import drivers from '../../models/driver.js';
import trips from '../../models/trip.js';
import users from '../../models/users.js';
import login from '../../models/login.js';
import { Op } from 'sequelize';
import moment from 'moment';

export const addTripsService = async (data) => {
  const truck_exist = await trucks.findByPk(data.truckId);
  if (!truck_exist) throw new Error('This truck does not exist');

  const route_exist = await routes.findByPk(data.routeId);
  if (!route_exist) throw new Error('This route does not exist');

  const driver_exists = await drivers.findByPk(data.driverId);
  if (!driver_exists) throw new Error('This driver does not exist');
  if (driver_exists.status !== 'approved') throw new Error('This driver needs approval');

  const today = new Date();
  const inputDate = new Date(data.date);
  const status = inputDate.getTime() > today.getTime()
    ? 'scheduled'
    : ['ongoing', 'completed', 'cancelled'][Math.floor(Math.random() * 3)];

  const new_date = moment(data.date).format('YYYY-MM-DD');
  
  const tripData = await trips.create({
    driverId: data.driverId,
    truckId: data.truckId,
    routeId: data.routeId,
    date: new_date,
    status: status,
  });

  await drivers.update(
    { routeId: data.routeId, truckId: data.truckId },
    { where: { id: data.driverId } }
  );

  return tripData;
};

export const getTripsService = async () => {
  return await trips.findAll({
    include: [
      {
        model: drivers,
        include: [{ model: users, include: [{ model: login }] }],
      },
      { model: trucks },
      { model: routes },
    ],
  });
};

export const getTripDataService = async (id) => {
  return await trips.findOne({
    include: [
      {
        model: drivers,
        include: [{ model: users, include: [{ model: login }] }],
      },
      { model: trucks },
      { model: routes },
    ],
    where: { id },
  });
};

export const deleteTripService = async (id) => {
  const trip = await trips.findByPk(id);
  if (!trip) throw new Error('Trip not found');

  const driver = await drivers.findByPk(trip.driverId);
  if (!driver) throw new Error('Driver not found');

  await driver.update({ routeId: null, truckId: null });
  await trip.destroy();
  return true;
};

export const updateTripService = async (id, data) => {
  const truck_exist = await trucks.findByPk(data.truckId);
  if (!truck_exist) throw new Error('This truck does not exist');

  const route_exist = await routes.findByPk(data.routeId);
  if (!route_exist) throw new Error('This route does not exist');

  const driver_exists = await drivers.findByPk(data.driverId);
  if (!driver_exists) throw new Error('This driver does not exist');
  if (driver_exists.status !== 'approved') throw new Error('This driver needs approval');

  const today = new Date();
  const inputDate = new Date(data.date);
  const status = inputDate.getTime() > today.getTime()
    ? 'scheduled'
    : ['ongoing', 'completed', 'cancelled'][Math.floor(Math.random() * 3)];

  const new_date = moment(data.date).format('YYYY-MM-DD');

  await trips.update(
    {
      driverId: data.driverId,
      truckId: data.truckId,
      routeId: data.routeId,
      date: new_date,
      status: status,
    },
    { where: { id } }
  );

  await drivers.update(
    { routeId: data.route, truckId: data.truckId },
    { where: { id: data.driverId } }
  );

  return true;
};

export const noOfTripsService = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return await trips.findAll({
    where: { date: { [Op.gte]: thirtyDaysAgo } },
  });
};
