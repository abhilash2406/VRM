var express = require('express');
var router = express.Router();

router.use('/contact', require('../api/contactManagement/index'));
router.use('/auth', require('../api/authentication/index'));
router.use('/profile', require('../api/profileManagement/index'));
router.use('/designations', require('../api/designationManagement/index'));

module.exports = router;
