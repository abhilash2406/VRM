import express from 'express';
import {
  Login,
  register,
  verifyEmail,
  googleLogin,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getAllUsers,
  addUser,
} from './controller.js';
import {
  loginValidate,
  registerValidate,
  verifyEmailValidate,
  forgotPasswordValidate,
  verifyResetOtpValidate,
  resetPasswordValidate,
  addUserValidate,
} from './validator.js';
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
 *     description: Authenticate user using either email and password, or phone number only.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 description: Required if using email
 *               phone_number:
 *                 type: string
 *                 description: The user's phone number (password not required)
 *               country_code:
 *                 type: string
 *                 description: Required if using phone_number
 *     responses:
 *       '200':
 *         description: Login successful
 *       '400':
 *         description: Bad request
 */
router.post('/login', loginValidate, Login);
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
 *               country_code:
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
router.post('/register', registerValidate, register);

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

router.post('/verify-email', verifyEmailValidate, verifyEmail);

/**
 * @swagger
 * /api/v1/auth/google-login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login via Google
 *     description: Authenticate user using a Google OAuth token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Login successful
 *       '400':
 *         description: User Not Found or non registered email
 */
router.post('/google-login', googleLogin);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Request a password reset
 *     description: Generates an OTP and sends it to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: Password reset OTP sent to email
 *       '400':
 *         description: User not found
 */
router.post('/forgot-password', forgotPasswordValidate, forgotPassword);

/**
 * @swagger
 * /api/v1/auth/verify-reset-otp:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify password reset OTP
 *     description: Checks if the provided OTP matches the one stored in Redis.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 pattern: '^\\d{6}$'
 *             required:
 *               - email
 *               - otp
 *     responses:
 *       '200':
 *         description: OTP verified successfully
 *       '400':
 *         description: Invalid or expired OTP
 */
router.post('/verify-reset-otp', verifyResetOtpValidate, verifyResetOtp);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Reset password
 *     description: Verifies the OTP and updates the user's password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 pattern: '^\\d{6}$'
 *               password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *             required:
 *               - email
 *               - otp
 *               - password
 *               - confirm_password
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *       '400':
 *         description: Invalid or expired OTP, or validation error
 */
router.post('/reset-password', resetPasswordValidate, resetPassword);

/**
 * @swagger
 * /api/v1/auth/users:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get all users
 *     description: Retrieve a list of all registered users
 *     responses:
 *       '200':
 *         description: Users fetched successfully
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/v1/auth/add-user:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Add a new user
 *     description: Create a new user (admin function)
 *     responses:
 *       '200':
 *         description: User created successfully
 */
router.post('/add-user', addUserValidate, addUser);

export default router;
