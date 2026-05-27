const Like = require('../models/Like');

class LikeController {
  static async toggleLike(req, res) {
    try {
      const { track_id } = req.params;
      const user_id = req.user.user_id;

      if (!track_id) {
        return res.status(400).json({ success: false, message: 'track_id is required' });
      }

      const isLiked = await Like.isLiked(user_id, track_id);
      
      if (isLiked) {
        await Like.removeLike(user_id, track_id);
        return res.json({ success: true, message: 'Unliked track', liked: false });
      } else {
        await Like.addLike(user_id, track_id);
        return res.json({ success: true, message: 'Liked track', liked: true });
      }
    } catch (error) {
      console.error('toggleLike error:', error);
      return res.status(500).json({ success: false, message: 'Failed to toggle like' });
    }
  }

  static async getLikedTracks(req, res) {
    try {
      const user_id = req.user.user_id;
      const likedTracks = await Like.getUserLikedTracks(user_id);
      
      return res.json({
        success: true,
        data: likedTracks,
        count: likedTracks.length
      });
    } catch (error) {
      console.error('getLikedTracks error:', error);
      return res.status(500).json({ success: false, message: 'Failed to get liked tracks' });
    }
  }

  static async getLikedTrackIds(req, res) {
    try {
      const user_id = req.user.user_id;
      const likedIds = await Like.getUserLikedTrackIds(user_id);
      
      return res.json({
        success: true,
        data: likedIds,
      });
    } catch (error) {
      console.error('getLikedTrackIds error:', error);
      return res.status(500).json({ success: false, message: 'Failed to get liked track IDs' });
    }
  }
}

module.exports = LikeController;
