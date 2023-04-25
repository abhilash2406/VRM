var express = require('express');
var router = express.Router();

const { success } = require('./controller');

router.post('/', success);
router.get('/', success);
module.exports = router;