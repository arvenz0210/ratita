import { db } from './database';

export const schema = {
  // Create todos table with proper structure
  createTodosTable: `
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL CHECK(length(description) > 0),
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `,

  // Create indexes for better performance
  createIndexes: [
    `CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed)`,
    `CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_todos_updated_at ON todos(updated_at DESC)`,
  ],

  // Create trigger to automatically update updated_at timestamp
  createUpdateTrigger: `
    CREATE TRIGGER IF NOT EXISTS update_todos_updated_at
    AFTER UPDATE ON todos
    FOR EACH ROW
    BEGIN
      UPDATE todos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `,

  // Sample data
  insertSampleData: [
    {
      sql: "INSERT INTO todos (description, completed) VALUES (?, ?)",
      args: ["Learn Next.js", false]
    },
    {
      sql: "INSERT INTO todos (description, completed) VALUES (?, ?)",
      args: ["Set up Turso database", true]
    },
    {
      sql: "INSERT INTO todos (description, completed) VALUES (?, ?)",
      args: ["Build a todo app", false]
    }
  ]
};

export async function initializeDatabase() {
  try {
    // Create table
    await db.execute(schema.createTodosTable);
    console.log('✅ Todos table created');

    // Create indexes
    for (const indexSql of schema.createIndexes) {
      await db.execute(indexSql);
    }
    console.log('✅ Indexes created');

    // Create trigger
    await db.execute(schema.createUpdateTrigger);
    console.log('✅ Update trigger created');

    // Check if table is empty and insert sample data
    const countResult = await db.execute("SELECT COUNT(*) as count FROM todos");
    const count = countResult.rows[0]?.count as number;

    if (count === 0) {
      // Use batch transaction for inserting sample data
      await db.batch(schema.insertSampleData, "write");
      console.log('✅ Sample data inserted');
    } else {
      console.log(`ℹ️  Table already contains ${count} records, skipping sample data`);
    }

    return { success: true, message: 'Database initialized successfully' };
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
} 