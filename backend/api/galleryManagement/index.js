var express = require('express');
var router = express.Router();
const controller = require('./controller');
const { multiUpload } = require('../../middlewares/uploader');

router.route('/').post(multiUpload.array('imgs'), controller.uploadImages);

module.exports = router;
