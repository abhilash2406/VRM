var express = require('express');
var router = express.Router();
const controller = require('./controller');
const { upload } = require('../../middlewares/uploader');

router.route('/brands').get(controller.getTruckBrands);
router.route('/models').get(controller.getTruckModels);
router.route('/variants').get(controller.getTruckVariants);
router.route('/add').post(
  upload.fields([
    { name: 'rcPhoto', maxCount: 1 },
    { name: 'truckPhoto', maxCount: 1 },
  ]),
  controller.addTrucks
);
router.route('/get-data').post(controller.correspondingData);

module.exports = router;
