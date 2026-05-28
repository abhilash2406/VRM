import express from 'express';
import * as controller from './controller.js';
import validator from './validator.js';
import { upload } from '../../middlewares/uploader.js';
var router = express.Router();

router
  .route('/')
  .get(controller.getDriverDatas)
  .post(
    upload.fields([
      { name: 'userPhoto', maxCount: 1 },
      { name: 'licensePhoto', maxCount: 1 },
    ]),
    validator.driverValidate,
    controller.addDrivers
  );

router
  .route('/:id')
  .get(controller.viewDriver)
  .delete(controller.deleteDriver)
  .patch(
    upload.fields([
      { name: 'userPhoto', maxCount: 1 },
      { name: 'licensePhoto', maxCount: 1 },
    ]),
    validator.driverValidate,
    controller.updateDriver
  );
router.route('/active').get(controller.fetchActiveDrivers);
router.route('/reject/:id').patch(controller.rejectDriver);
router.route('/approve/:id').patch(controller.approveDrivers);

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
 *                 licensePhoto:
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
