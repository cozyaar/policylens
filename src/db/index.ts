import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = (process.env.DATABASE_URL || '').trim();
export const isDbConfigured = Boolean(connectionString);

let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

if (isDbConfigured) {
  try {
    client = postgres(connectionString, {
      prepare: false,
      connect_timeout: 5,
      idle_timeout: 10,
      max: 10,
    });
    dbInstance = drizzle(client, { schema });
  } catch (err) {
    console.warn('[DB] Failed to initialize Postgres client:', err);
    client = null;
    dbInstance = null;
  }
}

export const db = dbInstance;
export { client, schema };
