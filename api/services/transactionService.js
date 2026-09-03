import pool from '../config/database.js';
import AppError from '../../src/utils/AppError.js';

const typeMap = {
  entrada: 'income',
  receita: 'income',
  income: 'income',
  saida: 'expense',
  saída: 'expense',
  despesa: 'expense',
  expense: 'expense',
};

const frequencyMap = {
  semanal: 'weekly',
  weekly: 'weekly',
  quinzenal: 'biweekly',
  biweekly: 'biweekly',
  mensal: 'monthly',
  monthly: 'monthly',
};

export async function getAllTransactions(userId, queryParams = {}) {
  const { month, year } = queryParams;
  let query = 'SELECT * FROM transactions WHERE user_id = $1';
  const params = [userId];

  if (month && year) {
    params.push(parseInt(month, 10), parseInt(year, 10));
    query += ` AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3`;
  }

  query += ' ORDER BY date DESC, created_at DESC';

  const { rows } = await pool.query(query, params);
  return rows;
}

export async function createTransaction(userId, transactionData) {
  const { description, amount, category, date, observation } = transactionData;

  const rawType = String(transactionData.type || transactionData.tipo || '').toLowerCase();
  const type = typeMap[rawType] || 'income';

  const rawFrequency = String(transactionData.frequency || transactionData.frequencia || '').toLowerCase();
  const frequency = frequencyMap[rawFrequency] || 'weekly';

  const { rows } = await pool.query(
    `INSERT INTO transactions (user_id, description, amount, type, category, frequency, date, observation) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
     RETURNING *`,
    [userId, description, amount, type, category, frequency, date, observation || null]
  );
  return rows[0];
}

export async function updateTransaction(userId, transactionId, transactionData) {
  const { description, amount, category, date, observation } = transactionData;

  const rawType = String(transactionData.type || transactionData.tipo || '').toLowerCase();
  const type = typeMap[rawType] || 'income';

  const rawFrequency = transactionData.frequency || transactionData.frequencia;
  const frequency = rawFrequency ? frequencyMap[String(rawFrequency).toLowerCase()] : null;

  const { rows, rowCount } = await pool.query(
    `UPDATE transactions 
     SET description = $1, amount = $2, type = $3, category = $4, frequency = COALESCE($5, frequency), date = $6, observation = $7
     WHERE id = $8 AND user_id = $9
     RETURNING *`,
    [
      description,
      amount,
      type,
      category,
      frequency, 
      date,
      observation || null,
      transactionId,
      userId
    ]
  );

  if (rowCount === 0) {
    throw new AppError('Transação não encontrada ou sem permissão para alteração.', 404);
  }

  return rows[0];
}

export async function deleteTransaction(userId, transactionId) {
  const { rowCount } = await pool.query(
    'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
    [transactionId, userId]
  );

  if (rowCount === 0) {
    throw new AppError('Transação não encontrada ou sem permissão para exclusão.', 404);
  }
}