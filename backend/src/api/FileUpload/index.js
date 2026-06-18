import express from 'express';
import { fileUpload, removeFileUpload } from './controller.js';
import validator from './validator.js';

const router = express.Router();

router.post('/', validator.uploadFile, fileUpload);
/**
 * @swagger
 * /api/v1/file-upload:
 *   post:
 *      summary: Upload Image
 *      tags:
 *        - Files
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                image:
 *                  type: string
 *                  format: binary
 *                  description: The file to upload
 *      responses:
 *        200:
 *          description: Image uploaded successfully
 *        400:
 *          description: Bad request
 *        500:
 *          description: Internal server error
 */

router.post('/remove', removeFileUpload);
/**
 * @swagger
 * /api/v1/file-upload/remove:
 *   post:
 *     summary: Remove an existing Image
 *     tags:
 *       - Files
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The key or path of the image to remove (can be comma-separated for multiple)
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

export default router;
