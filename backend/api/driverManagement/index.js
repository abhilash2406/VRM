var express = require('express');
var router = express.Router();
const controller = require('./controller');
const validator = require('./validator');
const { upload } = require('../../middlewares/uploader');

router
  .route('/')
  .get(controller.getDriverDatas)
  .post(
    upload.fields([
      { name: 'userPhoto', maxCount: 1 },
      { name: 'licensePhoto', maxCount: 1 },
    ]),
    validator.driverValidate,
    controller.addDrivers
  );

router
  .route('/:id')
  .get(controller.viewDriver)
  .delete(controller.deleteDriver)
  .patch(
    upload.fields([
      { name: 'userPhoto', maxCount: 1 },
      { name: 'licensePhoto', maxCount: 1 },
    ]),
    validator.driverValidate,
    controller.updateDriver
  );
router.route('/active').get(controller.fetchActiveDrivers);
router.route('/reject/:id').patch(controller.rejectDriver);
router.route('/approve').patch(controller.approveDrivers);
router.route('/present').get(controller.presentDrivers);

module.exports = router;
