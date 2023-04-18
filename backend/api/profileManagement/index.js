var express = require('express');
var router = express.Router();
const controller = require('./controller');

router.route('/view').get(controller.viewProfile);
router
  .route('/feedback')
  .get(controller.getUserMessages)
  .patch(controller.approveMsg);

module.exports = router;
