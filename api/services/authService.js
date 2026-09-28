import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import AppError from '../utils/AppError.js';

// Hash simulado gerado na inicialização para mitigar timing attacks de forma resiliente
const DUMMY_HASH = bcrypt.hashSync('dummy_password_timing_mitigation', 10);

export async function loginUser(email, password) {
  if (!email || !password) {
    throw new AppError('E-mail e senha são obrigatórios.', 400);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('Erro de configuração no servidor de autenticação.', 500);
  }

  const { rows } = await pool.query(
    'SELECT id, name, email, password_hash FROM users WHERE email = $1 AND deleted_at IS NULL',
    [email]
  );
  const user = rows[0];

  if (!user) {
    await bcrypt.compare(password, DUMMY_HASH);
    throw new AppError('Credenciais inválidas.', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError('Credenciais inválidas.', 401);
  }

  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';

  const token = jwt.sign(
    { 
      id: user.id, 
      name: user.name, 
      email: user.email,
      jti: crypto.randomUUID()
    },
    secret,
    { 
      subject: String(user.id),
      expiresIn: jwtExpiresIn,
      algorithm: 'HS256'
    }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
}