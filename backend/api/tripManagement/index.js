var express = require('express');
var router = express.Router();
const controller = require('./controller');
const validate = require('./validator');

router
  .route('/')
  .post(validate.tripValidate, controller.addTrips)
  .get(controller.getTrips);
router
  .route('/:id')
  .delete(controller.deleteTrip)
  .get(controller.getTripData)
  .patch(controller.updateTrip);

router.route('/count').post(controller.noOfTrips);

module.exports = router;
