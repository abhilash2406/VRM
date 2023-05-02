const trucks = require('../../models/truck');
const routes = require('../../models/route');
const driver = require('../../models/driver');
const trips = require('../../models/trip');
const users = require('../../models/users');
const login = require('../../models/login');

exports.addTrips = async (req, res, next) => {
  try {
    console.log(req.body);
    const data = await trips.create({
      driverId: req.body.driver,
      truckId: req.body.truck,
      routeId: req.body.route,
    });

    res.send({
      success: true,
      message: 'successfully added trip',
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

exports.getTrips = async (req, res, next) => {
  const data = await trips.findAll({
    include: [
      {
        model: driver,
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
  try {
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};
