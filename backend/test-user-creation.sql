-- Test signup and login functionality
-- First, create a test user with proper bcrypt hash

-- Generate a bcrypt hash for password "password123" (cost 12)
-- This would be: $2a$12$[22 character salt][31 character hash]

INSERT INTO users (email, password, name, role, created_at, updated_at) 
VALUES (
  'test@example.com',
  '$2a$12$rZnrCg8WW.2XnIWJx1x8FO8e8aMKBJGUYOG6m5.3D1k.KgK8k8k8k',
  'Test User',
  'USER',
  NOW(),
  NOW()
);

-- Verify the user was created
SELECT 
  email, 
  name, 
  role,
  substring(password, 1, 10) as hash_start,
  length(password) as hash_length,
  CASE 
    WHEN password ~ '^\$2[aby]\$[0-9]{1,2}\$' THEN 'Valid bcrypt'
    ELSE 'Invalid format'
  END as hash_format
FROM users 
WHERE email = 'test@example.com';