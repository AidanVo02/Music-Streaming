const db = require('../config/db');

class Like {
  // Check if a user has liked a specific track
  static async isLiked(user_id, track_id) {
    const [rows] = await db.query(
      'SELECT 1 FROM liked_tracks WHERE user_id = ? AND track_id = ?',
      [user_id, track_id]
    );
    return rows.length > 0;
  }

  // Add a like
  static async addLike(user_id, track_id) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      
      // Insert into liked_tracks
      await conn.query(
        'INSERT IGNORE INTO liked_tracks (user_id, track_id) VALUES (?, ?)',
        [user_id, track_id]
      );
      
      // Increment liked_songs_count in users table
      await conn.query(
        'UPDATE users SET liked_songs_count = liked_songs_count + 1 WHERE user_id = ?',
        [user_id]
      );

      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // Remove a like
  static async removeLike(user_id, track_id) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        'DELETE FROM liked_tracks WHERE user_id = ? AND track_id = ?',
        [user_id, track_id]
      );

      if (result.affectedRows > 0) {
        // Decrement liked_songs_count
        await conn.query(
          'UPDATE users SET liked_songs_count = GREATEST(liked_songs_count - 1, 0) WHERE user_id = ?',
          [user_id]
        );
      }

      await conn.commit();
      return result.affectedRows > 0;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // Get all liked tracks for a user
  static async getUserLikedTracks(user_id) {
    // Assuming tracks and users table are similar to what we've seen
    const [rows] = await db.query(`
      SELECT 
        l.created_at as liked_at,
        t.*,
        u.username as artist_name,
        u.profile_pic_url as artist_image_url
      FROM liked_tracks l
      JOIN tracks t ON l.track_id = t.track_id
      LEFT JOIN users u ON t.artist_id = u.user_id
      WHERE l.user_id = ?
      ORDER BY l.created_at DESC
    `, [user_id]);
    return rows;
  }
  
  // Get all liked track IDs for a user (efficient loading)
  static async getUserLikedTrackIds(user_id) {
    const [rows] = await db.query(
      'SELECT track_id FROM liked_tracks WHERE user_id = ?',
      [user_id]
    );
    return rows.map(r => r.track_id);
  }
}

module.exports = Like;
