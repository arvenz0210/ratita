#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envTemplate = `# Turso Database Configuration
# Get these values from your Turso dashboard or CLI
TURSO_DATABASE_URL=libsql://your-database-name-your-org.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here

# Copy this file to .env.local and fill in your actual values
`;

const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Skipping creation.');
} else {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local template');
  console.log('📝 Please edit .env.local with your actual Turso credentials');
}

console.log('\n📋 Next steps:');
console.log('1. Get your Turso database URL: turso db show your-db-name --url');
console.log('2. Get your auth token: turso db tokens create your-db-name');
console.log('3. Update .env.local with the actual values');
console.log('4. Run: npm run dev');
console.log('5. Initialize database: npm run init-db'); 