var express = require('express');
var router = express.Router();
const controller = require('./controller');
const validator = require('./validator');

router.route('/add').post( controller.addRoutes);
router.route('/').get(controller.getAllRoutes);
router.route('/:id').delete(controller.deleteRoute);

module.exports = router;
