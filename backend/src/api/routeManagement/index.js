import express from 'express';
import { addRoutes, getAllRoutes, deleteRoute, getRoute } from './controller.js';
import { routeValidate } from './validator.js';
var router = express.Router();

router.post('/add', addRoutes);
router.get('/', getAllRoutes);
router.delete('/:id', deleteRoute);
router.get('/:id', getRoute);

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
