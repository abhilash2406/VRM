var express = require('express');
var router = express.Router();
const controller = require('./controller');

router.route('/view').get(controller.viewProfile);
router.route('/feedback').get(controller.getUserMessages);

router
  .route('/feedback/:id')
  .get(controller.getMsgToRead)
  .delete(controller.dltFeedback);
router.route('/permissions').post(controller.ProfilePermissions);
router.route('/change-password').post(controller.changePassword);

module.exports = router;
