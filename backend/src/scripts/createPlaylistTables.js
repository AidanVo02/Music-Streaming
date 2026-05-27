const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function createPlaylistTables() {
  try {
    console.log('📦 Creating playlist tables...');

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

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating playlist tables:', error);
    process.exit(1);
  }
}

createPlaylistTables();
