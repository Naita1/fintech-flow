import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('[FATAL] DATABASE_URL não está configurada.');
  process.exit(1);
}

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: databaseUrl,
  max: parseInt(process.env.DB_POOL_MAX || '20', 10),
  min: parseInt(process.env.DB_POOL_MIN || '2', 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONN_TIMEOUT || '5000', 10),
  ssl: isProduction
    ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false }, 
});

pool.on('error', (err) => {
  console.error('[DATABASE ERROR] Erro inesperado no cliente ocioso do pool:', err);
});

export const query = (text, params) => pool.query(text, params);

export const checkDatabaseHealth = async () => {
  const start = Date.now();
  const res = await pool.query('SELECT 1 AS alive');
  return {
    status: res.rows[0]?.alive === 1 ? 'UP' : 'DOWN',
    latencyMs: Date.now() - start,
  };
};

export const closeDatabasePool = async () => {
  try {
    await pool.end();
    console.info('[DATABASE] Pool de conexões finalizado com sucesso.');
  } catch (err) {
    console.error('[DATABASE] Erro ao fechar o pool de conexões:', err);
  }
};

export default pool;