/**
 * Verify user data after schema update
 */

const db = require('../config/db');

async function verifyUserData() {
  try {
    console.log('[CHECK] Verifying user data...\n');

    const [users] = await db.query(`
      SELECT 
        username, 
        role,
        listening_time_hours,
        liked_songs_count,
        discovery_streak_days,
        membership_tier,
        storage_used_gb,
        storage_limit_gb,
        published_tracks_count,
        total_plays_count,
        followed_artists_count,
        playlists_count
      FROM users
      WHERE email IN ('user@signalonyx.com', 'artist@signalonyx.com', 'admin@signalonyx.com')
      ORDER BY role
    `);

    console.log('Found users:', users.length);
    
    if (users.length === 0) {
      console.log('[WARN]  No users found!');
    } else {
      users.forEach(user => {
        console.log(`\n[USER] ${user.username.toUpperCase()} (${user.role})`);
        console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        if (user.role === 'user') {
          console.log(`   [PLAY] Listening Time: ${user.listening_time_hours} hrs`);
          console.log(`   [LIKE]  Liked Songs: ${user.liked_songs_count}`);
          console.log(`   [STREAK] Discovery Streak: ${user.discovery_streak_days} days`);
          console.log(`   [TIER] Membership: ${user.membership_tier.toUpperCase()}`);
          console.log(`   [USERS] Followed Artists: ${user.followed_artists_count}`);
          console.log(`   [FILE] Playlists: ${user.playlists_count}`);
        } else {
          console.log(`   [AUDIO] Published Tracks: ${user.published_tracks_count}`);
          console.log(`   [STATS] Total Plays: ${user.total_plays_count.toLocaleString()}`);
          console.log(`   [STORAGE] Storage: ${user.storage_used_gb} / ${user.storage_limit_gb} GB`);
          console.log(`   [TIER] Membership: ${user.membership_tier.toUpperCase()}`);
          console.log(`   [USERS] Followed Artists: ${user.followed_artists_count}`);
          console.log(`   [FILE] Playlists: ${user.playlists_count}`);
        }
      });
    }

    console.log('\n\n[OK] All user data verified successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Error verifying data:', error.message);
    process.exit(1);
  }
}

verifyUserData();
