import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import pool from '../config/database.js'; 
import AppError from '../utils/AppError.js';

const JWT_ALGORITHM = 'HS256';

export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError('Você não está logado. Por favor, faça o login para obter acesso.', 401));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new AppError('Chave de autenticação não configurada no servidor.', 500));
    }

    const decoded = await promisify(jwt.verify)(token, secret, { algorithms: [JWT_ALGORITHM] });

    const { rows } = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1 AND deleted_at IS NULL',
      [decoded.id]
    );
    const currentUser = rows[0];

    if (!currentUser) {
      return next(new AppError('O usuário pertencente a este token não existe mais.', 401));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Token inválido ou expirado. Por favor, faça o login novamente.', 401));
    }
    next(error);
  }
};