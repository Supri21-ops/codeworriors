const { Pool } = require('pg');

async function testConnection() {
  console.log('Testing database connection...');
  
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'erpdb',
    user: 'erpuser',
    password: 'erppass',
    ssl: false,
    max: 1,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000
  });

  try {
    console.log('Attempting to connect to PostgreSQL...');
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT current_database(), current_user, version()');
    console.log('Database:', result.rows[0].current_database);
    console.log('User:', result.rows[0].current_user);
    
    // Test a simple query on our tables
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    console.log('Users in database:', userCount.rows[0].count);
    
    client.release();
    await pool.end();
    
    console.log('✅ All tests passed!');
    return true;
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log('Error message:', error.message);
    console.log('Error code:', error.code);
    console.log('Full error:', error);
    
    await pool.end();
    return false;
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});