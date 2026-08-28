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

app.use(cors());
app.use(express.json());


app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Tentativa de login recebida:', email);
  return res.json({ id: 1, email, name: 'Usuário' });
});

app.get('/api/auth/me', (req, res) => {
  return res.json({ id: 1, email: 'teste@email.com', name: 'Usuário' });
});

app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions ORDER BY date DESC, id DESC'
    );
    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar movimentações' });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { description, amount, type, category, frequency, date, user_id } = req.body;

  if (!description || !amount || !type || !category || !frequency || !date) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    const query = `
      INSERT INTO transactions (description, amount, type, category, frequency, date, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [description, amount, type, category, frequency, date, user_id || null];

    const result = await pool.query(query, values);
    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao salvar transação:', error);
    return res.status(500).json({ error: 'Erro interno ao salvar movimentação' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});