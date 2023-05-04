var express = require('express');
var router = express.Router();
const controller = require('./controller');
const validate = require('./validator');
const { upload } = require('../../middlewares/uploader');

router.route('/brands').get(controller.getTruckBrands);
router.route('/models').get(controller.getTruckModels);
router.route('/variants').get(controller.getTruckVariants);

router.route('/add').post(
  upload.fields([
    { name: 'rcPhoto', maxCount: 1 },
    { name: 'truckPhoto', maxCount: 1 },
  ]),
  validate.TruckValidate,
  controller.addTrucks
);
router.route('/get-data').post(controller.correspondingData);
router.route('/').get(controller.getAllTruckData);
router.route('/activeTrucks').get(controller.getActiveTrucks);
router
  .route('/:id')
  .get(controller.truckToEdit)
  .delete(controller.dltTruck)
  .patch(
    upload.fields([
      { name: 'rcPhoto', maxCount: 1 },
      { name: 'truckPhoto', maxCount: 1 },
    ]),
    validate.TruckValidate,
    controller.updateTruck
  );

module.exports = router;
