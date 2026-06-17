import express from 'express';
import * as controller from './controller.js';
import validate from './validator.js';
import { multiUpload, upload } from '../../common/validation/uploader.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: APIs for user authentication and onboarding
 */

/**
 * @swagger
 * /auth/v1/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login a user
 *     description: Authenticate user using email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Login successful
 *       '400':
 *         description: Bad request
 */
router.post('/login', controller.Login);
/**
 * @swagger
 * /auth/v1/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Basic user registration
 *     description: Register a new account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *               - phone_number
 *     responses:
 *       '200':
 *         description: Registered successfully
 */
router.post('/register', validate.registerValidate, controller.register);
/**
 * @swagger
 * /auth/userdata:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Onboard driver with photos and truck details
 *     description: Driver details upload (multipart/form-data).
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               userPhoto:
 *                 type: string
 *                 format: binary
 *               licensePhoto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Registration completed
 */
router.post(
  '/userdata',
  upload.fields([
    { name: 'userPhoto', maxCount: 1 },
    { name: 'licensePhoto', maxCount: 1 },
    { name: 'truckPhoto', maxCount: 1 },
    { name: 'rcPhoto', maxCount: 1 },
  ]),
  controller.signUpUser
);

router.post('/add-user', validate.addUserValidate, controller.addUsers);

export default router;
