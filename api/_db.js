import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error('ERRO: A variável DATABASE_URL não foi encontrada no .env!');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000, 
  idleTimeoutMillis: 30000
});

pool.on('error', (err) => {
  console.error('Erro inesperado em cliente ocioso do pool:', err.message);
});

export default pool;