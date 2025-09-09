// packages/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/schema';

// Ensure all required environment variables are set
const { POSTGRES_USERNAME, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_DB } = process.env;

if (!POSTGRES_USERNAME || !POSTGRES_PASSWORD || !POSTGRES_HOST || !POSTGRES_DB) {
  throw new Error('Missing required database environment variables');
}

// Construct the connection string
const connectionString = `postgresql://${POSTGRES_USERNAME}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}/${POSTGRES_DB}`;

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
export * from './schema/schema'; // Export all schema objects