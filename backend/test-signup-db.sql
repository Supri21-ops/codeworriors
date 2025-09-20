-- Test script to simulate signup and login flow directly in PostgreSQL
-- This will help us understand if there's a database-level issue

-- Clean up any existing test user
DELETE FROM users WHERE email = 'testsignup@example.com';

-- Insert a user with a known password hash (simulating signup)
-- Password: 'password123' hashed with bcrypt cost 12
INSERT INTO users (email, password, name, role, created_at, updated_at) 
VALUES (
  'testsignup@example.com',
  -- This is bcrypt hash for 'password123' with cost 12
  '$2a$12$LG8Iz6NxuCPknZkHf/AJae19ffB2P7bGBCTK9Tw5ZRJKXZ4yh8ck.',
  'Test Signup User',
  'USER',
  NOW(),
  NOW()
);

-- Verify the user was created correctly
SELECT 
  'User Created:' as step,
  email, 
  name, 
  role,
  substring(password, 1, 15) as hash_start,
  length(password) as hash_length,
  CASE 
    WHEN password ~ '^\$2[aby]\$[0-9]{1,2}\$' THEN 'Valid bcrypt format'
    ELSE 'Invalid format'
  END as hash_format
FROM users 
WHERE email = 'testsignup@example.com';

-- Now let's see all users to compare with our known good test user
SELECT 
  'All Users:' as step,
  email,
  substring(password, 1, 15) as hash_start,
  length(password) as hash_length
FROM users
ORDER BY email;