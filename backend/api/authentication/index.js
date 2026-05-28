import express from 'express';
import * as controller from './controller.js';
import validate from './validator.js';
import { multiUpload, upload } from '../../middlewares/uploader.js';
var router = express.Router();

router.route('/login').post(controller.Login);
router.route('/GLogin').post(controller.googleLogin);
router.route('/signUp').post(controller.SignUp);
router.route('/GsignUp').post(controller.googleSignUp);
router.route('/userdata').post(
  upload.fields([
    { name: 'userPhoto', maxCount: 1 },
    { name: 'licensePhoto', maxCount: 1 },
    { name: 'truckPhoto', maxCount: 1 },
    { name: 'rcPhoto', maxCount: 1 },
  ]),
  controller.signUpUser
);
router.post('/payment', controller.proceedPayment);

router.route('/add-user').post(validate.addUserValidate, controller.addUsers);

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: APIs for user authentication and onboarding
 * paths:
 *   /auth/login:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Login a user
 *       description: Authenticate user using email and password.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *               required:
 *                 - email
 *                 - password
 *       responses:
 *         '200':
 *           description: Login successful
 *         '400':
 *           description: Bad request
 *   /auth/signUp:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Basic user registration
 *       description: Register a new account.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *               required:
 *                 - email
 *                 - password
 *       responses:
 *         '200':
 *           description: SignUp successful
 *   /auth/userdata:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Onboard driver with photos and truck details
 *       description: Driver details upload (multipart/form-data).
 *       requestBody:
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 userPhoto:
 *                   type: string
 *                   format: binary
 *                 licensePhoto:
 *                   type: string
 *                   format: binary
 *       responses:
 *         '200':
 *           description: Registration completed
 */

export default router;

