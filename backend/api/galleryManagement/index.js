var express = require('express');
var router = express.Router();
const controller = require('./controller');
const { upload } = require('../../middlewares/uploader');

router.route('/').get(controller.retrieveImages);

router.route('/').post(upload.single('image'), controller.uploadImages);
router.route('/:id').delete(controller.dltImages);
module.exports = router;
