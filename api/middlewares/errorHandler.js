import { ZodError } from 'zod';
import AppError from '../utils/AppError.js';

const isProduction = process.env.NODE_ENV === 'production';

const handlePostgresError = (err) => {
  if (err.code === '23505') {
    return new AppError('Registro duplicado. Já existe um recurso com os dados fornecidos.', 409);
  }
  if (err.code === '23503') {
    return new AppError('Operação inválida. O registro referenciado não foi encontrado.', 400);
  }
  if (err.code === '22P02') {
    return new AppError('Formato de dado inválido para a operação solicitada.', 400);
  }
  return null;
};

export const errorHandler = (err, req, res, next) => {
  let error = err;

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

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'fail',
      message: 'O corpo da requisição contém um JSON com formato inválido.',
    });
  }

  if (err.code && typeof err.code === 'string') {
    const pgMappedError = handlePostgresError(err);
    if (pgMappedError) {
      error = pgMappedError;
    }
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  const logPayload = {
    level: 'error',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    userId: req.user?.id || null,
    message: err.message,
    stack: isProduction ? undefined : err.stack,
    ...(err.code && { dbCode: err.code }),
  };
  console.error(JSON.stringify(logPayload));

  if (!isProduction) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
      stack: err.stack,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Ocorreu um erro interno no servidor.',
  });
};