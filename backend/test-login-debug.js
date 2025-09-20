const http = require('http');

async function testLogin() {
  const loginData = {
    emailOrUsername: 'vuday8370@gmail.com',
    password: 'udaygamer'
  };

  const postData = JSON.stringify(loginData);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        console.log('\n📊 HTTP Response Status:', res.statusCode);
        console.log('📦 Response Body:', body);
        resolve({ status: res.statusCode, body });
      });
    });

    req.on('error', (e) => {
      console.error('❌ Request error:', e.message);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

console.log('🧪 Testing login with debugging...');
testLogin().catch(console.error);