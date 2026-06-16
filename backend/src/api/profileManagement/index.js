import express from 'express';
import * as controller from './controller.js';
var router = express.Router();

router.get('/view', controller.viewProfile);
router.get('/feedback', controller.getUserMessages);

router.get('/feedback/:id', controller.getMsgToRead).delete(controller.dltFeedback);
router.post('/permissions', controller.ProfilePermissions);
router.post('/change-password', controller.changePassword);

export default router;
