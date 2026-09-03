import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import pool from '../config/database.js'; 
import AppError from '../../src/utils/AppError.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return next(new AppError('Você não está logado. Por favor, faça o login para obter acesso.', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const { rows } = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [decoded.id]);
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