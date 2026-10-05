import * as transactionService from '../services/transactionService.js';
import AppError from '../utils/AppError.js';

const parseTransactionId = (idParam) => {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('O identificador da transação deve ser um número inteiro válido e positivo.', 400);
  }
  return id;
};

export async function getTransactions(req, res, next) {
  try {
    const filters = req.validatedQuery ?? req.query;
    const transactions = await transactionService.getAllTransactions(req.user.id, filters);
    
    res.status(200).json({
      status: 'success',
      results: Array.isArray(transactions) ? transactions.length : 0,
      data: { transactions },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    next(error);
  }
}

export async function getSummary(req, res, next) {
  try {
    const filters = req.validatedQuery ?? req.query;
    const summary = await transactionService.getTransactionSummary(req.user.id, filters);
    res.status(200).json({
      status: 'success',
      data: { summary },
    });
  } catch (error) {
    next(error);
  }
}

export async function addTransaction(req, res, next) {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return next(new AppError('Corpo da requisição inválido ou ausente.', 400));
    }

    const newTransaction = await transactionService.createTransaction(req.user.id, req.body);
    res.status(201).json({
      status: 'success',
      data: { transaction: newTransaction },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTransaction(req, res, next) {
  try {
    const transactionId = parseTransactionId(req.params.id);

    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return next(new AppError('Corpo da requisição inválido para atualização.', 400));
    }

    const updatedTransaction = await transactionService.updateTransaction(
      req.user.id,
      transactionId,
      req.body
    );
    res.status(200).json({
      status: 'success',
      data: { transaction: updatedTransaction },
    });
  } catch (error) {
    next(error);
  }
}

export async function removeTransaction(req, res, next) {
  try {
    const transactionId = parseTransactionId(req.params.id);
    await transactionService.deleteTransaction(req.user.id, transactionId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}