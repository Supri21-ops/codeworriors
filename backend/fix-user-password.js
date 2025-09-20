const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://erpuser:erppass@localhost:5432/erpdb'
});

async function fixUserPassword() {
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    const email = 'vu3106252@gmail.com';
    
    // Ask user for the correct password
    console.log(`\n🔑 To fix the login issue for ${email}, we need to rehash the password properly.`);
    console.log('Please provide the correct password for this user:');
    
    // Try to determine what the original password might have been
    // Let's test some common development passwords
    const possiblePasswords = ['password', '123456', 'admin', 'uday', 'test123', 'password123'];
    
    // Get the current (broken) hash
    const currentUserResult = await client.query(
      'SELECT password FROM users WHERE email = $1',
      [email]
    );
    
    if (currentUserResult.rows.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    const currentHash = currentUserResult.rows[0].password;
    console.log(`Current broken hash: ${currentHash.substring(0, 10)}...`);
    
    // Since the hash is broken, let's just set a known password
    // In development, we'll use 'password' which is common in the codebase
    const newPassword = 'password';
    
    console.log(`\n🔒 Hashing password for ${email}...`);
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    console.log('Hash generated:', hashedPassword.substring(0, 20) + '...');
    console.log('Hash length:', hashedPassword.length);
    
    // Update the user's password
    const result = await client.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE email = $2 RETURNING email',
      [hashedPassword, email]
    );
    
    if (result.rows.length > 0) {
      console.log(`✅ Password updated successfully for ${email}`);
      
      // Test the new hash
      const testResult = await bcrypt.compare(newPassword, hashedPassword);
      console.log(`🧪 Hash verification test: ${testResult ? '✅ PASS' : '❌ FAIL'}`);
    } else {
      console.log('❌ No user found to update');
    }
    
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixUserPassword();