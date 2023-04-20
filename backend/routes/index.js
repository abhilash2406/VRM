var express = require('express');
var router = express.Router();

router.use('/contact', require('../api/contactManagement/index'));
router.use('/auth', require('../api/authentication/index'));
router.use('/profile', require('../api/profileManagement/index'));
router.use('/designations', require('../api/designationManagement/index'));
router.use('/permissions', require('../api/permissionManagement/index'));
router.use('/gallery', require('../api/galleryManagement/index'));

module.exports = router;
