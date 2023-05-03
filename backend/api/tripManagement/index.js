var express = require('express');
var router = express.Router();
const controller = require('./controller');

router.route('/').post(controller.addTrips).get(controller.getTrips);
router.route('/:id').delete(controller.deleteTrip);



module.exports = router;
