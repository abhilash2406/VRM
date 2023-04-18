var express = require('express');
var router = express.Router();
const controller = require('../contactManagement/controller');
const validate = require('./validator');

router.route('/').post(validate.contactValidate, controller.setContact);

module.exports = router;
