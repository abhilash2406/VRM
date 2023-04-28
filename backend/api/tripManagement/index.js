var express = require('express');
var router = express.Router();
const controller = require('./controller');

router.route('/').post(controller.addTrips).get(controller.getTrips);
// router.route('/').get(controller.getAllRoutes);
// router.route('/:id').delete(controller.deleteRoute)

module.exports = router;
