var express = require('express');
var router = express.Router();
const controller = require('./controller');

router.route('/').get(controller.getAllPermissions);
router.route('/:id').post(controller.grantPermissions);
router.route('/permission/:id').get(controller.getUserData);


module.exports = router;
