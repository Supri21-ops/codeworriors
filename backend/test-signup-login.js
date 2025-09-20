const http = require('http');

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function testSignupAndLogin() {
  try {
    console.log('🧪 Testing Signup and Login Flow...\n');
    
    // Test data
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'USER'
    };

    // Step 1: Signup
    console.log('📝 Step 1: Creating user via signup...');
    try {
      const signupResponse = await makeRequest('POST', '/api/auth/signup', testUser);
      console.log(`   Status: ${signupResponse.status}`);
      console.log(`   Response:`, signupResponse.data);
      
      if (signupResponse.status === 201) {
        console.log('   ✅ Signup successful');
      } else {
        console.log('   ❌ Signup failed');
        return;
      }
    } catch (e) {
      console.log('   ❌ Signup request failed:', e.message);
      return;
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 2: Login
    console.log('\n🔐 Step 2: Attempting login...');
    try {
      const loginData = {
        emailOrUsername: testUser.email,
        password: testUser.password
      };
      
      const loginResponse = await makeRequest('POST', '/api/auth/login', loginData);
      console.log(`   Status: ${loginResponse.status}`);
      console.log(`   Response:`, loginResponse.data);
      
      if (loginResponse.status === 200) {
        console.log('   ✅ Login successful');
      } else {
        console.log('   ❌ Login failed with 401 - this is the problem!');
      }
    } catch (e) {
      console.log('   ❌ Login request failed:', e.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSignupAndLogin();