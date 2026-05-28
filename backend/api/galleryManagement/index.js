import express from 'express';
import * as controller from './controller.js';
import { upload } from '../../middlewares/uploader.js';
var router = express.Router();

router.route('/').get(controller.retrieveImages);

router.route('/').post(upload.single('image'), controller.uploadImages);
router.route('/:id').delete(controller.dltImages);
export default router;
