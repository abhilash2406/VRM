import trucks from '../../models/truck.js';
import routes from '../../models/route.js';
import drivers from '../../models/driver.js';
import trips from '../../models/trip.js';
import users from '../../models/users.js';
import loginHistory from '../../models/loginHistory.js';
import { Op } from 'sequelize';
import moment from 'moment';

export const addTripsService = async (data) => {
  const truck_exist = await trucks.findByPk(data.truck_id);
  if (!truck_exist) throw new Error('This truck does not exist');

  const route_exist = await routes.findByPk(data.route_id);
  if (!route_exist) throw new Error('This route does not exist');

  const driver_exists = await drivers.findByPk(data.driver_id);
  if (!driver_exists) throw new Error('This driver does not exist');
  if (driver_exists.status !== 'approved') throw new Error('This driver needs approval');

  const today = new Date();
  const inputDate = new Date(data.date);
  const status =
    inputDate.getTime() > today.getTime()
      ? 'scheduled'
      : ['ongoing', 'completed', 'cancelled'][Math.floor(Math.random() * 3)];

  const new_date = moment(data.date).format('YYYY-MM-DD');

  const tripData = await trips.create({
    driver_id: data.driver_id,
    truck_id: data.truck_id,
    route_id: data.route_id,
    date: new_date,
    status: status,
  });

  await drivers.update(
    { route_id: data.route_id, truck_id: data.truck_id },
    { where: { id: data.driver_id } }
  );

  return tripData;
};

export const getTripsService = async () => {
  return await trips.findAll({
    include: [
      {
        model: drivers,
        include: [{ model: users, include: [{ model: loginHistory }] }],
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
        include: [{ model: users, include: [{ model: loginHistory }] }],
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

  const driver = await drivers.findByPk(trip.driver_id);
  if (!driver) throw new Error('Driver not found');

  await driver.update({ route_id: null, truck_id: null });
  await trip.destroy();
  return true;
};

export const updateTripService = async (id, data) => {
  const truck_exist = await trucks.findByPk(data.truck_id);
  if (!truck_exist) throw new Error('This truck does not exist');

  const route_exist = await routes.findByPk(data.route_id);
  if (!route_exist) throw new Error('This route does not exist');

  const driver_exists = await drivers.findByPk(data.driver_id);
  if (!driver_exists) throw new Error('This driver does not exist');
  if (driver_exists.status !== 'approved') throw new Error('This driver needs approval');

  const today = new Date();
  const inputDate = new Date(data.date);
  const status =
    inputDate.getTime() > today.getTime()
      ? 'scheduled'
      : ['ongoing', 'completed', 'cancelled'][Math.floor(Math.random() * 3)];

  const new_date = moment(data.date).format('YYYY-MM-DD');

  await trips.update(
    {
      driver_id: data.driver_id,
      truck_id: data.truck_id,
      route_id: data.route_id,
      date: new_date,
      status: status,
    },
    { where: { id } }
  );

  await drivers.update(
    { route_id: data.route, truck_id: data.truck_id },
    { where: { id: data.driver_id } }
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
