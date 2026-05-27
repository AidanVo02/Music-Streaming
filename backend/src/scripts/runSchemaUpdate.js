/**
 * Run schema update directly using Node.js
 */

const db = require('../config/db');

async function runSchemaUpdate() {
  try {
    console.log('🔄 Starting schema update...');

    // Check if columns already exist
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'oscstation_db' 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME IN ('listening_time_hours', 'liked_songs_count', 'discovery_streak_days')
    `);

    if (columns.length > 0) {
      console.log('⚠️  Columns already exist. Skipping ALTER TABLE.');
      console.log('✅ Schema is up to date!');
      process.exit(0);
      return;
    }

    console.log('📝 Adding new columns to users table...');

    await db.query(`
      ALTER TABLE users
        ADD COLUMN listening_time_hours DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        ADD COLUMN liked_songs_count INT NOT NULL DEFAULT 0,
        ADD COLUMN discovery_streak_days INT NOT NULL DEFAULT 0,
        ADD COLUMN membership_tier ENUM('free', 'premium', 'pro') NOT NULL DEFAULT 'free',
        ADD COLUMN premium_expires_at TIMESTAMP NULL,
        ADD COLUMN storage_used_gb DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        ADD COLUMN storage_limit_gb DECIMAL(10,2) NOT NULL DEFAULT 5.00,
        ADD COLUMN published_tracks_count INT NOT NULL DEFAULT 0,
        ADD COLUMN total_plays_count INT NOT NULL DEFAULT 0,
        ADD COLUMN followed_artists_count INT NOT NULL DEFAULT 0,
        ADD COLUMN playlists_count INT NOT NULL DEFAULT 0
    `);

    console.log('✅ Schema updated successfully!');
    console.log('\n📊 Added columns:');
    console.log('   - listening_time_hours (DECIMAL)');
    console.log('   - liked_songs_count (INT)');
    console.log('   - discovery_streak_days (INT)');
    console.log('   - membership_tier (ENUM)');
    console.log('   - premium_expires_at (TIMESTAMP)');
    console.log('   - storage_used_gb (DECIMAL)');
    console.log('   - storage_limit_gb (DECIMAL)');
    console.log('   - published_tracks_count (INT)');
    console.log('   - total_plays_count (INT)');
    console.log('   - followed_artists_count (INT)');
    console.log('   - playlists_count (INT)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating schema:', error.message);
    process.exit(1);
  }
}

runSchemaUpdate();
