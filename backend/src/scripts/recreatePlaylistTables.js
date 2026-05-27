const db = require('../config/db');

async function recreate() {
  try {
    console.log('🗑️  Dropping existing tables and triggers...\n');

    // Drop triggers
    try {
      await db.query('DROP TRIGGER IF EXISTS after_playlist_track_insert');
      await db.query('DROP TRIGGER IF EXISTS after_playlist_track_delete');
      console.log('✅ Triggers dropped');
    } catch (err) {
      console.log('⚠️  No triggers to drop');
    }

    // Drop tables
    try {
      await db.query('DROP TABLE IF EXISTS playlist_tracks');
      await db.query('DROP TABLE IF EXISTS playlists');
      console.log('✅ Tables dropped');
    } catch (err) {
      console.log('⚠️  No tables to drop');
    }

    console.log('\n📦 Creating playlists table...');
    await db.query(`
      CREATE TABLE playlists (
        playlist_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        cover_image_url TEXT,
        is_public BOOLEAN DEFAULT TRUE,
        track_count INT DEFAULT 0,
        total_duration INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ playlists table created');

    console.log('\n📦 Creating playlist_tracks table...');
    await db.query(`
      CREATE TABLE playlist_tracks (
        playlist_track_id INT PRIMARY KEY AUTO_INCREMENT,
        playlist_id INT NOT NULL,
        track_id INT NOT NULL,
        position INT NOT NULL DEFAULT 0,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
        FOREIGN KEY (track_id) REFERENCES tracks(track_id) ON DELETE CASCADE,
        UNIQUE KEY unique_playlist_track (playlist_id, track_id),
        INDEX idx_playlist_id (playlist_id),
        INDEX idx_track_id (track_id),
        INDEX idx_position (position)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ playlist_tracks table created');

    console.log('\n📦 Creating triggers...');
    
    // Trigger 1: after insert
    await db.query(`
      CREATE TRIGGER after_playlist_track_insert
      AFTER INSERT ON playlist_tracks
      FOR EACH ROW
      BEGIN
        UPDATE playlists p
        SET 
          track_count = (SELECT COUNT(*) FROM playlist_tracks WHERE playlist_id = NEW.playlist_id),
          total_duration = (
            SELECT COALESCE(SUM(t.duration), 0)
            FROM playlist_tracks pt
            JOIN tracks t ON pt.track_id = t.track_id
            WHERE pt.playlist_id = NEW.playlist_id
          )
        WHERE p.playlist_id = NEW.playlist_id;
      END
    `);
    console.log('✅ after_playlist_track_insert trigger created');

    // Trigger 2: after delete
    await db.query(`
      CREATE TRIGGER after_playlist_track_delete
      AFTER DELETE ON playlist_tracks
      FOR EACH ROW
      BEGIN
        UPDATE playlists p
        SET 
          track_count = (SELECT COUNT(*) FROM playlist_tracks WHERE playlist_id = OLD.playlist_id),
          total_duration = (
            SELECT COALESCE(SUM(t.duration), 0)
            FROM playlist_tracks pt
            JOIN tracks t ON pt.track_id = t.track_id
            WHERE pt.playlist_id = OLD.playlist_id
          )
        WHERE p.playlist_id = OLD.playlist_id;
      END
    `);
    console.log('✅ after_playlist_track_delete trigger created');

    console.log('\n🔍 Verifying tables...');
    const [columns] = await db.query('DESCRIBE playlists');
    console.log('\n📋 Playlists table columns:');
    columns.forEach(col => {
      console.log(`  ✅ ${col.Field} (${col.Type})`);
    });

    console.log('\n✅ All done! Playlist system is ready.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('SQL:', error.sql);
    process.exit(1);
  }
}

recreate();
