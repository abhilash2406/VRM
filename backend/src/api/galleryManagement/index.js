import express from 'express';
import * as controller from './controller.js';
import { upload } from '../../middlewares/uploader.js';
var router = express.Router();

router.get('/', controller.retrieveImages);

router.post('/', upload.single('image'), controller.uploadImages);
router.delete('/:id', controller.dltImages);
export default router;
