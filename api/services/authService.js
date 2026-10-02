import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import AppError from '../utils/AppError.js';

const DUMMY_HASH = bcrypt.hashSync('dummy_password_timing_mitigation', 10);
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new AppError('Erro de configuração: Chave JWT não definida.', 500);
}

function generateTokens(userId) {
  const accessToken = jwt.sign({ jti: crypto.randomUUID() }, JWT_SECRET, {
    subject: String(userId),
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    algorithm: 'HS256',
  });

  const refreshToken = crypto.randomBytes(64).toString('hex');
  const refreshTokenExpiresInMs = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_MS, 10) || 7 * 24 * 60 * 60 * 1000; // 7 dias
  const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenExpiresInMs);

  return { accessToken, refreshToken, refreshTokenExpiresAt };
}

async function saveRefreshToken(userId, token, expiresAt) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]); 
  await pool.query('INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)', [userId, tokenHash, expiresAt]);
}

export async function loginUser(email, password) {
  if (!email || !password) {
    throw new AppError('E-mail e senha são obrigatórios.', 400);
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

  const { accessToken, refreshToken, refreshTokenExpiresAt } = generateTokens(user.id);
  await saveRefreshToken(user.id, refreshToken, refreshTokenExpiresAt);

  const csrfToken = crypto.randomBytes(32).toString('hex');

  return {
    accessToken,
    refreshToken,
    csrfToken,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function refreshAccessToken(tokenFromCookie) {
  if (!tokenFromCookie) {
    throw new AppError('Refresh token não fornecido.', 401);
  }

  const tokenHash = crypto.createHash('sha256').update(tokenFromCookie).digest('hex');

  const { rows } = await pool.query(
    'SELECT user_id, expires_at FROM refresh_tokens WHERE token_hash = $1',
    [tokenHash]
  );
  const savedToken = rows[0];

  if (!savedToken) {
    throw new AppError('Sessão inválida ou expirada. Faça login novamente.', 403);
  }

  if (new Date() > new Date(savedToken.expires_at)) {
    await pool.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [tokenHash]);
    throw new AppError('Sessão expirada. Faça login novamente.', 403);
  }

  const { accessToken, refreshToken, refreshTokenExpiresAt } = generateTokens(savedToken.user_id);
  await pool.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [tokenHash]);
  await saveRefreshToken(savedToken.user_id, refreshToken, refreshTokenExpiresAt);

  const csrfToken = crypto.randomBytes(32).toString('hex');

  return {
    accessToken,
    refreshToken,
    csrfToken,
  };
}

export async function logoutUser(tokenFromCookie) {
  const tokenHash = crypto.createHash('sha256').update(tokenFromCookie).digest('hex');
  await pool.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [tokenHash]);
}