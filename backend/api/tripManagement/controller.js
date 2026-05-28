import trucks from '../../models/truck.js';
import routes from '../../models/route.js';
import drivers from '../../models/driver.js';
import trips from '../../models/trip.js';
import users from '../../models/users.js';
import login from '../../models/login.js';
import { Op } from 'sequelize';
import moment from 'moment';

// add trips
export const addTrips = async (req, res, next) => {
  try {
    console.log(req.body);
    const truck_exist = await trucks.findByPk(req.body.truckId);
    if (!truck_exist) {
      res.send({
        success: false,
        message: 'This truck does not exist',
      });
    } else {
      const route_exist = await routes.findByPk(req.body.routeId);
      if (!route_exist) {
        res.send({
          success: false,
          message: 'This route does not exist',
        });
      } else {
        const driver_exists = await drivers.findByPk(req.body.driverId);
        if (!driver_exists) {
          res.send({
            success: false,
            message: 'This driver does not exist',
          });
        } else if (driver_exists.status !== 'approved') {
          res.send({
            success: false,
            message: 'This driver needs approval',
          });
        } else {
          const today = new Date();
          const inputDate = new Date(req.body.date);

          const status =
            inputDate.getTime() > today.getTime()
              ? 'scheduled'
              : ['ongoing', 'completed', 'cancelled'][
                  Math.floor(Math.random() * 3)
                ];

          let new_date = moment(req.body.date).format('YYYY-MM-DD');
          console.log(new_date);
          req.body.date = new_date;
          const data = await trips.create({
            driverId: req.body.driverId,
            truckId: req.body.truckId,
            routeId: req.body.routeId,
            date: req.body.date,
            status: status,
          });
          await drivers.update(
            {
              routeId: req.body.routeId,
              truckId: req.body.truckId,
            },
            {
              where: {
                id: req.body.driverId,
              },
            }
          );

          res.send({
            success: true,
            message: 'Trip created successfully',
            data,
          });
        }
      }
    }
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

export const getTrips = async (req, res, next) => {
  try {
    const data = await trips.findAll({
      include: [
        {
          model: drivers,
          include: [
            {
              model: users,
              include: [{ model: login }],
            },
          ],
        },
        { model: trucks },
        { model: routes },
      ],
    });
    // console.log(data);
    res.send({
      success: true,
      message: 'successfully fetched',
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

export const getTripData = async (req, res, next) => {
  const id = req.params.id;
  console.log('iiid', id);
  try {
    const data = await trips.findOne({
      include: [
        {
          model: drivers,
          include: [
            {
              model: users,
              include: [{ model: login }],
            },
          ],
        },
        { model: trucks },
        { model: routes },
      ],
      where: {
        id: id,
      },
    });
    // console.log(data);
    res.send({
      success: true,
      message: 'successfully fetched',
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

//delete trip
export const deleteTrip = async (req, res) => {
  const id = req.params.id;
  console.log('id', id);
  try {
    const trip = await trips.findByPk(id);
    if (!trip) {
      res.send({
        success: false,
        message: 'Trip not found',
      });
      return;
    }

    // find the associated driver record
    const driver = await drivers.findByPk(trip.driverId);
    if (!driver) {
      res.send({
        success: false,
        message: 'Driver not found',
      });
      return;
    }

    // set the routeId and truckId fields to null
    await driver.update({
      routeId: null,
      truckId: null,
    });

    // delete the trip record
    await trip.destroy();

    res.send({
      success: true,
      message: 'Trip deleted successfully',
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

//update trip
export const updateTrip = async (req, res, next) => {
  try {
    console.log(req.body);
    const id = req.params.id;
    console.log('id', id);
    const truck_exist = await trucks.findByPk(req.body.truckId);
    if (!truck_exist) {
      res.send({
        success: false,
        message: 'This truck does not exist',
      });
    } else {
      const route_exist = await routes.findByPk(req.body.routeId);
      if (!route_exist) {
        res.send({
          success: false,
          message: 'This route does not exist',
        });
      } else {
        const driver_exists = await drivers.findByPk(req.body.driverId);
        if (!driver_exists) {
          res.send({
            success: false,
            message: 'This driver does not exist',
          });
        } else if (driver_exists.status !== 'approved') {
          res.send({
            success: false,
            message: 'This driver needs approval',
          });
        } else {
          const today = new Date();
          const inputDate = new Date(req.body.date);

          const status =
            inputDate.getTime() > today.getTime()
              ? 'scheduled'
              : ['ongoing', 'completed', 'cancelled'][
                  Math.floor(Math.random() * 3)
                ];

          let new_date = moment(req.body.date).format('YYYY-MM-DD');
          console.log(new_date);
          req.body.date = new_date;
          const data = await trips.update(
            {
              driverId: req.body.driverId,
              truckId: req.body.truckId,
              routeId: req.body.routeId,
              date: req.body.date,
              status: status,
            },
            {
              where: {
                id: id,
              },
            }
          );
          await drivers.update(
            {
              routeId: req.body.route,
              truckId: req.body.truckId,
            },
            {
              where: {
                id: req.body.driverId,
              },
            }
          );

          res.send({
            success: true,
            message: 'Trip updated successfully',
            data,
          });
        }
      }
    }
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

// no of trips in last 30 days
export const noOfTrips = async (req, res) => {
  console.log('hy');
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  try {
    const numTrips = await trips.findAll({
      where: {
        date: { [Op.gte]: thirtyDaysAgo },
      },
    });
    res.send({
      success: true,
      message: 'no of trip in last 30 days',
      data: numTrips,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};
