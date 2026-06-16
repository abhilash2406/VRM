import express from 'express';
import * as controller from './controller.js';
var router = express.Router();

router.get('/', controller.TransactionList);

export default router;
