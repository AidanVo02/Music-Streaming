/**
 * Update existing seed users with realistic profile data
 * Run this after executing updateUserSchema.sql
 */

const db = require('../config/db');

async function updateSeedUsersData() {
  try {
    console.log('🔄 Updating seed users with profile data...');

    // Update USER_DEMO (regular user)
    await db.query(`
      UPDATE users 
      SET 
        listening_time_hours = 128.40,
        liked_songs_count = 1247,
        discovery_streak_days = 14,
        membership_tier = 'free',
        premium_expires_at = NULL,
        storage_used_gb = 0.00,
        storage_limit_gb = 5.00,
        published_tracks_count = 0,
        total_plays_count = 0,
        followed_artists_count = 24,
        playlists_count = 8
      WHERE email = 'user@signalonyx.com'
    `);
    console.log('✅ Updated USER_DEMO');

    // Update ARTIST_DEMO (artist user)
    await db.query(`
      UPDATE users 
      SET 
        listening_time_hours = 89.20,
        liked_songs_count = 543,
        discovery_streak_days = 7,
        membership_tier = 'premium',
        premium_expires_at = DATE_ADD(NOW(), INTERVAL 6 MONTH),
        storage_used_gb = 312.40,
        storage_limit_gb = 400.00,
        published_tracks_count = 12,
        total_plays_count = 45234,
        followed_artists_count = 15,
        playlists_count = 5
      WHERE email = 'artist@signalonyx.com'
    `);
    console.log('✅ Updated ARTIST_DEMO');

    // Update ADMIN_DEMO (admin user)
    await db.query(`
      UPDATE users 
      SET 
        listening_time_hours = 256.80,
        liked_songs_count = 2891,
        discovery_streak_days = 42,
        membership_tier = 'pro',
        premium_expires_at = DATE_ADD(NOW(), INTERVAL 1 YEAR),
        storage_used_gb = 1024.50,
        storage_limit_gb = 2000.00,
        published_tracks_count = 48,
        total_plays_count = 189456,
        followed_artists_count = 67,
        playlists_count = 23
      WHERE email = 'admin@signalonyx.com'
    `);
    console.log('✅ Updated ADMIN_DEMO');

    console.log('\n✨ All seed users updated successfully!');
    console.log('\n📊 Summary:');
    console.log('   - USER_DEMO: Free tier, 14-day streak, 24 followed artists');
    console.log('   - ARTIST_DEMO: Premium tier, 312GB used, 12 published tracks');
    console.log('   - ADMIN_DEMO: Pro tier, 1TB used, 48 published tracks');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating seed users:', error);
    process.exit(1);
  }
}

updateSeedUsersData();
