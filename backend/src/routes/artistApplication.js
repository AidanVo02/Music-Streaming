const express = require('express');
const router = express.Router();
const ArtistApplicationController = require('../controllers/ArtistApplicationController');
const { authenticate, requireRole } = require('../middleware/auth');

// Apply for artist role (authenticated users only)
router.post('/apply', authenticate, ArtistApplicationController.applyForArtist);

// Get user's application status
router.get('/status', authenticate, ArtistApplicationController.getApplicationStatus);

// Admin routes
router.get(
  '/pending',
  authenticate,
  requireRole('admin'),
  ArtistApplicationController.getPendingApplications
);

router.put(
  '/:request_id/review',
  authenticate,
  requireRole('admin'),
  ArtistApplicationController.reviewApplication
);

module.exports = router;
