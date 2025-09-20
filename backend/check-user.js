const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
  connectionString: 'postgresql://erpuser:erppass@localhost:5432/erpdb'
});

async function checkUser() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');
    
    // Check the user
    const result = await client.query(
      'SELECT email, password, length(password) as hash_length FROM users WHERE email = $1',
      ['vu3106252@gmail.com']
    );
    
    if (result.rows.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    const user = result.rows[0];
    console.log('👤 User found:');
    console.log('   Email:', user.email);
    console.log('   Password hash length:', user.hash_length);
    console.log('   Hash starts with:', user.password ? user.password.substring(0, 10) + '...' : 'null');
    
    // Test if it's a bcrypt hash
    const isBcryptHash = user.password && user.password.startsWith('$2');
    console.log('   Is bcrypt hash:', isBcryptHash);
    
    // Test password comparison with some common passwords
    const testPasswords = ['password', '123456', 'admin', 'uday', 'vu3106252@gmail.com'];
    
    console.log('\n🔍 Testing password comparisons:');
    for (const testPassword of testPasswords) {
      try {
        const isMatch = await bcrypt.compare(testPassword, user.password);
        console.log(`   "${testPassword}": ${isMatch ? '✅ MATCH' : '❌ no match'}`);
      } catch (error) {
        console.log(`   "${testPassword}": ❌ comparison error - ${error.message}`);
      }
    }
    
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUser();