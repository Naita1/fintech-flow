import { Router } from 'express';
import * as transactionController from '../controllers/transactionController.js';

const router = Router();

router.route('/')
  .get(transactionController.getTransactions)
  .post(transactionController.addTransaction);

router.route('/:id')
  .delete(transactionController.removeTransaction);

export default router;