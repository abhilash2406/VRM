import express from 'express';
import * as controller from './controller.js';
import validate from './validator.js';
import { upload } from '../../common/validation/uploader.js';
var router = express.Router();

router.get('/brands', controller.getTruckBrands);
router.get('/models', controller.getTruckModels);
router.get('/variants', controller.getTruckVariants);

router.post(
  '/add',
  upload.fields([
    { name: 'rcPhoto', maxCount: 1 },
    { name: 'truckPhoto', maxCount: 1 },
  ]),
  validate.TruckValidate,
  controller.addTrucks
);
router.post('/get-data', controller.correspondingData);
router.get('/', controller.getAllTruckData);
router.get('/activeTrucks', controller.getActiveTrucks);
router
  .route('/:id')
  .get(controller.truckToEdit)
  .delete(controller.dltTruck)
  .patch(
    upload.fields([
      { name: 'rcPhoto', maxCount: 1 },
      { name: 'truckPhoto', maxCount: 1 },
    ]),
    validate.TruckValidate,
    controller.updateTruck
  );

/**
 * @swagger
 * tags:
 *   name: Trucks
 *   description: APIs for managing trucks
 * paths:
 *   /trucks:
 *     get:
 *       tags:
 *         - Trucks
 *       summary: Retrieve all trucks
 *       responses:
 *         '200':
 *           description: List of all trucks
 *   /trucks/brands:
 *     get:
 *       tags:
 *         - Trucks
 *       summary: Get truck brands
 *       responses:
 *         '200':
 *           description: List of truck brands
 *   /trucks/models:
 *     get:
 *       tags:
 *         - Trucks
 *       summary: Get truck models
 *       responses:
 *         '200':
 *           description: List of truck models
 *   /trucks/add:
 *     post:
 *       tags:
 *         - Trucks
 *       summary: Add a new truck
 *       requestBody:
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 truckNo:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 truckPhoto:
 *                   type: string
 *                   format: binary
 *                 rcPhoto:
 *                   type: string
 *                   format: binary
 *       responses:
 *         '200':
 *           description: Truck added successfully
 */

export default router;
