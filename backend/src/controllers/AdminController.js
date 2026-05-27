const db = require('../config/db');

class AdminController {

  // ─── USERS ────────────────────────────────────────────────

  static async getAllUsers(req, res) {
    try {
      const { role, search, limit = 100, offset = 0 } = req.query;
      let query = `
        SELECT user_id, username, display_name, email, role, artist_name,
               is_verified, is_banned, membership_tier, created_at, updated_at,
               listening_time_hours, liked_songs_count, published_tracks_count,
               follower_count, total_plays_count
        FROM users WHERE 1=1
      `;
      const params = [];
      if (role) { query += ' AND role = ?'; params.push(role); }
      if (search) {
        query += ' AND (username LIKE ? OR email LIKE ? OR artist_name LIKE ?)';
        const p = `%${search}%`;
        params.push(p, p, p);
      }
      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      const [users] = await db.query(query, params);

      let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
      const countParams = [];
      if (role) { countQuery += ' AND role = ?'; countParams.push(role); }
      if (search) {
        countQuery += ' AND (username LIKE ? OR email LIKE ? OR artist_name LIKE ?)';
        const p = `%${search}%`;
        countParams.push(p, p, p);
      }
      const [[{ total }]] = await db.query(countQuery, countParams);

      return res.json({ success: true, data: users, total, limit: parseInt(limit), offset: parseInt(offset) });
    } catch (error) {
      console.error('getAllUsers error:', error);
      return res.status(500).json({ success: false, message: 'Failed to get users' });
    }
  }

