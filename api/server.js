import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { checkDatabaseHealth, closeDatabasePool } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import AppError from './utils/AppError.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 300, 
  standardHeaders: true,
  legacyHeaders: false,
});

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://fintechflow-demo.vercel.app'
].filter(Boolean);

if (!isProduction) {
  allowedOrigins.push('http://localhost:5173', 'http://127.0.0.1:5173');
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new AppError('Acesso bloqueado pela política de CORS.', 403));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.get('/health', async (req, res) => {
  try {
    const dbStatus = await checkDatabaseHealth();
    const isHealthy = dbStatus.status === 'UP';
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
    });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes); 

app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`A rota ${req.originalUrl} não foi encontrada no servidor.`, 404));
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const shutdown = async (signal) => {
  console.info(`[SHUTDOWN] Sinal ${signal} recebido. Encerrando servidor HTTP graciosamente...`);
  server.close(async () => {
    console.info('[SHUTDOWN] Servidor HTTP encerrado. Fechando pool de conexões...');
    await closeDatabasePool();
    console.info('[SHUTDOWN] Processo finalizado com sucesso.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('[SHUTDOWN] Não foi possível encerrar a tempo. Forçando término.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
  process.exit(1);
});