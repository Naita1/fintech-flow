import * as transactionService from '../services/transactionService.js';

export async function getTransactions(req, res, next) {
  try {
    const transactions = await transactionService.getAllTransactions(req.user.id);
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
}

export async function addTransaction(req, res, next) {
  try {
    const newTransaction = await transactionService.createTransaction(req.user.id, req.body);
    res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
}

export async function removeTransaction(req, res, next) {
  try {
    await transactionService.deleteTransaction(req.user.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}