const bcrypt = require('bcryptjs');

async function generateValidHash() {
  try {
    const password = 'password';
    const hash = await bcrypt.hash(password, 12);
    
    console.log('Generated valid bcrypt hash for password "password":');
    console.log(hash);
    
    // Test it
    const isValid = await bcrypt.compare(password, hash);
    console.log(`Validation test: ${isValid ? 'PASS ✅' : 'FAIL ❌'}`);
    
    // Generate SQL to update the test user
    console.log('\nSQL to update test user:');
    console.log(`UPDATE users SET password = '${hash}' WHERE email = 'test@example.com';`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

generateValidHash();