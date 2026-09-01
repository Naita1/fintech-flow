import pool from '../config/database.js';

export async function getAllTransactions(userId) {
  const query = 'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC, id DESC';
  const { rows } = await pool.query(query, [userId]);

  return rows.map(tx => ({
    ...tx,
    tipo: tx.type === 'income' ? 'entrada' : 'saida',
    type: tx.type === 'income' ? 'entrada' : 'saida',
    descricao: tx.description,
    valor: parseFloat(tx.amount),
    data: tx.date,
  }));
}

export async function createTransaction(userId, transactionData) {
  const { description, amount, type, category, date, frequency, observation } = transactionData;

  if (!description || !amount || !type || !category || !date || !frequency) {
    const error = new Error('Todos os campos obrigatórios devem ser preenchidos: description, amount, type, category, date, frequency.');
    error.statusCode = 400;
    throw error;
  }

  const dbType = type === 'entrada' ? 'income' : 'expense';

  const frequencyMap = {
    'semanal': 'weekly',
    'quinzenal': 'biweekly',
    'mensal': 'monthly',
  };
  const dbFrequency = frequencyMap[frequency] || (['weekly', 'biweekly', 'monthly'].includes(frequency) ? frequency : 'monthly');

  const query = `
    INSERT INTO transactions (description, amount, type, category, frequency, date, user_id, observation)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  const values = [description, amount, dbType, category, dbFrequency, date, userId, observation || null];
  const { rows } = await pool.query(query, values);

  return rows[0];
}

export async function deleteTransaction(userId, transactionId) {
  const result = await pool.query(
    'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
    [transactionId, userId]
  );

  if (result.rowCount === 0) {
    const error = new Error('Movimentação não encontrada ou você não tem permissão para excluí-la.');
    error.statusCode = 404;
    throw error;
  }

  return true;
}