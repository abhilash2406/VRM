import express from 'express';
import { setContact } from '../contactManagement/controller.js';
import { contactValidate } from './validator.js';
var router = express.Router();

router.post('/', contactValidate, setContact);
/**
 * @swagger
 * tags:
 *   name: contact
 *   description: APIs for contact form
 * paths:
 *   /contact:
 *     post:
 *       tags:
 *         - contact
 *       summary: submit your feedback
 *       description: submit your feedback.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: "#/definitions/contact"
 *       responses:
 *         '200':
 *           description: The created users
 *           content:
 *             application/json:
 *               schema:
 *         '400':
 *           description: Invalid request
 *         '500':
 *           description: Internal server error
 * definitions:
 *   contact:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         description: The name of the user
 *       email:
 *         type: string
 *         description: The email of user
 *       phone_number:
 *         type: string
 *         description: The phone_number of user
 *       message:
 *          type: string
 *          description: message
 *     required:
 *       - first_name
 *       - email
 *       - phone_number
 *       - message
 */

export default router;
