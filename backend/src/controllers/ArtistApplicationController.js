const db = require('../config/db');

class ArtistApplicationController {
  // Apply for artist role
  static async applyForArtist(req, res) {
    try {
      console.log('🎨 Artist Application Request:', {
        body: req.body,
        user_id: req.user?.user_id,
        user_role: req.user?.role
      });

      const { artist_name, bio } = req.body;
      const user_id = req.user.user_id;

      // Validation
      if (!artist_name || artist_name.trim().length < 3) {
        console.log('❌ Validation failed: artist_name too short');
        return res.status(400).json({
          success: false,
          message: 'Artist name must be at least 3 characters',
        });
      }

      // Check if user already has artist role
      console.log('🔍 Checking user role...');
      const [user] = await db.query(
        'SELECT role FROM users WHERE user_id = ?',
        [user_id]
      );

      if (!user || user.length === 0) {
        console.log('❌ User not found');
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      console.log('👤 User role:', user[0].role);

      if (user[0].role === 'artist' || user[0].role === 'admin') {
        console.log('❌ User already has artist privileges');
        return res.status(400).json({
          success: false,
          message: 'You already have artist privileges',
        });
      }

      // Check if user already has a pending request
      console.log('🔍 Checking for existing pending request...');
      const [existingRequest] = await db.query(
        'SELECT * FROM artist_requests WHERE user_id = ? AND status = ?',
        [user_id, 'pending']
      );

      if (existingRequest.length > 0) {
        console.log('❌ User already has pending request');
        return res.status(400).json({
          success: false,
          message: 'You already have a pending artist application',
        });
      }

      // Check if artist name is already taken
      console.log('🔍 Checking if artist name is available...');
      const [existingArtist] = await db.query(
        'SELECT user_id FROM users WHERE artist_name = ? AND user_id != ?',
        [artist_name.trim(), user_id]
      );

      if (existingArtist.length > 0) {
        console.log('❌ Artist name already taken');
        return res.status(400).json({
          success: false,
          message: 'This artist name is already taken',
        });
      }

      // Create artist request — status stays 'pending' until admin reviews
      console.log('📝 Creating artist request...');
      const [result] = await db.query(
        `INSERT INTO artist_requests (user_id, status, note, created_at)
         VALUES (?, 'pending', ?, NOW())`,
        [user_id, bio || null]
      );
      console.log('✅ Artist request created:', result.insertId);

      // Save artist_name to user profile (before approval)
      await db.query(
        'UPDATE users SET artist_name = ? WHERE user_id = ?',
        [artist_name.trim(), user_id]
      );

      console.log('⏳ Application pending admin review');
      return res.status(201).json({
        success: true,
        message: 'Application submitted! Please wait for admin review.',
        data: {
          request_id: result.insertId,
          status: 'pending',
        },
      });
    } catch (error) {
      console.error('❌ Apply for artist error:', error);
      console.error('Error stack:', error.stack);
      return res.status(500).json({
        success: false,
        message: 'Failed to submit artist application',
        error: error.message,
      });
    }
  }

  // Get user's artist application status
  static async getApplicationStatus(req, res) {
    try {
      const user_id = req.user.user_id;

      const [requests] = await db.query(
        `SELECT ar.*, u.username, u.artist_name
         FROM artist_requests ar
         JOIN users u ON ar.user_id = u.user_id
         WHERE ar.user_id = ?
         ORDER BY ar.created_at DESC
         LIMIT 1`,
        [user_id]
      );

      if (requests.length === 0) {
        return res.status(200).json({
          success: true,
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        data: requests[0],
      });
    } catch (error) {
      console.error('Get application status error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get application status',
      });
    }
  }

  // Admin: Get all pending applications
  static async getPendingApplications(req, res) {
    try {
      const [requests] = await db.query(
        `SELECT ar.*, u.username, u.email, u.artist_name, u.created_at as user_created_at
         FROM artist_requests ar
         JOIN users u ON ar.user_id = u.user_id
         WHERE ar.status = 'pending'
         ORDER BY ar.created_at DESC`
      );

      return res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error) {
      console.error('Get pending applications error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get pending applications',
      });
    }
  }

  // Admin: Approve/Reject application
  static async reviewApplication(req, res) {
    try {
      const { request_id } = req.params;
      const { status } = req.body; // 'approved' or 'rejected'
      const admin_id = req.user.user_id;

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status',
        });
      }

      // Get the request
      const [requests] = await db.query(
        'SELECT * FROM artist_requests WHERE request_id = ?',
        [request_id]
      );

      if (requests.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Application not found',
        });
      }

      const request = requests[0];

      // Update request status
      await db.query(
        `UPDATE artist_requests 
         SET status = ?, reviewed_by = ?, updated_at = NOW()
         WHERE request_id = ?`,
        [status, admin_id, request_id]
      );

      // If approved, update user role
      if (status === 'approved') {
        await db.query(
          'UPDATE users SET role = ? WHERE user_id = ?',
          ['artist', request.user_id]
        );
      }

      return res.status(200).json({
        success: true,
        message: `Application ${status} successfully`,
      });
    } catch (error) {
      console.error('Review application error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to review application',
      });
    }
  }
}

module.exports = ArtistApplicationController;
