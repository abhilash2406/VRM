var express = require('express');
var router = express.Router();
const controller = require('./controller');

router.route('/').get(controller.getAllDesignations);
router.route('/').get(controller.getDesignations);


module.exports = router;
