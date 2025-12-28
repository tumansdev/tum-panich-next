import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test connection
pool.query('SELECT NOW()')
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err.message));

export default pool;
