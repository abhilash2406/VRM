import express from 'express';
import * as controller from './controller.js';
import validate from './validator.js';
var router = express.Router();

router.post('/', validate.tripValidate, controller.addTrips);
router.get('/', controller.getTrips);
router.delete('/:id', controller.deleteTrip);
router.get('/:id', controller.getTripData);
router.patch('/:id', controller.updateTrip);

router.post('/count', controller.noOfTrips);

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: APIs for managing trips
 * paths:
 *   /trips:
 *     get:
 *       tags:
 *         - Trips
 *       summary: Retrieve all trips
 *       responses:
 *         '200':
 *           description: A list of trips
 *     post:
 *       tags:
 *         - Trips
 *       summary: Create a new trip
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 driver_id:
 *                   type: string
 *                 truck_id:
 *                   type: string
 *                 route_id:
 *                   type: string
 *       responses:
 *         '200':
 *           description: Trip created successfully
 */

export default router;
