import express from 'express';
import * as controller from './controller.js';
var router = express.Router();

router.get('/', controller.getAllPermissions);
router.post('/:id', controller.grantPermissions);
router.get('/permission/:id', controller.getUserData);

export default router;
