import type { Config } from 'drizzle-kit';

export default {
  schema: '../shared/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  driver: 'postgres',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'dsa',
    database: 'graphicgenie'
  }
} as unknown as Config;