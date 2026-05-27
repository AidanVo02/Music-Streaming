const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const { signToken } = require('../config/jwt.js');

class AuthController {
  // POST /api/auth/register
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username?.trim() || !email?.trim() || !password) {
        return res.status(400).json({
          success: false,
          message: 'username, email and password are required',
        });
      }

      const existing = await User.findByEmail(email.trim().toLowerCase());
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }

      const password_hash = await bcrypt.hash(password, 12);

      const result = await User.create({
        username: username.trim(),
        display_name: username.trim(),
        email: email.trim().toLowerCase(),
        password_hash,
      });

      const user_id = result.insertId;
      const token = signToken({ user_id, role: 'user' });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          user_id,
          username: username.trim(),
          email: email.trim().toLowerCase(),
          role: 'user',
          token,
        },
      });
    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
    }
  }

  // POST /api/auth/login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email?.trim() || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      const user = await User.findByEmail(email.trim().toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      if (user.is_banned) {
        return res.status(403).json({ success: false, message: 'Account is banned' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = signToken({ user_id: user.user_id, role: user.role });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user_id: user.user_id,
          username: user.username,
          display_name: user.display_name,
          email: user.email,
          role: user.role,
          profile_pic_url: user.profile_pic_url || user.avatar_url,
          subscription_status: user.subscription_status,
          is_verified: user.is_verified,
          token,
        },
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, message: 'Login failed', error: err.message });
    }
  }

  // GET /api/auth/me
  static async getMe(req, res) {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  }

  // PUT /api/auth/profile
  static async updateProfile(req, res) {
    try {
      const user_id = req.user.user_id;
      const { display_name } = req.body;
      
      let profile_pic_url = undefined;
      if (req.file) {
        // Construct the URL to access the uploaded image
        profile_pic_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }

      const updates = {};
      if (display_name) updates.display_name = display_name;
      if (profile_pic_url) updates.profile_pic_url = profile_pic_url;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, message: 'No data provided to update' });
      }

      await User.updateProfile(user_id, updates);

      // Fetch the updated user data to return
      const updatedUser = await User.findById(user_id);

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (err) {
      console.error('Update profile error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update profile', error: err.message });
    }
  }
}

module.exports = AuthController;
