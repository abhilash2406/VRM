import express from 'express';
import {
  addTrips,
  getTrips,
  deleteTrip,
  getTripData,
  updateTrip,
  noOfTrips,
} from './controller.js';
import { tripValidate } from './validator.js';
var router = express.Router();

router.post('/', tripValidate, addTrips);
router.get('/', getTrips);
router.delete('/:id', deleteTrip);
router.get('/:id', getTripData);
router.patch('/:id', updateTrip);

router.post('/count', noOfTrips);

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
