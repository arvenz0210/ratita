import { createClient } from '@libsql/client';

// Create a singleton database client
export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
  // Set concurrency limit for better performance
  concurrency: 10,
});

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