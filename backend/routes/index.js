var express = require('express');
var router = express.Router();

router.use('/contact', require('../api/contactManagement/index'));
router.use('/auth', require('../api/authentication/index'));
router.use('/profile', require('../api/profileManagement/index'));
router.use('/designations', require('../api/designationManagement/index'));
router.use('/permissions', require('../api/permissionManagement/index'));
router.use('/gallery', require('../api/galleryManagement/index'));
router.use('/trucks', require('../api/truckManagement/index'));
router.use('/drivers', require('../api/driverManagement/index'));
router.use('/routes', require('../api/routeManagement/index'));
router.use('/trips', require('../api/tripManagement/index'));
router.use('/transactions', require('../api/transactionManagement/index'));



module.exports = router;
