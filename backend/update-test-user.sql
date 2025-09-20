-- Update test user with properly generated bcrypt hash for password "password"
UPDATE users 
SET password = '$2a$12$r.dzphqYY5BQAdizosMxh.HmIvrwrlFt36B2BF11mmc5TRjn6dtf6',
    updated_at = NOW()
WHERE email = 'test@example.com';

-- Verify the update
SELECT 
  email, 
  substring(password, 1, 15) as hash_start, 
  length(password) as hash_length,
  CASE 
    WHEN password ~ '^\$2[aby]\$[0-9]{1,2}\$' THEN 'Valid bcrypt'
    ELSE 'Invalid format'
  END as hash_format
FROM users 
WHERE email = 'test@example.com';