  static async getUserById(req, res) {
    try {
      const { user_id } = req.params;
      const [[user]] = await db.query(
        `SELECT user_id, username, display_name, email, role, artist_name,
                is_verified, is_banned, membership_tier, created_at,
                listening_time_hours, liked_songs_count, published_tracks_count,
                follower_count, total_plays_count, storage_used_gb, storage_limit_gb
         FROM users WHERE user_id = ?`, [user_id]
      );
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, data: user });
    } catch (error) {
      console.error('getUserById error:', error);
      return res.status(500).json({ success: false, message: 'Failed to get user' });
    }
  }

  static async updateUser(req, res) {
    try {
      const { user_id } = req.params;
      const { username, email, role, artist_name, is_verified, is_banned, membership_tier } = req.body;
      const updates = [];
      const params = [];

      if (username)            { updates.push('username = ?');        params.push(username); }
      if (email)               { updates.push('email = ?');           params.push(email); }
      if (role)                { updates.push('role = ?');            params.push(role); }
      if (artist_name !== undefined) { updates.push('artist_name = ?'); params.push(artist_name); }
      if (is_verified !== undefined) { updates.push('is_verified = ?'); params.push(is_verified ? 1 : 0); }
      if (is_banned !== undefined)   { updates.push('is_banned = ?');   params.push(is_banned ? 1 : 0); }
      if (membership_tier)     { updates.push('membership_tier = ?'); params.push(membership_tier); }

      if (updates.length === 0) return res.status(400).json({ success: false, message: 'No fields to update' });

      updates.push('updated_at = NOW()');
      params.push(user_id);
      await db.query(`UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`, params);
      return res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
      console.error('updateUser error:', error);
      return res.status(500).json({ success: false, message: 'Failed to update user' });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { user_id } = req.params;
      if (parseInt(user_id) === req.user.user_id)
        return res.status(400).json({ success: false, message: 'Cannot delete your own account' });

      await db.query('DELETE FROM tracks WHERE uploaded_by = ?', [user_id]);
      await db.query('DELETE FROM artist_requests WHERE user_id = ?', [user_id]);
      await db.query('DELETE FROM users WHERE user_id = ?', [user_id]);
      return res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('deleteUser error:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
  }

  static async banUser(req, res) {
    try {
      const { user_id } = req.params;
      if (parseInt(user_id) === req.user.user_id)
        return res.status(400).json({ success: false, message: 'Cannot ban yourself' });
      await db.query('UPDATE users SET is_banned = 1, updated_at = NOW() WHERE user_id = ?', [user_id]);
      return res.json({ success: true, message: 'User banned' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to ban user' });
    }
  }

  static async unbanUser(req, res) {
    try {
      const { user_id } = req.params;
      await db.query('UPDATE users SET is_banned = 0, updated_at = NOW() WHERE user_id = ?', [user_id]);
      return res.json({ success: true, message: 'User unbanned' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to unban user' });
    }
  }

  static async verifyUser(req, res) {
    try {
      const { user_id } = req.params;
      const { verified } = req.body;
      await db.query('UPDATE users SET is_verified = ?, updated_at = NOW() WHERE user_id = ?', [verified ? 1 : 0, user_id]);
      return res.json({ success: true, message: `User ${verified ? 'verified' : 'unverified'}` });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to update verification' });
    }
  }

  // ─── TRACKS ───────────────────────────────────────────────

  static async getAllTracks(req, res) {
    try {
      const { search, genre, limit = 100, offset = 0 } = req.query;
      let query = `
        SELECT t.track_id, t.title, t.originator, t.genre, t.play_count,
               t.duration, t.cover_image_url, t.file_path, t.lyrics,
               t.uploaded_by, t.created_at,
               u.username as uploader_username,
               a.name as artist_name
        FROM tracks t
        LEFT JOIN users u ON t.uploaded_by = u.user_id
        LEFT JOIN artists a ON t.artist_id = a.artist_id
        WHERE 1=1
      `;
      const params = [];
      if (genre) { query += ' AND t.genre = ?'; params.push(genre); }
      if (search) {
        query += ' AND (t.title LIKE ? OR t.originator LIKE ?)';
        const p = `%${search}%`;
        params.push(p, p);
      }
      query += ' ORDER BY t.track_id DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      const [tracks] = await db.query(query, params);

      const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM tracks');
      return res.json({ success: true, data: tracks, total });
    } catch (error) {
      console.error('getAllTracks error:', error);
      return res.status(500).json({ success: false, message: 'Failed to get tracks' });
    }
  }

  static async getTrackById(req, res) {
    try {
      const { track_id } = req.params;
      const [[track]] = await db.query(
        `SELECT t.*, u.username as uploader_username, a.name as artist_name
         FROM tracks t
         LEFT JOIN users u ON t.uploaded_by = u.user_id
         LEFT JOIN artists a ON t.artist_id = a.artist_id
         WHERE t.track_id = ?`, [track_id]
      );
      if (!track) return res.status(404).json({ success: false, message: 'Track not found' });
      return res.json({ success: true, data: track });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to get track' });
    }
  }

  static async updateTrack(req, res) {
    try {
      const { track_id } = req.params;
      const { title, originator, genre, lyrics, play_count } = req.body;
      const updates = [];
      const params = [];

      if (title)      { updates.push('title = ?');      params.push(title); }
      if (originator) { updates.push('originator = ?'); params.push(originator); }
      if (genre)      { updates.push('genre = ?');      params.push(genre); }
      if (lyrics !== undefined) { updates.push('lyrics = ?'); params.push(lyrics); }
      if (play_count !== undefined) { updates.push('play_count = ?'); params.push(parseInt(play_count)); }

      if (updates.length === 0) return res.status(400).json({ success: false, message: 'No fields to update' });

      params.push(track_id);
      await db.query(`UPDATE tracks SET ${updates.join(', ')} WHERE track_id = ?`, params);
      return res.json({ success: true, message: 'Track updated successfully' });
    } catch (error) {
      console.error('updateTrack error:', error);
      return res.status(500).json({ success: false, message: 'Failed to update track' });
    }
  }

  static async deleteTrack(req, res) {
    try {
      const { track_id } = req.params;
      await db.query('DELETE FROM tracks WHERE track_id = ?', [track_id]);
      return res.json({ success: true, message: 'Track deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to delete track' });
    }
  }

  // ─── STATISTICS ───────────────────────────────────────────

  static async getStatistics(req, res) {
    try {
      const [[stats]] = await db.query(`
        SELECT
          (SELECT COUNT(*) FROM users) as total_users,
          (SELECT COUNT(*) FROM users WHERE role = 'artist') as total_artists,
          (SELECT COUNT(*) FROM users WHERE role = 'user') as total_regular_users,
          (SELECT COUNT(*) FROM tracks) as total_tracks,
          (SELECT COALESCE(SUM(play_count), 0) FROM tracks) as total_plays,
          (SELECT COUNT(*) FROM artist_requests WHERE status = 'pending') as pending_applications,
          (SELECT COUNT(*) FROM artist_requests WHERE status = 'approved') as approved_applications,
          (SELECT COUNT(*) FROM artist_requests WHERE status = 'rejected') as rejected_applications
      `);
      return res.json({ success: true, data: stats });
    } catch (error) {
      console.error('getStatistics error:', error);
      return res.status(500).json({ success: false, message: 'Failed to get statistics' });
    }
  }

  // ─── ACTIVITY ─────────────────────────────────────────────

  static async getRecentActivity(req, res) {
    try {
      const { limit = 20 } = req.query;
      const half = Math.ceil(parseInt(limit) / 2);

      const [recentUsers] = await db.query(
        `SELECT user_id, username, created_at, 'user_registered' as activity_type FROM users ORDER BY created_at DESC LIMIT ?`,
        [half]
      );

      const [trackCols] = await db.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tracks' AND COLUMN_NAME = 'created_at'`
      );

      let recentTracks = [];
      if (trackCols.length > 0) {
        [recentTracks] = await db.query(
          `SELECT t.track_id, t.title, t.created_at, u.username, 'track_uploaded' as activity_type
           FROM tracks t LEFT JOIN users u ON t.uploaded_by = u.user_id
           ORDER BY t.created_at DESC LIMIT ?`, [half]
        );
      }

      const activities = [...recentUsers, ...recentTracks]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, parseInt(limit));

      return res.json({ success: true, data: activities });
    } catch (error) {
      console.error('getRecentActivity error:', error);
      return res.status(500).json({ success: false, message: 'Failed to get activity' });
    }
  }

  // ─── APPLICATIONS ─────────────────────────────────────────

  static async getAllApplications(req, res) {
    try {
      const { status } = req.query;
      let query = `
        SELECT ar.*, u.username, u.email, u.artist_name
        FROM artist_requests ar
        JOIN users u ON ar.user_id = u.user_id
      `;
      const params = [];
      if (status) { query += ' WHERE ar.status = ?'; params.push(status); }
      query += ' ORDER BY ar.created_at DESC';
      const [requests] = await db.query(query, params);
      return res.json({ success: true, data: requests });
    } catch (error) {
      console.error('getAllApplications error:', error);
      return res.status(500).json({ success: false, message: 'Failed to get applications' });
    }
  }

  static async approveApplication(req, res) {
    try {
      const { request_id } = req.params;
      const admin_id = req.user.user_id;

      const [[request]] = await db.query('SELECT * FROM artist_requests WHERE request_id = ?', [request_id]);
      if (!request) return res.status(404).json({ success: false, message: 'Application not found' });
      if (request.status !== 'pending') return res.status(400).json({ success: false, message: `Already ${request.status}` });

      await db.query(
        `UPDATE artist_requests SET status = 'approved', reviewed_by = ?, updated_at = NOW() WHERE request_id = ?`,
        [admin_id, request_id]
      );
      await db.query('UPDATE users SET role = ?, updated_at = NOW() WHERE user_id = ?', ['artist', request.user_id]);

      return res.json({ success: true, message: 'Application approved. User is now an artist.' });
    } catch (error) {
      console.error('approveApplication error:', error);
      return res.status(500).json({ success: false, message: 'Failed to approve application' });
    }
  }

  static async rejectApplication(req, res) {
    try {
      const { request_id } = req.params;
      const admin_id = req.user.user_id;

      const [[request]] = await db.query('SELECT * FROM artist_requests WHERE request_id = ?', [request_id]);
      if (!request) return res.status(404).json({ success: false, message: 'Application not found' });
      if (request.status !== 'pending') return res.status(400).json({ success: false, message: `Already ${request.status}` });

      await db.query(
        `UPDATE artist_requests SET status = 'rejected', reviewed_by = ?, updated_at = NOW() WHERE request_id = ?`,
        [admin_id, request_id]
      );

      return res.json({ success: true, message: 'Application rejected.' });
    } catch (error) {
      console.error('rejectApplication error:', error);
      return res.status(500).json({ success: false, message: 'Failed to reject application' });
    }
  }
}

module.exports = AdminController;
