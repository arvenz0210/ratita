import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/schema';

export async function POST() {
  try {
    const result = await initializeDatabase();
    
    return NextResponse.json(
      { message: result.message },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
} 