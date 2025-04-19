import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Check if environment variables exist
if (!process.env.NEON_DATABASE_URL) {
  console.warn('NEON_DATABASE_URL environment variable is not set, please set it in the .env.local file');
}

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL || '',
  },
} satisfies Config;
