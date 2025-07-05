# Database Setup Guide

This project uses [Turso](https://turso.tech/) as the database provider with libSQL (a SQLite-compatible database).

## Prerequisites

1. **Turso CLI**: Install the Turso CLI
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

2. **Turso Account**: Sign up at [turso.tech](https://turso.tech/)

## Setup Steps

### 1. Create a Turso Database

```bash
# Login to Turso
turso auth login

# Create a new database
turso db create ratita-db

# Get your database URL
turso db show ratita-db --url

# Create an auth token
turso db tokens create ratita-db
```

### 2. Environment Variables

Create a `.env.local` file in your project root:

```env
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

### 3. Initialize Database Schema

Start your development server:
```bash
npm run dev
```

In another terminal, initialize the database:
```bash
npm run init-db
```

Or manually call the API:
```bash
curl -X POST http://localhost:3000/api/init-db
```

## Database Schema

The application uses the following schema:

### Todos Table
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL CHECK(length(description) > 0),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
- `idx_todos_completed` - For filtering by completion status
- `idx_todos_created_at` - For sorting by creation date
- `idx_todos_updated_at` - For sorting by update date

### Triggers
- `update_todos_updated_at` - Automatically updates the `updated_at` timestamp

## API Endpoints

- `GET /api/products` - Fetch all todos
- `POST /api/products` - Create a new todo
- `PUT /api/products` - Update a todo
- `DELETE /api/products?id={id}` - Delete a todo
- `POST /api/init-db` - Initialize database schema

## Best Practices

1. **Connection Management**: Uses a singleton database client with concurrency limits
2. **Error Handling**: Comprehensive error handling with proper HTTP status codes
3. **Data Validation**: Input validation and constraints at the database level
4. **Performance**: Indexes on frequently queried columns
5. **Timestamps**: Automatic timestamp management with triggers

## Development

For local development, you can use Turso's local development feature:

```bash
# Start local development
turso dev

# This will give you a local URL to use in your .env.local
```

## Troubleshooting

### Common Issues

1. **"no such table: todos"**
   - Run `npm run init-db` to create the table

2. **Authentication errors**
   - Verify your `TURSO_AUTH_TOKEN` is correct
   - Check if your token has the necessary permissions

3. **Connection issues**
   - Verify your `TURSO_DATABASE_URL` is correct
   - Check your internet connection

### Useful Commands

```bash
# Check database status
turso db show ratita-db

# View database logs
turso db logs ratita-db

# Reset database (⚠️ destructive)
turso db destroy ratita-db
turso db create ratita-db
```

## References

- [Turso Documentation](https://docs.turso.tech/)
- [libSQL JavaScript SDK](https://docs.turso.tech/sdk/ts/reference)
- [SQLite Documentation](https://www.sqlite.org/docs.html) 