import { Router } from 'express';
import { 
  getTransactions, 
  addTransaction, 
  updateTransaction, 
  removeTransaction 
} from '../controllers/transactionController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { createTransactionSchema, getTransactionsSchema } from '../schemas/transactionSchemas.js';

const router = Router();

router.use(authMiddleware);

router.route('/')
  .get(validate(getTransactionsSchema), getTransactions)
  .post(validate(createTransactionSchema), addTransaction);

router.route('/:id')
  .put(validate(createTransactionSchema), updateTransaction)
  .delete(removeTransaction);

export default router;