import express from 'express';
import {
  viewProfile,
  getUserMessages,
  getMsgToRead,
  dltFeedback,
  ProfilePermissions,
  changePassword,
} from './controller.js';
var router = express.Router();

router.get('/view', viewProfile);
router.get('/feedback', getUserMessages);

router.get('/feedback/:id', getMsgToRead);
router.delete('/feedback/:id', dltFeedback);
router.post('/permissions', ProfilePermissions);
router.post('/change-password', changePassword);

export default router;
