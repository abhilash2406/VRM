var express = require('express');
var router = express.Router();
const controller = require('./controller');
const validate = require('./validator');

router.route('/login').post(controller.Login);

module.exports = router;
