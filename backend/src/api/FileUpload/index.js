import express from 'express';
import { fileUpload, removeFileUpload } from './controller.js';
import validator from './validator.js';

const router = express.Router();

router.post('/', validator.uploadFile, fileUpload);
/**
 * @swagger
 * /api/file-upload:
 *   post:
 *      summary: Uplaod Image
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
 *                  type: file
 *                  required: true
 *                  description: upload your image here
 *      responses:
 *        200:
 *          description: Login successfully
 *        400:
 *          description: Bad request
 *        500:
 *          description: Internal server error
 */

router.post('/remove', removeFileUpload);
/**
 * @swagger
 * /api/file-upload/remove:
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
 *                 type: array
 *                 items:
 *                   type: string   # Each item in the array is a string
 *                 required: true
 *                 description: Upload your image here
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

export default router;
