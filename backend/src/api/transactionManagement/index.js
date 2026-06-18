import express from 'express';
import { TransactionList } from './controller.js';
var router = express.Router();

router.get('/', TransactionList);

export default router;
