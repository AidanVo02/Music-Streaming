const db = require('../config/db');
const fs = require('fs');
const path = require('path');

async function dropAndRecreate() {
  try {
    console.log('🗑️  Dropping existing playlist tables...');

    // Drop triggers first
    await db.query('DROP TRIGGER IF EXISTS after_playlist_track_insert').catch(() => {});
    await db.query('DROP TRIGGER IF EXISTS after_playlist_track_delete').catch(() => {});
    console.log('✅ Triggers dropped');

    // Drop tables
    await db.query('DROP TABLE IF EXISTS playlist_tracks');
    await db.query('DROP TABLE IF EXISTS playlists');
    console.log('✅ Tables dropped');

    console.log('\n📦 Creating new playlist tables...');

    const sqlPath = path.join(__dirname, 'createPlaylistTables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split by delimiter and execute each statement
    const statements = sql
      .split('$$')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('DELIMITER'));

    for (const statement of statements) {
      if (statement) {
        await db.query(statement);
      }
    }

    console.log('✅ Playlist tables created successfully!');
    console.log('   - playlists');
    console.log('   - playlist_tracks');
    console.log('   - Triggers for auto-updating stats');

    // Verify
    console.log('\n🔍 Verifying...');
    const [columns] = await db.query('DESCRIBE playlists');
    console.log('\n📋 Playlists columns:');
    columns.forEach(col => {
      console.log(`  ✅ ${col.Field} (${col.Type})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

dropAndRecreate();
