-- =====================================================
-- UPDATE USER TABLE SCHEMA FOR PROFILE FEATURES
-- =====================================================
-- Run this SQL script to add new columns to users table
-- for supporting User Profile statistics and features

USE oscstation_db;

ALTER TABLE users
  -- Listening Statistics (for USER role)
  ADD COLUMN listening_time_hours DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Total listening time in hours',
  ADD COLUMN liked_songs_count INT NOT NULL DEFAULT 0 COMMENT 'Number of liked songs',
  ADD COLUMN discovery_streak_days INT NOT NULL DEFAULT 0 COMMENT 'Consecutive days of listening',
  
  -- Membership & Premium
  ADD COLUMN membership_tier ENUM('free', 'premium', 'pro') NOT NULL DEFAULT 'free' COMMENT 'Membership level',
  ADD COLUMN premium_expires_at TIMESTAMP NULL COMMENT 'Premium expiration date',
  
  -- Artist Storage (for ARTIST/ADMIN role)
  ADD COLUMN storage_used_gb DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Storage used in GB',
  ADD COLUMN storage_limit_gb DECIMAL(10,2) NOT NULL DEFAULT 5.00 COMMENT 'Storage limit in GB',
  ADD COLUMN published_tracks_count INT NOT NULL DEFAULT 0 COMMENT 'Number of published tracks',
  ADD COLUMN total_plays_count INT NOT NULL DEFAULT 0 COMMENT 'Total plays across all tracks',
  
  -- Social Features
  ADD COLUMN followed_artists_count INT NOT NULL DEFAULT 0 COMMENT 'Number of followed artists',
  ADD COLUMN playlists_count INT NOT NULL DEFAULT 0 COMMENT 'Number of playlists created';

-- Verify the changes
DESCRIBE users;

SELECT 'User table schema updated successfully!' AS status;
