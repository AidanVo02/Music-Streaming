const Artist = require('../models/Artist.js');

class ArtistController {
  // GET /api/artists - Lấy tất cả artists
  static async getAllArtists(req, res) {
    try {
      const artists = await Artist.getAll();
      res.status(200).json({
        success: true,
        data: artists,
        count: artists.length
      });
    } catch (error) {
      console.error('Error fetching artists:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch artists',
        error: error.message
      });
    }
  }

  // GET /api/artists/:id - Lấy artist theo ID
  static async getArtistById(req, res) {
    try {
      const { id } = req.params;
      const artist = await Artist.getById(id);

      if (!artist) {
        return res.status(404).json({
          success: false,
          message: 'Artist not found'
        });
      }

      res.status(200).json({
        success: true,
        data: artist
      });
    } catch (error) {
      console.error('Error fetching artist:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch artist',
        error: error.message
      });
    }
  }

  // POST /api/artists - Tạo artist mới
  static async createArtist(req, res) {
    try {
      const { name, bio, image_url } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Artist name is required'
        });
      }

      const result = await Artist.create({ name, bio, image_url });
      res.status(201).json({
        success: true,
        message: 'Artist created successfully',
        data: { id: result.insertId, name, bio, image_url }
      });
    } catch (error) {
      console.error('Error creating artist:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create artist',
        error: error.message
      });
    }
  }

  // PUT /api/artists/:id - Cập nhật artist
  static async updateArtist(req, res) {
    try {
      const { id } = req.params;
      const { name, bio, image_url } = req.body;

      const result = await Artist.update(id, { name, bio, image_url });

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Artist not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Artist updated successfully'
      });
    } catch (error) {
      console.error('Error updating artist:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update artist',
        error: error.message
      });
    }
  }

  // DELETE /api/artists/:id - Xóa artist
  static async deleteArtist(req, res) {
    try {
      const { id } = req.params;
      const result = await Artist.delete(id);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Artist not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Artist deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting artist:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete artist',
        error: error.message
      });
    }
  }

  // GET /api/artists/search - Tìm artist theo tên
  static async searchArtists(req, res) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const artists = await Artist.search(q);
      res.status(200).json({
        success: true,
        data: artists,
        count: artists.length
      });
    } catch (error) {
      console.error('Error searching artists:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search artists',
        error: error.message
      });
    }
  }
}

module.exports = ArtistController;
