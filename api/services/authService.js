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
    'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
    [email]
  );
  const user = rows[0];

  if (!user) {
    console.log('[LOGIN DEBUG] Falha: nenhum usuário encontrado pela consulta de e-mail.');
    await bcrypt.compare(password, DUMMY_HASH);
    throw new AppError('Credenciais inválidas.', 401);
  }

  const hasBcryptHash = typeof user.password_hash === 'string'
    && /^\$2[aby]\$\d{2}\$/.test(user.password_hash);
  console.log('[LOGIN DEBUG] Usuário encontrado; hash bcrypt válida presente:', hasBcryptHash);

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  console.log('[LOGIN DEBUG] Resultado de bcrypt.compare:', isPasswordValid);
  if (!isPasswordValid) {
    console.log('[LOGIN DEBUG] Falha: senha enviada não corresponde à hash armazenada.');
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