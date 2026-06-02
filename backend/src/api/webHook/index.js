import express from 'express';
import { success } from './controller.js';
var router = express.Router();

router.post('/', success);
router.get('/', success);
export default router;
