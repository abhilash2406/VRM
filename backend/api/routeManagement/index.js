import express from 'express';
import * as controller from './controller.js';
import validator from './validator.js';
var router = express.Router();

router.route('/add').post( controller.addRoutes);
router.route('/').get(controller.getAllRoutes);
router.route('/:id').delete(controller.deleteRoute).get(controller.getRoute);

/**
 * @swagger
 * tags:
 *   name: Routes
 *   description: APIs for managing routes
 * paths:
 *   /routes:
 *     get:
 *       tags:
 *         - Routes
 *       summary: Retrieve all routes
 *       responses:
 *         '200':
 *           description: A list of routes
 *   /routes/add:
 *     post:
 *       tags:
 *         - Routes
 *       summary: Add a new route
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 source:
 *                   type: string
 *                 destination:
 *                   type: string
 *                 distance:
 *                   type: number
 *       responses:
 *         '200':
 *           description: Route created successfully
 */

export default router;
