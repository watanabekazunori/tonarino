-- Add user_name and position columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS position TEXT;
