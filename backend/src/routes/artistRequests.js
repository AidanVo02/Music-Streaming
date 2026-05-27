const express = require('express');
const router = express.Router();
const ArtistRequestController = require('../controllers/ArtistRequestController');
const { authenticate, requireRole } = require('../middleware/auth');

// User routes (authenticated)
router.post('/apply', authenticate, ArtistRequestController.apply);
router.get('/my-request', authenticate, ArtistRequestController.getMyRequest);

// Admin routes
router.get('/pending', authenticate, requireRole('admin'), ArtistRequestController.getPendingRequests);
router.get('/all', authenticate, requireRole('admin'), ArtistRequestController.getAllRequests);
router.put('/:id/approve', authenticate, requireRole('admin'), ArtistRequestController.approveRequest);
router.put('/:id/reject', authenticate, requireRole('admin'), ArtistRequestController.rejectRequest);

module.exports = router;
