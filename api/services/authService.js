import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import AppError from '../utils/AppError.js';

const DUMMY_HASH = bcrypt.hashSync('dummy_password_for_timing_attack_mitigation', 10);

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new AppError('Erro de configuração: JWT_SECRET não definido.', 500);
}

function generateTokens(userId) {
  const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';

  const accessToken = jwt.sign({}, JWT_SECRET, {
    subject: String(userId),
    jwtid: crypto.randomUUID(),
    expiresIn: accessTokenExpiresIn,
    algorithm: 'HS256',
  });

  const refreshToken = crypto.randomBytes(64).toString('hex');
  const refreshTokenExpiresInMs = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_MS, 10) || 7 * 24 * 60 * 60 * 1000;
  const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenExpiresInMs);

  return { accessToken, refreshToken, refreshTokenExpiresAt };
}

async function saveRefreshToken(userId, token, expiresAt) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, tokenHash, expiresAt]
  );
}

export async function loginUser(email, password) {
  if (!email || !password) {
    throw new AppError('E-mail e senha são obrigatórios.', 400);
  }

  const { rows } = await pool.query(
    'SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND deleted_at IS NULL',
    [email]
  );
  const user = rows[0];

  const passwordToCompare = user ? user.password_hash : DUMMY_HASH;
  const isPasswordValid = await bcrypt.compare(password, passwordToCompare);

  if (!user || !isPasswordValid) {
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
    'SELECT id, user_id, expires_at FROM refresh_tokens WHERE token_hash = $1',
    [tokenHash]
  );
  const savedToken = rows[0];

  if (!savedToken) {
    throw new AppError('Sessão inválida ou revogada. Faça login novamente.', 403);
  }

  if (new Date() > new Date(savedToken.expires_at)) {
    await pool.query('DELETE FROM refresh_tokens WHERE id = $1', [savedToken.id]);
    throw new AppError('Sessão expirada. Faça login novamente.', 403);
  }

  await pool.query('DELETE FROM refresh_tokens WHERE id = $1', [savedToken.id]);

  const { accessToken, refreshToken, refreshTokenExpiresAt } = generateTokens(savedToken.user_id);
  await saveRefreshToken(savedToken.user_id, refreshToken, refreshTokenExpiresAt);

  const csrfToken = crypto.randomBytes(32).toString('hex');

  return {
    accessToken,
    refreshToken,
    csrfToken,
  };
}

export async function logoutUser(tokenFromCookie) {
  if (!tokenFromCookie) return;
  const tokenHash = crypto.createHash('sha256').update(tokenFromCookie).digest('hex');
  await pool.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [tokenHash]);
}