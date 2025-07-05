import { createClient } from '@libsql/client';

// Validate environment variables
function validateEnv() {
  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error('TURSO_DATABASE_URL environment variable is required');
  }
  if (!process.env.TURSO_AUTH_TOKEN) {
    throw new Error('TURSO_AUTH_TOKEN environment variable is required');
  }
}

// Create a lazy singleton database client
let dbInstance: ReturnType<typeof createClient> | null = null;

export function getDb() {
  if (!dbInstance) {
    validateEnv();
    dbInstance = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
      // Set concurrency limit for better performance
      concurrency: 10,
    });
  }
  return dbInstance;
}

// Export for backward compatibility
export const db = getDb();

// Database schema types
export interface Todo {
  id: number;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  description: string;
}

export interface UpdateTodoInput {
  id: number;
  description?: string;
  completed?: boolean;
} 