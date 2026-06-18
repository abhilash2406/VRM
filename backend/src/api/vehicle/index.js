import express from 'express';
import {
  addVehicle,
  getAllVehicles,
  getActiveVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from './controller.js';
import { VehicleValidate } from './validator.js';
import { upload } from '../../common/validation/uploader.js';

var router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vehicle Management
 *   description: APIs for managing vehicles
 */

/**
 * @swagger
 * /api/v1/trucks/add:
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
 *               - make
 *               - model_name
 *               - year
 *             properties:
 *               registration_number:
 *                 type: string
 *                 example: KL-01-AB-1234
 *               make:
 *                 type: string
 *                 example: Hyundai
 *               model_name:
 *                 type: string
 *                 example: Creta
 *               year:
 *                 type: integer
 *                 example: 2024
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
 *                 format: binary
 *               rc_photo:
 *                 type: string
 *                 format: binary
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
  upload.fields([
    { name: 'vehicle_photo', maxCount: 1 },
    { name: 'rc_photo', maxCount: 1 },
  ]),
  VehicleValidate,
  addVehicle
);

/**
 * @swagger
 * /api/v1/trucks/:
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
 * /api/v1/trucks/active:
 *   get:
 *     tags:
 *       - Vehicle Management
 *     summary: Get available vehicles
 *     description: Retrieves vehicles whose status is 'available'.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of available vehicles
 *       '401':
 *         description: Unauthorized
 */
router.get('/active', getActiveVehicles);

/**
 * @swagger
 * /api/v1/trucks/{id}:
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               registration_number:
 *                 type: string
 *               make:
 *                 type: string
 *               model_name:
 *                 type: string
 *               year:
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
 *                 format: binary
 *               rc_photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Vehicle updated successfully
 *       '404':
 *         description: Vehicle not found
 *   delete:
 *     tags:
 *       - Vehicle Management
 *     summary: Delete a vehicle
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
 *         description: Vehicle deleted successfully
 *       '404':
 *         description: Vehicle not found
 */
router
  .route('/:id')
  .get(getVehicleById)
  .delete(deleteVehicle)
  .patch(
    upload.fields([
      { name: 'vehicle_photo', maxCount: 1 },
      { name: 'rc_photo', maxCount: 1 },
    ]),
    VehicleValidate,
    updateVehicle
  );

export default router;
