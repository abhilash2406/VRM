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
 * /api/v1/auth/login:
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
router.post('/login', validate.loginValidate, controller.Login);
/**
 * @swagger
 * /api/v1/auth/register:
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
 * /api/v1/auth/verify-email:
 *   post:
 *     summary: Verify an email-verification OTP
 *     description: >
 *       Confirms the OTP, activates the account, and logs the user in by
 *       returning an access token and setting the httpOnly refresh-token
 *       cookie.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 pattern: '^\\d{6}$'
 *                 example: '483912'
 *     responses:
 *       200:
 *         description: Email verified — access token returned, refresh cookie set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Email verified }
 *                 accessToken: { type: string }
 *       400:
 *         description: Validation error or invalid/expired OTP
 *       403:
 *         description: Account is blocked or deleted
 *       404:
 *         description: User not found
 */

router.post('/verify-email', validate.verifyEmailValidate, controller.verifyEmail);

export default router;
