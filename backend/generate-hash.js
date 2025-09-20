const bcrypt = require('bcryptjs');

async function generateHash() {
  try {
    const password = 'password';
    const hash = await bcrypt.hash(password, 12);
    console.log('Generated bcrypt hash for password "password":');
    console.log(hash);
    console.log('Hash length:', hash.length);
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash validation test:', isValid ? '✅ PASS' : '❌ FAIL');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

generateHash();