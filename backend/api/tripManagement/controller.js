const trucks = require('../../models/truck');
const routes = require('../../models/route');
const drivers = require('../../models/driver');
const trips = require('../../models/trip');
const users = require('../../models/users');
const login = require('../../models/login');
const { where } = require('sequelize');

// add trips
exports.addTrips = async (req, res, next) => {
  try {
    console.log(req.body);
    const truck_exist = await trucks.findByPk(req.body.truck);
    if (!truck_exist) {
      res.send({
        success: false,
        message: 'This truck does not exist',
      });
    } else {
      const route_exist = await routes.findByPk(req.body.route);
      if (!route_exist) {
        res.send({
          success: false,
          message: 'This route does not exist',
        });
      } else {
        const driver_exists = await drivers.findByPk(req.body.driver);
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
          const check_trip = await trips.findOne({
            where: {
              driverId: req.body.driver,
            },
          });
          const status = check_trip
            ? 'scheduled'
            : ['ongoing', 'completed', 'cancelled'][
                Math.floor(Math.random() * 4)
              ];
          const data = await trips.create({
            driverId: req.body.driver,
            truckId: req.body.truck,
            routeId: req.body.route,
            status: status,
          });
          await drivers.update(
            {
              routeId: req.body.route,
              truckId: req.body.truck,
            },
            {
              where: {
                id: req.body.driver,
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

exports.getTrips = async (req, res, next) => {
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

exports.getTripData = async (req, res, next) => {
  const id = req.params.id;
  console.log('id', id);
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
exports.deleteTrip = async (req, res) => {
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
exports.updateTrip = async (req, res, next) => {
  try {
    console.log(req.body);
    const id = req.params.id;
    console.log('id', id);
    const truck_exist = await trucks.findByPk(req.body.truck);
    if (!truck_exist) {
      res.send({
        success: false,
        message: 'This truck does not exist',
      });
    } else {
      const route_exist = await routes.findByPk(req.body.route);
      if (!route_exist) {
        res.send({
          success: false,
          message: 'This route does not exist',
        });
      } else {
        const driver_exists = await drivers.findByPk(req.body.driver);
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
          const check_trip = await trips.findOne({
            where: {
              driverId: req.body.driver,
            },
          });
          const status = check_trip
            ? 'scheduled'
            : ['ongoing', 'completed', 'cancelled'][
                Math.floor(Math.random() * 4)
              ];
          const data = await trips.update(
            {
              driverId: req.body.driver,
              truckId: req.body.truck,
              routeId: req.body.route,
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
              truckId: req.body.truck,
            },
            {
              where: {
                id: req.body.driver,
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
