const routes = require('../../models/route');

exports.addRoutes = async (req, res, next) => {
  try {
    console.log('req.body', req.body);
    // (req.body.title = req.body.from + '-' + req.body.to),
    req.body.longitude = req.body.locations.map((data) => data.longitude);
    req.body.latitude = req.body.locations.map((data) => data.latitude);
    console.log('req.body.location.longitude', req.body.longitude);
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

exports.getAllRoutes = async (req, res) => {
  try {
    let data = await routes.findAll({});
    console.log('data', data);
    res.json({
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

exports.deleteRoute = async (req, res) => {
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
