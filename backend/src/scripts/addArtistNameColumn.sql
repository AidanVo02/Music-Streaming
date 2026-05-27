-- Add artist_name column to users table if it doesn't exist
-- Run this SQL in your MySQL database

-- Check if column exists and add if not
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS artist_name VARCHAR(255) NULL 
COMMENT 'Stage name/nick name for artist' 
AFTER role;

-- Verify the column was added
DESCRIBE users;
