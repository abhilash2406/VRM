var express = require('express');
var router = express.Router();
const controller = require('./controller');
const validate = require('./validator');

router.route('/login').post(controller.Login);
router.route('/GLogin').post(controller.googleLogin);
router.route('/signUp').post(controller.SignUp);
router.route('/GsignUp').post(controller.googleSignUp);



router.route('/add-user').post(validate.addUserValidate, controller.addUsers);

module.exports = router;
