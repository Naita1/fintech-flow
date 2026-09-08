import { ZodError } from 'zod';
import AppError from '../utils/AppError.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((item) => ({
      field: item.path.join('.').replace(/^(body|query|params)\./, ''),
      message: item.message,
    }));

    return res.status(400).json({
      status: 'fail',
      message: 'Erro de validação nos dados enviados.',
      errors: formattedErrors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error('ERROR :', err);
  return res.status(500).json({
    status: 'error',
    message: 'Ocorreu um erro interno no servidor.',
  });
};