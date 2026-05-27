const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { authenticate, requireRole } = require('../middleware/auth');

// All routes require admin role
router.use(authenticate);
router.use(requireRole('admin'));

// Statistics
router.get('/statistics', AdminController.getStatistics);

// Users management
router.get('/users', AdminController.getAllUsers);
router.get('/users/:user_id', AdminController.getUserById);
router.put('/users/:user_id', AdminController.updateUser);
router.delete('/users/:user_id', AdminController.deleteUser);
router.put('/users/:user_id/ban', AdminController.banUser);
router.put('/users/:user_id/unban', AdminController.unbanUser);
router.put('/users/:user_id/verify', AdminController.verifyUser);

// Tracks management
router.get('/tracks', AdminController.getAllTracks);
router.get('/tracks/:track_id', AdminController.getTrackById);
router.put('/tracks/:track_id', AdminController.updateTrack);
router.delete('/tracks/:track_id', AdminController.deleteTrack);

// Activity
router.get('/activity', AdminController.getRecentActivity);

// Applications
router.get('/applications', AdminController.getAllApplications);
router.put('/applications/:request_id/approve', AdminController.approveApplication);
router.put('/applications/:request_id/reject', AdminController.rejectApplication);

module.exports = router;
