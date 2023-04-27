var express = require('express');
var router = express.Router();
const controller = require('./controller');
const { upload } = require('../../middlewares/uploader');

router
  .route('/')

  .get(controller.getDriverDatas)
  .post(
    upload.fields([
      { name: 'userPhoto', maxCount: 1 },
      { name: 'licensePhoto', maxCount: 1 },
    ]),
    controller.addDrivers
  );

router.route('/:id').delete(controller.dltDriver);
module.exports = router;
