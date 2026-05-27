const Playlist = require('../models/Playlist');

class PlaylistController {
  // ─── CREATE PLAYLIST ───────────────────────────────────────────────────
  static async createPlaylist(req, res) {
    try {
      console.log('📝 Create playlist request:', {
        body: req.body,
        user: req.user ? { user_id: req.user.user_id, username: req.user.username } : 'No user',
        headers: req.headers.authorization ? 'Token present' : 'No token'
      });

      const { name, description, cover_image_url, is_public } = req.body;
      const user_id = req.user.user_id;

      if (!name || name.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Playlist name is required' });
      }

      const playlist_id = await Playlist.create({
        user_id,
        name: name.trim(),
        description: description?.trim(),
        cover_image_url,
        is_public: is_public !== false, // default true
      });

      const playlist = await Playlist.getById(playlist_id);

      console.log('✅ Playlist created:', playlist);

      return res.status(201).json({
        success: true,
        message: 'Playlist created successfully',
        data: playlist,
      });
    } catch (error) {
      console.error('❌ createPlaylist error:', error);
      return res.status(500).json({ success: false, message: 'Failed to create playlist' });
    }
  }

  // ─── GET PLAYLIST BY ID ────────────────────────────────────────────────
  static async getPlaylistById(req, res) {
    try {
      const { playlist_id } = req.params;
      const playlist = await Playlist.getById(playlist_id);

      if (!playlist) {
        return res.status(404).json({ success: false, message: 'Playlist not found' });
      }

      // Check if user can access this playlist
      if (!playlist.is_public && (!req.user || req.user.user_id !== playlist.user_id)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      const tracks = await Playlist.getTracks(playlist_id);

      return res.json({
        success: true,
        data: { ...playlist, tracks },
      });
    } catch (error) {
      console.error('getPlaylistById error:', error);
      return res.status(500).json({ success: false, message: 'Failed to get playlist' });
    }
  }

  // ─── GET USER PLAYLISTS ────────────────────────────────────────────────
  static async getUserPlaylists(req, res) {
    try {
      const { user_id } = req.params;
      const requestingUserId = req.user?.user_id;

      // Only show private playlists if requesting user is the owner
      const includePrivate = requestingUserId && parseInt(user_id) === requestingUserId;

      const playlists = await Playlist.getByUserId(user_id, includePrivate);

      return res.json({
        success: true,
        data: playlists,
        count: playlists.length,
      });
    } catch (error) {
      console.error('getUserPlaylists error:', error);
      return res.status(500).json({ success: false, message: 'Failed to get playlists' });
    }
  }

  // ─── GET MY PLAYLISTS ──────────────────────────────────────────────────
  static async getMyPlaylists(req, res) {
    try {
      const user_id = req.user.user_id;
      const playlists = await Playlist.getByUserId(user_id, true); // include private

      return res.json({
        success: true,
        data: playlists,
        count: playlists.length,
      });
    } catch (error) {
      console.error('getMyPlaylists error:', error);
      return res.status(500).json({ success: false, message: 'Failed to get playlists' });
    }
  }

  // ─── GET PUBLIC PLAYLISTS ──────────────────────────────────────────────
  static async getPublicPlaylists(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const playlists = await Playlist.getPublicPlaylists(parseInt(limit), parseInt(offset));

      return res.json({
        success: true,
        data: playlists,
        count: playlists.length,
      });
    } catch (error) {
      console.error('getPublicPlaylists error:', error);
      return res.status(500).json({ success: false, message: 'Failed to get playlists' });
    }
  }

