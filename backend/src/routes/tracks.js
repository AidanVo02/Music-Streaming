const express = require('express');
const TrackController = require('../controllers/TrackController.js');
const { authenticate, requireRole } = require('../middleware/auth.js');
const { uploadAudio } = require('../middleware/upload.js');

const router = express.Router();

// Routes
router.post('/upload', authenticate, requireRole('artist', 'admin'), uploadAudio.single('audio'), TrackController.uploadTrack);
router.get('/search', TrackController.searchTracks);
router.get('/genres', TrackController.getAllGenres);
router.get('/top-by-genre', TrackController.getTopByGenre);
router.get('/genre/:genre', TrackController.getTopTracksByGenre);
router.get('/genre/:genre/random', TrackController.getRandomByGenre);
router.get('/artist/:artistId', TrackController.getTracksByArtist);
router.get('/:id/similar', TrackController.getSimilarTracks);
router.get('/:id/waveform', TrackController.getWaveform);
router.get('/:id', TrackController.getTrackById);
router.post('/:id/play', TrackController.playTrack);
router.delete('/:id', authenticate, requireRole('artist', 'admin'), TrackController.deleteTrack);

module.exports = router;
