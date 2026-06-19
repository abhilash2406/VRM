import express from 'express';
import {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  updateVehicleStatus,
  updateVehicleAvailability,
} from './controller.js';
import { VehicleValidate, VehicleStatusValidate, VehicleAvailabilityValidate } from './validator.js';

var router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vehicle Management
 *   description: APIs for managing vehicles
 */

/**
 * @swagger
 * /api/v1/vehicles/add:
 *   post:
 *     tags:
 *       - Vehicle Management
 *     summary: Add a new vehicle
 *     description: Registers a new vehicle. Optionally upload vehicle_photo and rc_photo.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - registration_number
 *               - manufacturer
 *               - model_name
 *               - manufacturing_year
 *               - vehicle_type
 *             properties:
 *               registration_number:
 *                 type: string
 *                 example: KL-01-AB-1234
 *               manufacturer:
 *                 type: string
 *                 example: Hyundai
 *               model_name:
 *                 type: string
 *                 example: Creta
 *               manufacturing_year:
 *                 type: integer
 *                 example: 2024
 *               vehicle_type:
 *                 type: string
 *                 enum: [two-wheeler, four-wheeler, heavy-vehicle]
 *                 example: four-wheeler
 *               vehicle_subtype:
 *                 type: string
 *                 enum: [motorcycle, scooter, sedan, suv, mpv, hatchback, truck, mini-bus, full-bus, tempo]
 *                 example: suv
 *               seating_capacity:
 *                 type: integer
 *                 example: 5
 *               status:
 *                 type: string
 *                 enum: [available, booked, maintenance]
 *                 example: available
 *               insurance_expiry:
 *                 type: string
 *                 format: date
 *                 example: 2026-12-31
 *               last_service_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-01-15
 *               next_service_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-07-15
 *               vehicle_photo:
 *                 type: string
 *                 description: Image key returned from the file upload API
 *               rc_photo:
 *                 type: string
 *                 description: Image key returned from the file upload API
 *     responses:
 *       '200':
 *         description: Vehicle added successfully
 *       '400':
 *         description: Validation error or duplicate registration number
 *       '401':
 *         description: Unauthorized
 */
router.post(
  '/add',
  VehicleValidate,
  addVehicle
);

/**
 * @swagger
 * /api/v1/vehicles/:
 *   get:
 *     tags:
 *       - Vehicle Management
 *     summary: Get all vehicles
 *     description: Retrieves all registered vehicles.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of all vehicles
 *       '401':
 *         description: Unauthorized
 */
router.get('/', getAllVehicles);



/**
 * @swagger
 * /api/v1/vehicles/{id}:
 *   get:
 *     tags:
 *       - Vehicle Management
 *     summary: Get a vehicle by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle UUID
 *     responses:
 *       '200':
 *         description: Vehicle record
 *       '404':
 *         description: Vehicle not found
 *   patch:
 *     tags:
 *       - Vehicle Management
 *     summary: Update a vehicle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle UUID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registration_number:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               model_name:
 *                 type: string
 *               manufacturing_year:
 *                 type: integer
 *               vehicle_type:
 *                 type: string
 *                 enum: [two-wheeler, four-wheeler, heavy-vehicle]
 *               vehicle_subtype:
 *                 type: string
 *                 enum: [motorcycle, scooter, sedan, suv, mpv, hatchback, truck, mini-bus, full-bus, tempo]
 *               seating_capacity:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [available, booked, maintenance]
 *               insurance_expiry:
 *                 type: string
 *                 format: date
 *               last_service_date:
 *                 type: string
 *                 format: date
 *               next_service_date:
 *                 type: string
 *                 format: date
 *               vehicle_photo:
 *                 type: string
 *               rc_photo:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Vehicle updated successfully
 *       '404':
 *         description: Vehicle not found
 */
router
  .route('/:id')
  .get(getVehicleById)
  .patch(
    VehicleValidate,
    updateVehicle
  );

/**
 * @swagger
 * /api/v1/vehicles/{id}/status:
 *   patch:
 *     tags:
 *       - Vehicle Management
 *     summary: Update vehicle lifecycle status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, BLOCKED, INACTIVE, DELETED]
 *                 example: INACTIVE
 *     responses:
 *       '200':
 *         description: Status updated successfully
 *       '400':
 *         description: Invalid status value
 */
router.patch('/:id/status', VehicleStatusValidate, updateVehicleStatus);

/**
 * @swagger
 * /api/v1/vehicles/{id}/availability:
 *   patch:
 *     tags:
 *       - Vehicle Management
 *     summary: Update vehicle availability status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availability_status:
 *                 type: string
 *                 enum: [available, booked, maintenance]
 *                 example: maintenance
 *     responses:
 *       '200':
 *         description: Availability status updated successfully
 *       '400':
 *         description: Invalid availability status value
 */
router.patch('/:id/availability', VehicleAvailabilityValidate, updateVehicleAvailability);

export default router;
