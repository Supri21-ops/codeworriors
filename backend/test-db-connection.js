var { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://erpuser:erppass@localhost:5432/erpdb'
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');
    
    const result = await client.query('SELECT version();');
    console.log('📊 Database version:', result.rows[0].version);
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();