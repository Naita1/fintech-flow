import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './_db.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pelas políticas de CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Tentativa de login recebida para:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    return res.json({ id: 1, email, name: 'Usuário' });
  } catch (error) {
    console.error('Erro na rota /api/auth/login:', error);
    return res.status(500).json({ error: 'Erro interno ao processar login.' });
  }
});

app.get('/api/auth/me', (req, res) => {
  return res.json({ id: 1, email: 'teste@email.com', name: 'Usuário' });
});

app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions ORDER BY date DESC, id DESC'
    );

    const formattedRows = result.rows.map(tx => ({
      ...tx,
      tipo: tx.type === 'income' ? 'entrada' : tx.type === 'expense' ? 'saida' : tx.type,
      type: tx.type === 'income' ? 'entrada' : tx.type === 'expense' ? 'saida' : tx.type,
      frequencia: tx.frequency === 'weekly' ? 'semanal' : tx.frequency === 'biweekly' ? 'quinzenal' : tx.frequency,
      descricao: tx.description,
      valor: parseFloat(tx.amount),
      data: tx.date
    }));

    return res.json(formattedRows);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar movimentações' });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { description, amount, type, category, frequency, date, user_id } = req.body;

  if (!description || amount === undefined || !type || !category || !frequency || !date) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }

  const typeMap = {
    entrada: 'income',
    receita: 'income',
    income: 'income',
    saida: 'expense',
    saída: 'expense',
    despesa: 'expense',
    expense: 'expense'
  };

  const frequencyMap = {
    semanal: 'weekly',
    quinzenal: 'biweekly',
    mensal: 'monthly',
    weekly: 'weekly',
    biweekly: 'biweekly',
    monthly: 'monthly'
  };

  const dbType = typeMap[type?.toLowerCase()] || type;
  const dbFrequency = frequencyMap[frequency?.toLowerCase()] || frequency;

  let formattedDate = date;
  if (typeof date === 'string' && date.includes('/')) {
    const [day, month, year] = date.split('/');
    formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  try {
    const query = `
      INSERT INTO transactions (description, amount, type, category, frequency, date, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [description, parseFloat(amount), dbType, category, dbFrequency, formattedDate, user_id || null];

    const result = await pool.query(query, values);
    const newTx = result.rows[0];

    const formattedTx = {
      ...newTx,
      tipo: newTx.type === 'income' ? 'entrada' : 'saida',
      type: newTx.type === 'income' ? 'entrada' : 'saida',
      frequencia: newTx.frequency === 'weekly' ? 'semanal' : newTx.frequency === 'biweekly' ? 'quinzenal' : 'mensal',
      descricao: newTx.description,
      valor: parseFloat(newTx.amount),
      data: newTx.date
    };

    return res.status(201).json(formattedTx);
  } catch (error) {
    console.error('Erro ao salvar transação:', error);
    return res.status(500).json({ error: 'Erro interno ao salvar movimentação' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM transactions WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Transação não encontrada.' });
    }

    console.log(`Transação ID ${id} excluída com sucesso.`);
    return res.status(200).json({ message: 'Transação excluída com sucesso.', deleted: result.rows[0] });
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    return res.status(500).json({ error: 'Erro interno ao excluir movimentação.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});