const express = require('express');
const PlaylistController = require('../controllers/PlaylistController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ─── PUBLIC ROUTES ─────────────────────────────────────────────────────────
router.get('/public', PlaylistController.getPublicPlaylists);
router.get('/search', PlaylistController.searchPlaylists);
router.get('/user/:user_id', PlaylistController.getUserPlaylists);

// ─── PROTECTED ROUTES ──────────────────────────────────────────────────────
router.get('/', authenticate, PlaylistController.getMyPlaylists);
router.post('/', authenticate, PlaylistController.createPlaylist);
router.put('/:playlist_id', authenticate, PlaylistController.updatePlaylist);
router.delete('/:playlist_id', authenticate, PlaylistController.deletePlaylist);

// ─── TRACK MANAGEMENT ──────────────────────────────────────────────────────
router.post('/:playlist_id/tracks', authenticate, PlaylistController.addTrack);
router.delete('/:playlist_id/tracks/:track_id', authenticate, PlaylistController.removeTrack);
router.put('/:playlist_id/tracks/reorder', authenticate, PlaylistController.reorderTracks);

// ─── GET PLAYLIST BY ID (must be last to avoid conflicts) ─────────────────
router.get('/:playlist_id', PlaylistController.getPlaylistById);

module.exports = router;
