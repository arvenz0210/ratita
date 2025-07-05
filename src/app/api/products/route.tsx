import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database';

export async function GET() {
  try {
    const db = getDb();
    // Fetch data from SQLite
    const result = await db.execute("SELECT * FROM todos ORDER BY created_at DESC");
    return NextResponse.json({ todos: result.rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const db = getDb();
    // Insert new todo
    const result = await db.execute({
      sql: "INSERT INTO todos (description, created_at, updated_at) VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
      args: [description]
    });

    return NextResponse.json(
      { message: 'Todo created successfully', id: result.lastInsertRowid },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, description } = body;

    if (!id || !description) {
      return NextResponse.json(
        { error: 'ID and description are required' },
        { status: 400 }
      );
    }

    const db = getDb();
    // Update todo
    await db.execute({
      sql: "UPDATE todos SET description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [description, id]
    });

    return NextResponse.json({ message: 'Todo updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const db = getDb();
    // Delete todo
    await db.execute({
      sql: "DELETE FROM todos WHERE id = ?",
      args: [id]
    });

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
