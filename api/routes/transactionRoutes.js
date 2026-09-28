import { Router } from 'express';
import { 
  getTransactions, 
  getSummary,
  addTransaction, 
  updateTransaction, 
  removeTransaction 
} from '../controllers/transactionController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { 
  createTransactionSchema, 
  getTransactionsSchema,
  updateTransactionSchema,
  transactionIdParamSchema,
  getSummarySchema
} from '../schemas/transactionSchemas.js';

const router = Router();

router.use(authMiddleware);

router.get('/summary', validate(getSummarySchema || getTransactionsSchema), getSummary);

router.route('/')
  .get(validate(getTransactionsSchema), getTransactions)
  .post(validate(createTransactionSchema), addTransaction);

router.route('/:id')
  .put(validate(updateTransactionSchema || createTransactionSchema), updateTransaction)
  .patch(validate(updateTransactionSchema || createTransactionSchema), updateTransaction)
  .delete(validate(transactionIdParamSchema), removeTransaction);

export default router;