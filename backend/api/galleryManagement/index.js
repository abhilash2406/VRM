var express = require('express');
var router = express.Router();
const controller = require('./controller');
const { upload } = require('../../middlewares/uploader');

router
  .route('/')
  .post(upload.single('image'), controller.uploadImages)
  .get(controller.retrieveImages);

module.exports = router;
