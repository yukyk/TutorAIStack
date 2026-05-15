import mysql from 'mysql2/promise';

// Reuse the pool across hot-reloads in development to avoid exhausting connections
declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

const pool: mysql.Pool = globalThis._mysqlPool ?? mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tutor_ai',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

if (process.env.NODE_ENV !== 'production') {
  globalThis._mysqlPool = pool;
}

export default pool;
