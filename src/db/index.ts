import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Check if environment variables exist
// Note: This file only runs on the server side, not on the client side
const dbUrl = process.env.NEON_DATABASE_URL;

// Check database URL on server side
if (typeof window === 'undefined') {
  if (!dbUrl) {
    console.warn('NEON_DATABASE_URL environment variable is not set, database functionality will be unavailable');
  } else {
    console.log('Database URL configured and available');
    // For security, don't show any part of the URL in logs
  }
}

// Create database connection
let sql: NeonQueryFunction<any, any> | null = null;
let db: NeonHttpDatabase<typeof schema> | null = null;

// Only initialize database connection on server side
if (typeof window === 'undefined') {
  try {
    if (dbUrl) {
      sql = neon(dbUrl);
      db = drizzle(sql, { schema });
      console.log('Database connection initialized successfully');
    }
  } catch (error: unknown) {
    console.error('Failed to initialize database connection:', 
      error instanceof Error ? error.message : String(error));
  }
}

// Export drizzle instance
export { db };

// Export a function to check if database is available
export function isDatabaseConfigured(): boolean {
  // On client side, check using public environment variable
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_HAS_DATABASE === 'true';
  }
  // On server side, directly check database URL and connection
  return !!dbUrl && !!db;
}
