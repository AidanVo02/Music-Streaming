const express = require('express');
const LikeController = require('../controllers/LikeController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/:track_id', LikeController.toggleLike);
router.get('/', LikeController.getLikedTracks);
router.get('/ids', LikeController.getLikedTrackIds);

module.exports = router;
