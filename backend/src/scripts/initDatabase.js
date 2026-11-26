require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mysql = require('mysql2/promise');

async function initDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'oscstation_db';
  const port = Number(process.env.DB_PORT) || 3306;

  console.log(`[START] Connecting to MySQL Server (${host}:${port}) as ${user}...`);
  const conn = await mysql.createConnection({
    host,
    user,
    password,
    port,
    multipleStatements: true,
  });

  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await conn.query(`USE \`${dbName}\`;`);
    console.log(`[OK] Database '${dbName}' ready.`);

    // 1. users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(100) NOT NULL UNIQUE,
        display_name VARCHAR(150) NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('user', 'artist', 'admin') NOT NULL DEFAULT 'user',
        artist_name VARCHAR(255) NULL,
        profile_pic_url TEXT NULL,
        avatar_url TEXT NULL,
        follower_count INT NOT NULL DEFAULT 0,
        subscription_status VARCHAR(50) NOT NULL DEFAULT 'free',
        is_verified BOOLEAN NOT NULL DEFAULT FALSE,
        is_banned BOOLEAN NOT NULL DEFAULT FALSE,
        listening_time_hours DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        liked_songs_count INT NOT NULL DEFAULT 0,
        discovery_streak_days INT NOT NULL DEFAULT 0,
        membership_tier ENUM('free', 'premium', 'pro') NOT NULL DEFAULT 'free',
        premium_expires_at TIMESTAMP NULL,
        storage_used_gb DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        storage_limit_gb DECIMAL(10,2) NOT NULL DEFAULT 5.00,
        published_tracks_count INT NOT NULL DEFAULT 0,
        total_plays_count INT NOT NULL DEFAULT 0,
        followed_artists_count INT NOT NULL DEFAULT 0,
        playlists_count INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[OK] Table: users');

    // 2. artists table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS artists (
        artist_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        bio TEXT NULL,
        image_url TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[OK] Table: artists');

    // 3. tracks table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS tracks (
        track_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        album_id INT NULL,
        artist_id INT NULL,
        duration INT NOT NULL DEFAULT 180,
        file_path TEXT NOT NULL,
        lyrics TEXT NULL,
        play_count INT NOT NULL DEFAULT 0,
        originator VARCHAR(255) NULL,
        genre VARCHAR(100) NULL,
        cover_image_url TEXT NULL,
        waveform_data JSON NULL,
        uploaded_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE SET NULL,
        FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[OK] Table: tracks');

    // 4. playlists & playlist_tracks
    await conn.query(`
      CREATE TABLE IF NOT EXISTS playlists (
        playlist_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        cover_image_url TEXT NULL,
        is_public BOOLEAN DEFAULT TRUE,
        track_count INT DEFAULT 0,
        total_duration INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS playlist_tracks (
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[OK] Tables: playlists, playlist_tracks');

    // Triggers for playlist stats
    await conn.query(`DROP TRIGGER IF EXISTS after_playlist_track_insert;`);
    await conn.query(`
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
      END;
    `);

    await conn.query(`DROP TRIGGER IF EXISTS after_playlist_track_delete;`);
    await conn.query(`
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
      END;
    `);
    console.log('[OK] Triggers: after_playlist_track_insert, after_playlist_track_delete');

    // 5. liked_tracks table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS liked_tracks (
        user_id INT NOT NULL,
        track_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, track_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (track_id) REFERENCES tracks(track_id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_track_id (track_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[OK] Table: liked_tracks');

    // 6. artist_requests table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS artist_requests (
        request_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        note TEXT NULL,
        reviewed_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[OK] Table: artist_requests');

    console.log('\n[SUCCESS] All MySQL schema tables and triggers initialized successfully!');
  } finally {
    await conn.end();
  }
}

initDatabase().catch(err => {
  console.error('[ERROR] Schema initialization error:', err);
  process.exit(1);
});
