import express from 'express';
import {
  getDriverDatas,
  addDrivers,
  viewDriver,
  deleteDriver,
  updateDriver,
  fetchActiveDrivers,
  rejectDriver,
  approveDrivers,
} from './controller.js';
import { driverValidate } from './validator.js';
import { upload } from '../../common/validation/uploader.js';
var router = express.Router();

router
  .route('/')
  .get(getDriverDatas)
  .post(
    upload.fields([
      { name: 'userPhoto', maxCount: 1 },
      { name: 'license_photo', maxCount: 1 },
    ]),
    driverValidate,
    addDrivers
  );

router
  .route('/:id')
  .get(viewDriver)
  .delete(deleteDriver)
  .patch(
    upload.fields([
      { name: 'userPhoto', maxCount: 1 },
      { name: 'license_photo', maxCount: 1 },
    ]),
    driverValidate,
    updateDriver
  );
router.get('/active', fetchActiveDrivers);
router.patch('/reject/:id', rejectDriver);
router.patch('/approve/:id', approveDrivers);

/**
 * @swagger
 * tags:
 *   name: Drivers
 *   description: APIs for managing drivers
 * paths:
 *   /drivers:
 *     get:
 *       tags:
 *         - Drivers
 *       summary: Retrieve all drivers
 *       responses:
 *         '200':
 *           description: A list of drivers
 *     post:
 *       tags:
 *         - Drivers
 *       summary: Register a new driver
 *       requestBody:
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 userPhoto:
 *                   type: string
 *                   format: binary
 *                 license_photo:
 *                   type: string
 *                   format: binary
 *       responses:
 *         '200':
 *           description: Driver added successfully
 *   /drivers/{id}:
 *     get:
 *       tags:
 *         - Drivers
 *       summary: Get driver by ID
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Driver details
 *     delete:
 *       tags:
 *         - Drivers
 *       summary: Delete driver
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Driver deleted successfully
 *   /drivers/active:
 *     get:
 *       tags:
 *         - Drivers
 *       summary: Retrieve all active drivers
 *       responses:
 *         '200':
 *           description: List of active drivers
 */

export default router;
