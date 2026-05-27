const db = require('../config/db.js');

class User {
  static async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT user_id, username, display_name, email, role, artist_name,
              profile_pic_url, avatar_url, follower_count,
              subscription_status, is_verified, is_banned,
              listening_time_hours, liked_songs_count, discovery_streak_days,
              membership_tier, premium_expires_at,
              storage_used_gb, storage_limit_gb,
              published_tracks_count, total_plays_count,
              followed_artists_count, playlists_count,
              created_at
       FROM users WHERE user_id = ? LIMIT 1`,
      [id]
    );
    return rows[0];
  }

  static async create({ username, display_name, email, password_hash }) {
    const [result] = await db.query(
      `INSERT INTO users (username, display_name, email, password_hash, role)
       VALUES (?, ?, ?, ?, 'user')`,
      [username, display_name || username, email, password_hash]
    );
    return result;
  }

  static async updateRole(user_id, role) {
    const [result] = await db.query(
      'UPDATE users SET role = ? WHERE user_id = ?',
      [role, user_id]
    );
    return result;
  }

  static async ban(user_id) {
    const [result] = await db.query(
      'UPDATE users SET is_banned = TRUE WHERE user_id = ?',
      [user_id]
    );
    return result;
  }

  static async unban(user_id) {
    const [result] = await db.query(
      'UPDATE users SET is_banned = FALSE WHERE user_id = ?',
      [user_id]
    );
    return result;
  }

  static async updateProfile(user_id, { display_name, profile_pic_url }) {
    // Dynamically build the query based on what is provided
    let query = 'UPDATE users SET ';
    const values = [];
    
    if (display_name !== undefined) {
      query += 'display_name = ?, ';
      values.push(display_name);
    }
    if (profile_pic_url !== undefined) {
      query += 'profile_pic_url = ?, ';
      values.push(profile_pic_url);
    }
    
    // Remove trailing comma and space
    query = query.slice(0, -2);
    
    query += ' WHERE user_id = ?';
    values.push(user_id);
    
    const [result] = await db.query(query, values);
    return result;
  }
}

module.exports = User;
