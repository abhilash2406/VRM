import express from 'express';
import * as controller from './controller.js';
var router = express.Router();

router.route('/view').get(controller.viewProfile);
router.route('/feedback').get(controller.getUserMessages);

router.route('/feedback/:id').get(controller.getMsgToRead).delete(controller.dltFeedback);
router.route('/permissions').post(controller.ProfilePermissions);
router.route('/change-password').post(controller.changePassword);

export default router;
