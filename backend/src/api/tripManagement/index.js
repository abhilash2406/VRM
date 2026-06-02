import express from 'express';
import * as controller from './controller.js';
import validate from './validator.js';
var router = express.Router();

router.route('/').post(validate.tripValidate, controller.addTrips).get(controller.getTrips);
router
  .route('/:id')
  .delete(controller.deleteTrip)
  .get(controller.getTripData)
  .patch(controller.updateTrip);

router.route('/count').post(controller.noOfTrips);

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
 *                 driverId:
 *                   type: string
 *                 truckId:
 *                   type: string
 *                 routeId:
 *                   type: string
 *       responses:
 *         '200':
 *           description: Trip created successfully
 */

export default router;
