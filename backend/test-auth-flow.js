const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://erpuser:erppass@localhost:5432/erpdb'
});

async function testAuthFlow() {
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Test 1: Create a new user with proper bcrypt hashing
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    
    console.log('\n🔍 Testing signup process...');
    console.log(`📧 Email: ${testEmail}`);
    console.log(`🔒 Password: ${testPassword}`);
    console.log(`🔐 Hash: ${hashedPassword.substring(0, 20)}...`);
    console.log(`📏 Hash length: ${hashedPassword.length}`);
    
    // Insert the user
    const insertResult = await client.query(
      `INSERT INTO users (email, password, name, role, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, NOW(), NOW()) 
       RETURNING id, email, name, role`,
      [testEmail, hashedPassword, 'Test User', 'USER']
    );
    
    const newUser = insertResult.rows[0];
    console.log('✅ User created successfully:', newUser);
    
    // Test 2: Verify the password can be validated
    console.log('\n🧪 Testing password validation...');
    const storedHash = await client.query(
      'SELECT password FROM users WHERE email = $1',
      [testEmail]
    );
    
    const isValid = await bcrypt.compare(testPassword, storedHash.rows[0].password);
    console.log(`🔍 Password validation: ${isValid ? '✅ PASS' : '❌ FAIL'}`);
    
    // Test 3: Test with wrong password
    const wrongPassword = 'wrongpassword';
    const isWrongValid = await bcrypt.compare(wrongPassword, storedHash.rows[0].password);
    console.log(`🔍 Wrong password test: ${isWrongValid ? '❌ FAIL (should be false)' : '✅ PASS (correctly rejected)'}`);
    
    // Test 4: Check hash format
    const hash = storedHash.rows[0].password;
    const isBcryptFormat = hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$');
    console.log(`🔍 Hash format check: ${isBcryptFormat ? '✅ PASS' : '❌ FAIL'}`);
    
    await client.end();
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuthFlow();