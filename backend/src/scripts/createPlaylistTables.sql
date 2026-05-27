-- ============================================
-- PLAYLIST SYSTEM TABLES
-- ============================================

-- Table: playlists
CREATE TABLE IF NOT EXISTS playlists (
  playlist_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  track_count INT DEFAULT 0,
  total_duration INT DEFAULT 0, -- in seconds
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: playlist_tracks (junction table)
CREATE TABLE IF NOT EXISTS playlist_tracks (
  playlist_track_id INT PRIMARY KEY AUTO_INCREMENT,
  playlist_id INT NOT NULL,
  track_id INT NOT NULL,
  position INT NOT NULL DEFAULT 0, -- order in playlist
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
  FOREIGN KEY (track_id) REFERENCES tracks(track_id) ON DELETE CASCADE,
  UNIQUE KEY unique_playlist_track (playlist_id, track_id),
  INDEX idx_playlist_id (playlist_id),
  INDEX idx_track_id (track_id),
  INDEX idx_position (position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TRIGGERS TO AUTO-UPDATE PLAYLIST STATS
-- ============================================

DELIMITER $$

-- Trigger: Update track_count and total_duration when track is added
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
END$$

-- Trigger: Update track_count and total_duration when track is removed
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
END$$

DELIMITER ;
