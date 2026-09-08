import pool from '../config/database.js';
import AppError from '../utils/AppError.js';

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

export async function getAllTransactions(userId, filters = {}) {
  const { startDate, endDate, month, year, category, page = 1, limit = 20 } = filters;
  const offset = (page - 1) * limit;

  let query = `
    SELECT id, description, amount, type, category, frequency, date, observation, created_at 
    FROM transactions 
    WHERE user_id = $1 AND deleted_at IS NULL
  `;
  const params = [userId];

  if (startDate && endDate) {
    params.push(startDate, endDate);
    query += ` AND date BETWEEN $${params.length - 1} AND $${params.length}`;
  } else if (month && year) {
    params.push(parseInt(month, 10), parseInt(year, 10));
    query += ` AND EXTRACT(MONTH FROM date) = $${params.length - 1} AND EXTRACT(YEAR FROM date) = $${params.length}`;
  }

  if (category) {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }

  params.push(limit, offset);
  query += ` ORDER BY date DESC, created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const { rows } = await pool.query(query, params);
  return rows;
}

export async function getTransactionSummary(userId, filters = {}) {
  const { startDate, endDate, month, year } = filters;

  let query = `
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0)::FLOAT AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0)::FLOAT AS total_expense,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0)::FLOAT AS balance
    FROM transactions
    WHERE user_id = $1 AND deleted_at IS NULL
  `;
  const params = [userId];

  if (startDate && endDate) {
    params.push(startDate, endDate);
    query += ` AND date BETWEEN $2 AND $3`;
  } else if (month && year) {
    params.push(parseInt(month, 10), parseInt(year, 10));
    query += ` AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3`;
  }

  const { rows } = await pool.query(query, params);
  return rows[0];
}

export async function createTransaction(userId, data) {
  const description = data.description || data.descricao;
  const amount = data.amount || data.valor;
  const category = data.category;
  const date = data.date;
  const observation = data.observation || null;

  const rawType = String(data.type || data.tipo || '').toLowerCase();
  const type = typeMap[rawType] || 'income';

  const rawFrequency = String(data.frequency || data.frequencia || '').toLowerCase();
  const frequency = frequencyMap[rawFrequency] || 'monthly';

  const query = `
    INSERT INTO transactions (user_id, description, amount, type, category, frequency, date, observation)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, description, amount, type, category, frequency, date, observation, created_at
  `;

  const { rows } = await pool.query(query, [
    userId, description, amount, type, category, frequency, date, observation
  ]);

  return rows[0];
}

export async function updateTransaction(userId, transactionId, data) {
  const description = data.description || data.descricao;
  const amount = data.amount || data.valor;
  const category = data.category;
  const date = data.date;
  const observation = data.observation || null;

  const rawType = String(data.type || data.tipo || '').toLowerCase();
  const type = typeMap[rawType] || 'income';

  const rawFrequency = data.frequency || data.frequencia;
  const frequency = rawFrequency ? frequencyMap[String(rawFrequency).toLowerCase()] : null;

  const query = `
    UPDATE transactions 
    SET description = $1, amount = $2, type = $3, category = $4, 
        frequency = COALESCE($5, frequency), date = $6, observation = $7, updated_at = CURRENT_TIMESTAMP
    WHERE id = $8 AND user_id = $9 AND deleted_at IS NULL
    RETURNING id, description, amount, type, category, frequency, date, observation, updated_at
  `;

  const { rows, rowCount } = await pool.query(query, [
    description, amount, type, category, frequency, date, observation, transactionId, userId
  ]);

  if (rowCount === 0) {
    throw new AppError('Transação não encontrada ou sem permissão para alteração.', 404);
  }

  return rows[0];
}

export async function deleteTransaction(userId, transactionId) {
  const query = `
    UPDATE transactions 
    SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
  `;

  const result = await pool.query(query, [transactionId, userId]);

  if (result.rowCount === 0) {
    throw new AppError('Transação não encontrada ou já foi excluída.', 404);
  }
}