import express from 'express';
import inline_api_contactManagement_index from '../api/contactManagement/index.js';
import inline_api_authentication_index from '../api/authentication/index.js';
import inline_api_profileManagement_index from '../api/profileManagement/index.js';
import inline_api_designationManagement_index from '../api/designationManagement/index.js';
import inline_api_permissionManagement_index from '../api/permissionManagement/index.js';
import inline_api_galleryManagement_index from '../api/galleryManagement/index.js';
import inline_api_truckManagement_index from '../api/truckManagement/index.js';
import inline_api_driverManagement_index from '../api/driverManagement/index.js';
import inline_api_routeManagement_index from '../api/routeManagement/index.js';
import inline_api_tripManagement_index from '../api/tripManagement/index.js';
import inline_api_transactionManagement_index from '../api/transactionManagement/index.js';
import auth from '../middlewares/auth.js';
var router = express.Router();

router.use('/contact', inline_api_contactManagement_index);
router.use('/auth', inline_api_authentication_index);
router.use('/profile', auth, inline_api_profileManagement_index);
router.use('/designations', auth, inline_api_designationManagement_index);
router.use('/permissions', auth, inline_api_permissionManagement_index);
router.use('/gallery', auth, inline_api_galleryManagement_index);
router.use('/trucks', auth, inline_api_truckManagement_index);
router.use('/drivers', auth, inline_api_driverManagement_index);
router.use('/routes', inline_api_routeManagement_index);
router.use('/trips', auth, inline_api_tripManagement_index);
router.use('/transactions', auth, inline_api_transactionManagement_index);

export default router;
