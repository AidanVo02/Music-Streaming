const db = require('../config/db.js');

class ArtistRequest {
  // Create new artist request
  static async create(user_id, note = null) {
    const [result] = await db.query(
      `INSERT INTO artist_requests (user_id, note, status)
       VALUES (?, ?, 'pending')`,
      [user_id, note]
    );
    return result;
  }

  // Get request by user_id
  static async findByUserId(user_id) {
    const [rows] = await db.query(
      `SELECT * FROM artist_requests 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [user_id]
    );
    return rows[0];
  }

  // Get request by ID
  static async findById(request_id) {
    const [rows] = await db.query(
      `SELECT ar.*, 
              u.username, u.email,
              reviewer.username as reviewer_username
       FROM artist_requests ar
       LEFT JOIN users u ON ar.user_id = u.user_id
       LEFT JOIN users reviewer ON ar.reviewed_by = reviewer.user_id
       WHERE ar.request_id = ?`,
      [request_id]
    );
    return rows[0];
  }

  // Get all pending requests (for admin)
  static async getAllPending() {
    const [rows] = await db.query(
      `SELECT ar.*, 
              u.username, u.email, u.profile_pic_url,
              u.follower_count, u.listening_time_hours,
              u.liked_songs_count, u.playlists_count
       FROM artist_requests ar
       JOIN users u ON ar.user_id = u.user_id
       WHERE ar.status = 'pending'
       ORDER BY ar.created_at ASC`
    );
    return rows;
  }

  // Get all requests (for admin)
  static async getAll(limit = 50, offset = 0) {
    const [rows] = await db.query(
      `SELECT ar.*, 
              u.username, u.email,
              reviewer.username as reviewer_username
       FROM artist_requests ar
       LEFT JOIN users u ON ar.user_id = u.user_id
       LEFT JOIN users reviewer ON ar.reviewed_by = reviewer.user_id
       ORDER BY ar.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  // Approve request
  static async approve(request_id, reviewed_by) {
    const [result] = await db.query(
      `UPDATE artist_requests 
       SET status = 'approved', reviewed_by = ?, updated_at = NOW()
       WHERE request_id = ?`,
      [reviewed_by, request_id]
    );
    return result;
  }

  // Reject request
  static async reject(request_id, reviewed_by) {
    const [result] = await db.query(
      `UPDATE artist_requests 
       SET status = 'rejected', reviewed_by = ?, updated_at = NOW()
       WHERE request_id = ?`,
      [reviewed_by, request_id]
    );
    return result;
  }

  // Delete request
  static async delete(request_id) {
    const [result] = await db.query(
      'DELETE FROM artist_requests WHERE request_id = ?',
      [request_id]
    );
    return result;
  }
}

module.exports = ArtistRequest;