  // ─── UPDATE PLAYLIST ───────────────────────────────────────────────────
  static async updatePlaylist(req, res) {
    try {
      const { playlist_id } = req.params;
      const { name, description, cover_image_url, is_public } = req.body;
      const user_id = req.user.user_id;

      // Check ownership
      const isOwner = await Playlist.isOwner(playlist_id, user_id);
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      await Playlist.update(playlist_id, { name, description, cover_image_url, is_public });

      const playlist = await Playlist.getById(playlist_id);

      return res.json({
        success: true,
        message: 'Playlist updated successfully',
        data: playlist,
      });
    } catch (error) {
      console.error('updatePlaylist error:', error);
      return res.status(500).json({ success: false, message: 'Failed to update playlist' });
    }
  }

  // ─── DELETE PLAYLIST ───────────────────────────────────────────────────
  static async deletePlaylist(req, res) {
    try {
      const { playlist_id } = req.params;
      const user_id = req.user.user_id;

      // Check ownership
      const isOwner = await Playlist.isOwner(playlist_id, user_id);
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      await Playlist.delete(playlist_id);

      return res.json({
        success: true,
        message: 'Playlist deleted successfully',
      });
    } catch (error) {
      console.error('deletePlaylist error:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete playlist' });
    }
  }

  // ─── ADD TRACK TO PLAYLIST ─────────────────────────────────────────────
  static async addTrack(req, res) {
    try {
      const { playlist_id } = req.params;
      const { track_id } = req.body;
      const user_id = req.user.user_id;

      if (!track_id) {
        return res.status(400).json({ success: false, message: 'track_id is required' });
      }

      // Check ownership
      const isOwner = await Playlist.isOwner(playlist_id, user_id);
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      const added = await Playlist.addTrack(playlist_id, track_id);

      if (!added) {
        return res.status(400).json({ success: false, message: 'Track already in playlist' });
      }

      return res.json({
        success: true,
        message: 'Track added to playlist',
      });
    } catch (error) {
      console.error('addTrack error:', error);
      return res.status(500).json({ success: false, message: 'Failed to add track' });
    }
  }

  // ─── REMOVE TRACK FROM PLAYLIST ────────────────────────────────────────
  static async removeTrack(req, res) {
    try {
      const { playlist_id, track_id } = req.params;
      const user_id = req.user.user_id;

      // Check ownership
      const isOwner = await Playlist.isOwner(playlist_id, user_id);
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      const removed = await Playlist.removeTrack(playlist_id, track_id);

      if (!removed) {
        return res.status(404).json({ success: false, message: 'Track not found in playlist' });
      }

      return res.json({
        success: true,
        message: 'Track removed from playlist',
      });
    } catch (error) {
      console.error('removeTrack error:', error);
      return res.status(500).json({ success: false, message: 'Failed to remove track' });
    }
  }

  // ─── REORDER TRACKS ────────────────────────────────────────────────────
  static async reorderTracks(req, res) {
    try {
      const { playlist_id } = req.params;
      const { track_orders } = req.body; // [{ track_id, position }, ...]
      const user_id = req.user.user_id;

      if (!Array.isArray(track_orders)) {
        return res.status(400).json({ success: false, message: 'track_orders must be an array' });
      }

      // Check ownership
      const isOwner = await Playlist.isOwner(playlist_id, user_id);
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      await Playlist.reorderTracks(playlist_id, track_orders);

      return res.json({
        success: true,
        message: 'Tracks reordered successfully',
      });
    } catch (error) {
      console.error('reorderTracks error:', error);
      return res.status(500).json({ success: false, message: 'Failed to reorder tracks' });
    }
  }

  // ─── SEARCH PLAYLISTS ──────────────────────────────────────────────────
  static async searchPlaylists(req, res) {
    try {
      const { q, limit = 20 } = req.query;

      if (!q || q.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Search query is required' });
      }

      const playlists = await Playlist.search(q.trim(), parseInt(limit));

      return res.json({
        success: true,
        data: playlists,
        count: playlists.length,
      });
    } catch (error) {
      console.error('searchPlaylists error:', error);
      return res.status(500).json({ success: false, message: 'Failed to search playlists' });
    }
  }
}

module.exports = PlaylistController;
