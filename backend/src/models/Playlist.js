const db = require('../config/db');

class Playlist {
  // ─── CREATE ────────────────────────────────────────────────────────────
  static async create({ user_id, name, description, cover_image_url, is_public = true }) {
    const [result] = await db.query(
      `INSERT INTO playlists (user_id, name, description, cover_image_url, is_public)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, name, description, cover_image_url, is_public]
    );
    return result.insertId;
  }

  // ─── GET BY ID ─────────────────────────────────────────────────────────
  static async getById(playlist_id) {
    const [[playlist]] = await db.query(
      `SELECT p.*, u.username, u.display_name, u.avatar_url
       FROM playlists p
       JOIN users u ON p.user_id = u.user_id
       WHERE p.playlist_id = ?`,
      [playlist_id]
    );
    return playlist;
  }

  // ─── GET USER PLAYLISTS ────────────────────────────────────────────────
  static async getByUserId(user_id, includePrivate = false) {
    let query = `
      SELECT p.*, u.username, u.display_name, u.avatar_url
      FROM playlists p
      JOIN users u ON p.user_id = u.user_id
      WHERE p.user_id = ?
    `;
    
    if (!includePrivate) {
      query += ' AND p.is_public = TRUE';
    }
    
    query += ' ORDER BY p.created_at DESC';
    
    const [playlists] = await db.query(query, [user_id]);
    return playlists;
  }

  // ─── GET PUBLIC PLAYLISTS ──────────────────────────────────────────────
  static async getPublicPlaylists(limit = 50, offset = 0) {
    const [playlists] = await db.query(
      `SELECT p.*, u.username, u.display_name, u.avatar_url
       FROM playlists p
       JOIN users u ON p.user_id = u.user_id
       WHERE p.is_public = TRUE
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return playlists;
  }

  // ─── UPDATE ────────────────────────────────────────────────────────────
  static async update(playlist_id, { name, description, cover_image_url, is_public }) {
    const updates = [];
    const params = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (cover_image_url !== undefined) { updates.push('cover_image_url = ?'); params.push(cover_image_url); }
    if (is_public !== undefined) { updates.push('is_public = ?'); params.push(is_public ? 1 : 0); }

    if (updates.length === 0) return false;

    params.push(playlist_id);
    await db.query(
      `UPDATE playlists SET ${updates.join(', ')}, updated_at = NOW() WHERE playlist_id = ?`,
      params
    );
    return true;
  }

  // ─── DELETE ────────────────────────────────────────────────────────────
  static async delete(playlist_id) {
    await db.query('DELETE FROM playlists WHERE playlist_id = ?', [playlist_id]);
    return true;
  }

  // ─── GET TRACKS IN PLAYLIST ────────────────────────────────────────────
  static async getTracks(playlist_id) {
    const [tracks] = await db.query(
      `SELECT 
        t.*,
        a.name as artist_name,
        a.image_url as artist_image_url,
        pt.position,
        pt.added_at,
        t.file_path AS audio_url
       FROM playlist_tracks pt
       JOIN tracks t ON pt.track_id = t.track_id
       LEFT JOIN artists a ON t.artist_id = a.artist_id
       WHERE pt.playlist_id = ?
       ORDER BY pt.position ASC`,
      [playlist_id]
    );
    return tracks;
  }

  // ─── ADD TRACK TO PLAYLIST ─────────────────────────────────────────────
  static async addTrack(playlist_id, track_id) {
    // Get max position
    const [[{ maxPos }]] = await db.query(
      'SELECT COALESCE(MAX(position), -1) as maxPos FROM playlist_tracks WHERE playlist_id = ?',
      [playlist_id]
    );

    const [result] = await db.query(
      `INSERT INTO playlist_tracks (playlist_id, track_id, position)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE position = position`, // Don't update if already exists
      [playlist_id, track_id, maxPos + 1]
    );

    return result.affectedRows > 0;
  }

  // ─── REMOVE TRACK FROM PLAYLIST ────────────────────────────────────────
  static async removeTrack(playlist_id, track_id) {
    const [result] = await db.query(
      'DELETE FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?',
      [playlist_id, track_id]
    );
    
    // Reorder positions
    await db.query(
      `SET @pos = -1;
       UPDATE playlist_tracks 
       SET position = (@pos := @pos + 1)
       WHERE playlist_id = ?
       ORDER BY position ASC`,
      [playlist_id]
    );

    return result.affectedRows > 0;
  }

  // ─── REORDER TRACKS ────────────────────────────────────────────────────
  static async reorderTracks(playlist_id, trackOrders) {
    // trackOrders = [{ track_id, position }, ...]
    for (const { track_id, position } of trackOrders) {
      await db.query(
        'UPDATE playlist_tracks SET position = ? WHERE playlist_id = ? AND track_id = ?',
        [position, playlist_id, track_id]
      );
    }
    return true;
  }

  // ─── CHECK OWNERSHIP ───────────────────────────────────────────────────
  static async isOwner(playlist_id, user_id) {
    const [[playlist]] = await db.query(
      'SELECT user_id FROM playlists WHERE playlist_id = ?',
      [playlist_id]
    );
    return playlist && playlist.user_id === user_id;
  }

  // ─── SEARCH PLAYLISTS ──────────────────────────────────────────────────
  static async search(query, limit = 20) {
    const searchTerm = `%${query}%`;
    const [playlists] = await db.query(
      `SELECT p.*, u.username, u.display_name, u.avatar_url
       FROM playlists p
       JOIN users u ON p.user_id = u.user_id
       WHERE p.is_public = TRUE 
         AND (p.name LIKE ? OR p.description LIKE ?)
       ORDER BY p.track_count DESC, p.created_at DESC
       LIMIT ?`,
      [searchTerm, searchTerm, limit]
    );
    return playlists;
  }
}

module.exports = Playlist;
