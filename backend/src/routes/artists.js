const express = require('express');
const ArtistController = require('../controllers/ArtistController.js');

const router = express.Router();

// Routes
router.get('/search', ArtistController.searchArtists);
router.get('/', ArtistController.getAllArtists);
router.get('/:id', ArtistController.getArtistById);
router.post('/', ArtistController.createArtist);
router.put('/:id', ArtistController.updateArtist);
router.delete('/:id', ArtistController.deleteArtist);

module.exports = router;
