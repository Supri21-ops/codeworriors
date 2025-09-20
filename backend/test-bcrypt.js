const bcrypt = require('bcryptjs');

async function testPasswordHashing() {
  try {
    console.log('🧪 Testing bcrypt password hashing and validation...\n');
    
    // Test 1: Create a hash
    const password = 'password123';
    const hash = await bcrypt.hash(password, 12);
    
    console.log('✅ Test 1: Hash Creation');
    console.log(`   Original password: ${password}`);
    console.log(`   Generated hash: ${hash}`);
    console.log(`   Hash length: ${hash.length}`);
    console.log(`   Starts with $2a$12$: ${hash.startsWith('$2a$12$')}`);
    
    // Test 2: Validate correct password
    const isValid = await bcrypt.compare(password, hash);
    console.log('\n✅ Test 2: Correct Password Validation');
    console.log(`   Result: ${isValid ? 'PASS ✅' : 'FAIL ❌'}`);
    
    // Test 3: Validate wrong password
    const wrongPassword = 'wrongpassword';
    const isWrongValid = await bcrypt.compare(wrongPassword, hash);
    console.log('\n✅ Test 3: Wrong Password Validation');
    console.log(`   Result: ${isWrongValid ? 'FAIL ❌ (should reject)' : 'PASS ✅ (correctly rejected)'}`);
    
    // Test 4: Test with the standard hash from the database
    const standardHash = '$2a$12$rZnrCg8WW.2XnIWJx1x8FO8e8aMKBJGUYOG6m5.3D1k.KgK8k8k8k';
    const standardPassword = 'password';
    const isStandardValid = await bcrypt.compare(standardPassword, standardHash);
    console.log('\n✅ Test 4: Standard Hash Validation');
    console.log(`   Standard hash: ${standardHash.substring(0, 20)}...`);
    console.log(`   Test password: ${standardPassword}`);
    console.log(`   Result: ${isStandardValid ? 'PASS ✅' : 'FAIL ❌'}`);
    
    console.log('\n🎉 All bcrypt tests completed!');
    
    // If all tests pass, the issue might be elsewhere
    if (isValid && !isWrongValid && isStandardValid) {
      console.log('\n💡 bcrypt is working correctly. Password issues might be:');
      console.log('   1. Database connection problems');
      console.log('   2. Incorrect password being entered');
      console.log('   3. Issues in the authentication service logic');
      console.log('   4. Frontend/backend communication problems');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPasswordHashing();