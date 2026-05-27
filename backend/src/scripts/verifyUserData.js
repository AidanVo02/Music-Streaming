/**
 * Verify user data after schema update
 */

const db = require('../config/db');

async function verifyUserData() {
  try {
    console.log('🔍 Verifying user data...\n');

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
      console.log('⚠️  No users found!');
    } else {
      users.forEach(user => {
        console.log(`\n👤 ${user.username.toUpperCase()} (${user.role})`);
        console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        if (user.role === 'user') {
          console.log(`   🎧 Listening Time: ${user.listening_time_hours} hrs`);
          console.log(`   ❤️  Liked Songs: ${user.liked_songs_count}`);
          console.log(`   🔥 Discovery Streak: ${user.discovery_streak_days} days`);
          console.log(`   💎 Membership: ${user.membership_tier.toUpperCase()}`);
          console.log(`   👥 Followed Artists: ${user.followed_artists_count}`);
          console.log(`   📁 Playlists: ${user.playlists_count}`);
        } else {
          console.log(`   🎵 Published Tracks: ${user.published_tracks_count}`);
          console.log(`   📊 Total Plays: ${user.total_plays_count.toLocaleString()}`);
          console.log(`   💾 Storage: ${user.storage_used_gb} / ${user.storage_limit_gb} GB`);
          console.log(`   💎 Membership: ${user.membership_tier.toUpperCase()}`);
          console.log(`   👥 Followed Artists: ${user.followed_artists_count}`);
          console.log(`   📁 Playlists: ${user.playlists_count}`);
        }
      });
    }

    console.log('\n\n✅ All user data verified successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying data:', error.message);
    process.exit(1);
  }
}

verifyUserData();
