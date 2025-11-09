
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../shared/schema";
import * as relations from "./relations";

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:dsa@localhost:5432/graphicgenie";
console.log("Using database URL:", DATABASE_URL);

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait before timing out when connecting a new client
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

// Test the connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL');
    client.release();
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err);
  }
}

testConnection();

export const db = drizzle(pool, { schema: { ...schema, ...relations } });

// Add a health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

export { pool };
export default db;
