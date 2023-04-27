var express = require('express');
var router = express.Router();
const controller = require('./controller');
const { upload } = require('../../middlewares/uploader');

router
  .route('/')
  .delete(controller.dltDriver)
  .get(controller.getDriverDatas)
  .post(
    upload.fields([
      { name: 'userPhoto', maxCount: 1 },
      { name: 'licensePhoto', maxCount: 1 },
    ]),
    controller.addDrivers
  );
module.exports = router;
