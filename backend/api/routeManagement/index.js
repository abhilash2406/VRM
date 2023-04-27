var express = require('express');
var router = express.Router();
const controller = require('./controller');

router.route('/add').post(controller.addRoutes).get(controller.getAllRoutes);

module.exports = router;
