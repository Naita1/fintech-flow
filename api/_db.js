import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on('error', (err, client) => {
  console.error('Erro inesperado em cliente ocioso do pool', err);
});

export default pool;