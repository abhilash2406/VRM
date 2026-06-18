import express from 'express';
import {
  viewProfile,
  getUserMessages,
  getMsgToRead,
  dltFeedback,
  ProfilePermissions,
  changePassword,
} from './controller.js';
import { changePasswordValidate } from './validator.js';
var router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile Management
 *   description: APIs for managing user profiles, permissions, and feedback
 */

/**
 * @swagger
 * /api/v1/profile/view:
 *   get:
 *     tags:
 *       - Profile Management
 *     summary: View user profile
 *     description: Retrieves the currently authenticated user's profile information.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Profile fetched successfully
 *       '401':
 *         description: Unauthorized
 */
router.get('/view', viewProfile);

/**
 * @swagger
 * /api/v1/profile/feedback:
 *   get:
 *     tags:
 *       - Profile Management
 *     summary: Get all user messages/feedback
 *     description: Fetches all contact messages sent by users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched feedback
 *       '401':
 *         description: Unauthorized
 */
router.get('/feedback', getUserMessages);

/**
 * @swagger
 * /api/v1/profile/feedback/{id}:
 *   get:
 *     tags:
 *       - Profile Management
 *     summary: Read a specific message
 *     description: Marks a specific contact message as read and fetches its details.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the feedback message
 *     responses:
 *       '200':
 *         description: Marked as read and fetched successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Message not found
 */

router.get('/feedback/:id', getMsgToRead);

/**
 * @swagger
 * /api/v1/profile/feedback/{id}:
 *   delete:
 *     tags:
 *       - Profile Management
 *     summary: Delete a specific message
 *     description: Deletes a specific contact feedback message.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the feedback message to delete
 *     responses:
 *       '200':
 *         description: Deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Message not found
 */
router.delete('/feedback/:id', dltFeedback);

/**
 * @swagger
 * /api/v1/profile/permissions:
 *   post:
 *     tags:
 *       - Profile Management
 *     summary: Get user permissions
 *     description: Retrieves the permissions and designation assigned to the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Permissions fetched successfully
 *       '401':
 *         description: Unauthorized
 */
router.post('/permissions', ProfilePermissions);

/**
 * @swagger
 * /api/v1/profile/change-password:
 *   post:
 *     tags:
 *       - Profile Management
 *     summary: Change user password
 *     description: Changes the authenticated user's password. Requires the current (old) password for verification, along with the new password and a confirmation value.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The user's current password
 *                 example: OldPass@123
 *               newPassword:
 *                 type: string
 *                 description: The desired new password (min 8 chars, must include uppercase, lowercase, number, and special character)
 *                 example: NewPass@456
 *               confirmPassword:
 *                 type: string
 *                 description: Must match newPassword exactly
 *                 example: NewPass@456
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: password changed successfully
 *       '400':
 *         description: Validation error or wrong old password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: The old password you entered is incorrect
 *       '401':
 *         description: Unauthorized
 */
router.post('/change-password', changePasswordValidate, changePassword);

export default router;
