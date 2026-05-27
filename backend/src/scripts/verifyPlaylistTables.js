const db = require('../config/db');

async function verifyTables() {
  try {
    console.log('🔍 Verifying playlist tables...\n');

    // Check if playlists table exists
    const [tables] = await db.query("SHOW TABLES LIKE 'playlists'");
    if (tables.length === 0) {
      console.log('❌ Table "playlists" does not exist!');
      process.exit(1);
    }
    console.log('✅ Table "playlists" exists');

    // Check playlists table structure
    const [playlistColumns] = await db.query('DESCRIBE playlists');
    console.log('\n📋 Playlists table structure:');
    playlistColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
    });

    // Check if playlist_tracks table exists
    const [tables2] = await db.query("SHOW TABLES LIKE 'playlist_tracks'");
    if (tables2.length === 0) {
      console.log('\n❌ Table "playlist_tracks" does not exist!');
      process.exit(1);
    }
    console.log('\n✅ Table "playlist_tracks" exists');

    // Check playlist_tracks table structure
    const [trackColumns] = await db.query('DESCRIBE playlist_tracks');
    console.log('\n📋 Playlist_tracks table structure:');
    trackColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
    });

    // Check triggers
    const [triggers] = await db.query("SHOW TRIGGERS WHERE `Trigger` LIKE '%playlist%'");
    console.log('\n📋 Triggers:');
    if (triggers.length > 0) {
      triggers.forEach(t => {
        console.log(`  ✅ ${t.Trigger} (${t.Event} ${t.Timing})`);
      });
    } else {
      console.log('  ⚠️  No triggers found');
    }

    console.log('\n✅ Verification complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyTables();
