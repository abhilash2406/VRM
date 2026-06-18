import express from 'express';
import { getDesignations } from './controller.js';
var router = express.Router();

router.get('/', getDesignations);

export default router;
