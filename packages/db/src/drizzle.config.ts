import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './src/migrations',
  dbCredentials: {
    password: process.env.POSTGRES_PASSWORD!,
    user: process.env.POSTGRES_USERNAME!,
    host: process.env.POSTGRES_HOST!,
    database: process.env.POSTGRES_DB!,
    ssl: false,
  },
});
