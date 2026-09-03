import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import AppError from '../../src/utils/AppError.js';

export async function loginUser(email, password) {
  if (!email || !password) {
    throw new AppError('E-mail e senha são obrigatórios.', 400);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('Erro de configuração no servidor de autenticação.', 500);
  }

  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];

  if (!user) {
    throw new AppError('Credenciais inválidas.', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError('Credenciais inválidas.', 401);
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    secret,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
}