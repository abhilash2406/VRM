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

router.route('/:id').get(controller.viewDriver);
router.route('/active').get(controller.getActDrivers);
module.exports = router;
