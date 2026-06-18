import express from 'express';
import {
  getTruckBrands,
  getTruckModels,
  getTruckVariants,
  addTrucks,
  correspondingData,
  getAllTruckData,
  getActiveTrucks,
  truckToEdit,
  dltTruck,
  updateTruck,
} from './controller.js';
import { TruckValidate } from './validator.js';
import { upload } from '../../common/validation/uploader.js';
var router = express.Router();

router.get('/brands', getTruckBrands);
router.get('/models', getTruckModels);
router.get('/variants', getTruckVariants);

router.post(
  '/add',
  upload.fields([
    { name: 'rcPhoto', maxCount: 1 },
    { name: 'truck_photo', maxCount: 1 },
  ]),
  TruckValidate,
  addTrucks
);
router.post('/get-data', correspondingData);
router.get('/', getAllTruckData);
router.get('/activeTrucks', getActiveTrucks);
router
  .route('/:id')
  .get(truckToEdit)
  .delete(dltTruck)
  .patch(
    upload.fields([
      { name: 'rcPhoto', maxCount: 1 },
      { name: 'truck_photo', maxCount: 1 },
    ]),
    TruckValidate,
    updateTruck
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
 *                 truck_photo:
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
