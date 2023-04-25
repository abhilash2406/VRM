var express = require('express');
var router = express.Router();
const controller = require('./controller');
const { upload } = require('../../middlewares/uploader');

router.route('/brands').get(controller.getTruckBrands);
router.route('/models').get(controller.getTruckModels);
router.route('/variants').get(controller.getTruckVariants);

module.exports = router;
