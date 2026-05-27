const ArtistRequest = require('../models/ArtistRequest');
const User = require('../models/User');

class ArtistRequestController {
  // Apply for artist role
  static async apply(req, res) {
    try {
      const user_id = req.user.user_id;
      const { note } = req.body;

      // Check if user already has artist role
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      if (user.role === 'artist' || user.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: 'You already have artist privileges',
        });
      }

      // Check if user already has a pending request
      const existingRequest = await ArtistRequest.findByUserId(user_id);
      if (existingRequest && existingRequest.status === 'pending') {
        return res.status(400).json({
          success: false,
          message: 'You already have a pending artist application',
          data: existingRequest,
        });
      }

      // Create new request
      const result = await ArtistRequest.create(user_id, note);

      res.status(201).json({
        success: true,
        message: 'Artist application submitted successfully',
        data: {
          request_id: result.insertId,
          user_id,
          status: 'pending',
          note,
        },
      });
    } catch (error) {
      console.error('Apply for artist error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit artist application',
        error: error.message,
      });
    }
  }

  // Get user's own request status
  static async getMyRequest(req, res) {
    try {
      const user_id = req.user.user_id;

      const request = await ArtistRequest.findByUserId(user_id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'No artist application found',
        });
      }

      res.json({
        success: true,
        data: request,
      });
    } catch (error) {
      console.error('Get my request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch artist application',
        error: error.message,
      });
    }
  }

  // Get all pending requests (admin only)
  static async getPendingRequests(req, res) {
    try {
      const requests = await ArtistRequest.getAllPending();

      res.json({
        success: true,
        count: requests.length,
        data: requests,
      });
    } catch (error) {
      console.error('Get pending requests error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch pending requests',
        error: error.message,
      });
    }
  }

  // Get all requests (admin only)
  static async getAllRequests(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const requests = await ArtistRequest.getAll(limit, offset);

      res.json({
        success: true,
        count: requests.length,
        data: requests,
      });
    } catch (error) {
      console.error('Get all requests error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch requests',
        error: error.message,
      });
    }
  }

  // Approve request (admin only)
  static async approveRequest(req, res) {
    try {
      const { id } = req.params;
      const reviewed_by = req.user.user_id;

      // Get request details
      const request = await ArtistRequest.findById(id);
      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Request not found',
        });
      }

      if (request.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: `Request already ${request.status}`,
        });
      }

      // Approve request
      await ArtistRequest.approve(id, reviewed_by);

      // Update user role to artist
      await User.updateRole(request.user_id, 'artist');

      res.json({
        success: true,
        message: 'Artist application approved successfully',
        data: {
          request_id: id,
          user_id: request.user_id,
          status: 'approved',
        },
      });
    } catch (error) {
      console.error('Approve request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to approve request',
        error: error.message,
      });
    }
  }

  // Reject request (admin only)
  static async rejectRequest(req, res) {
    try {
      const { id } = req.params;
      const reviewed_by = req.user.user_id;

      // Get request details
      const request = await ArtistRequest.findById(id);
      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Request not found',
        });
      }

      if (request.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: `Request already ${request.status}`,
        });
      }

      // Reject request
      await ArtistRequest.reject(id, reviewed_by);

      res.json({
        success: true,
        message: 'Artist application rejected',
        data: {
          request_id: id,
          user_id: request.user_id,
          status: 'rejected',
        },
      });
    } catch (error) {
      console.error('Reject request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reject request',
        error: error.message,
      });
    }
  }
}

module.exports = ArtistRequestController;
