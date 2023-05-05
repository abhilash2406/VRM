var express = require('express');
var router = express.Router();
const controller = require('../contactManagement/controller');
const validate = require('./validator');

router.route('/').post(validate.contactValidate, controller.setContact);
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
 *       phoneNumber:
 *         type: string
 *         description: The phoneNumber of user
 *       message:
 *          type: string
 *          description: message
 *     required:
 *       - first_name
 *       - email
 *       - phoneNumber
 *       - message
 */

module.exports = router;
