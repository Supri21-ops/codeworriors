const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'erpdb',
  user: 'erpuser',
  password: 'erppass'
});

async function simulateSignupAndLogin() {
  try {
    console.log('🧪 Simulating Signup and Login Flow...\n');
    
    // Clean up any existing test user
    await client.connect();
    await client.query('DELETE FROM users WHERE email = $1', ['testsignup@example.com']);
    
    // Simulate Signup Process
    console.log('📝 Step 1: Simulating signup process...');
    const signupData = {
      email: 'testsignup@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'Signup',
      role: 'USER'
    };
    
    // Hash password (same as in auth service)
    const hashedPassword = await bcrypt.hash(signupData.password, 12);
    console.log(`   Original password: ${signupData.password}`);
    console.log(`   Hashed password: ${hashedPassword.substring(0, 20)}...`);
    console.log(`   Hash length: ${hashedPassword.length}`);
    
    // Insert user (same as in auth service)
    const userResult = await client.query(
      'INSERT INTO users (email, password, name, role, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, email, name, role',
      [signupData.email, hashedPassword, `${signupData.firstName} ${signupData.lastName}`, signupData.role]
    );
    
    const newUser = userResult.rows[0];
    console.log('   ✅ User created:', newUser);
    
    // Simulate Login Process
    console.log('\n🔐 Step 2: Simulating login process...');
    const loginData = {
      emailOrUsername: signupData.email,
      password: signupData.password
    };
    
    // Find user (same as in auth service)
    const loginUserResult = await client.query(
      'SELECT id, email, name, role, password, created_at, updated_at FROM users WHERE email = $1',
      [loginData.emailOrUsername]
    );
    
    if (loginUserResult.rows.length === 0) {
      console.log('   ❌ User not found during login');
      return;
    }
    
    const user = loginUserResult.rows[0];
    console.log(`   Found user: ${user.email}`);
    console.log(`   Stored hash: ${user.password.substring(0, 20)}...`);
    
    // Check password (same as in auth service)
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    console.log(`   Password validation result: ${isPasswordValid ? '✅ VALID' : '❌ INVALID'}`);
    
    if (!isPasswordValid) {
      console.log('   ❌ This would result in 401 error!');
      
      // Debug: Let's test a few things
      console.log('\n🔍 Debugging password validation...');
      
      // Test 1: Verify the hash is proper bcrypt format
      const isBcryptFormat = user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$');
      console.log(`   Hash format check: ${isBcryptFormat ? '✅' : '❌'} (${user.password.substring(0, 7)})`);
      
      // Test 2: Try comparing with the hash we just created
      const directComparison = await bcrypt.compare(signupData.password, hashedPassword);
      console.log(`   Direct hash comparison: ${directComparison ? '✅' : '❌'}`);
      
      // Test 3: Check if passwords match character by character
      console.log(`   Input password: "${loginData.password}"`);
      console.log(`   Original password: "${signupData.password}"`);
      console.log(`   Passwords match: ${loginData.password === signupData.password ? '✅' : '❌'}`);
      
    } else {
      console.log('   ✅ Login would succeed!');
    }
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    try {
      await client.end();
    } catch (e) {}
  }
}

simulateSignupAndLogin();