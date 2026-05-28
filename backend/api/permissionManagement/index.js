import express from 'express';
import * as controller from './controller.js';
var router = express.Router();

router.route('/').get(controller.getAllPermissions);
router.route('/:id').post(controller.grantPermissions);
router.route('/permission/:id').get(controller.getUserData);


export default router;
