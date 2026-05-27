const fs = require('fs');
const path = require('path');

const Track = require('../models/Track.js');
const { generateWaveformFromFile, generateFallbackWaveform } = require('../utils/waveformGenerator.js');

const DEFAULT_DURATION = 180;
const DEFAULT_GENRE = 'Electronic';

const deleteTempFile = (filePath) => {
  if (!filePath) return;

  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.warn(`Failed to delete temp file ${filePath}:`, error.message);
  }
};

const sanitizeFileName = (value) =>
  value
    .normalize('NFKD')
    .replace(/[^\w.\-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

const buildStoredFileName = (originalName) => {
  const safeOriginalName = sanitizeFileName(originalName || 'track');
  return `${Date.now()}_${safeOriginalName}`;
};

const buildLocalFileUrl = (req, fileName) =>
  `${req.protocol}://${req.get('host')}/uploads/${encodeURIComponent(fileName)}`;

const tryDeleteLocalAudio = (audioUrl) => {
  if (!audioUrl) return;

  try {
    const parsedUrl = new URL(audioUrl);
    const normalizedPath = decodeURIComponent(parsedUrl.pathname);

    if (!normalizedPath.startsWith('/uploads/')) {
      return;
    }

    const fileName = path.basename(normalizedPath);
    const absolutePath = path.join(__dirname, '../../uploads', fileName);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (error) {
    console.warn('Failed to delete local audio file:', error.message);
  }
};

class TrackController {
  static async uploadTrack(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No audio file provided',
        });
      }

      const { title, originator, genre, duration, cover_image_url } = req.body;
      const normalizedTitle = title?.trim();
      const normalizedOriginator = originator?.trim();
      const normalizedGenre = genre?.trim() || DEFAULT_GENRE;
      const normalizedDuration = Number.parseInt(duration, 10);
      const safeDuration =
        Number.isFinite(normalizedDuration) && normalizedDuration > 0
          ? normalizedDuration
          : DEFAULT_DURATION;

      if (!normalizedTitle || !normalizedOriginator) {
        deleteTempFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'Title and originator are required',
        });
      }

      const storedFileName = buildStoredFileName(req.file.originalname);
      const finalPath = path.join(path.dirname(req.file.path), storedFileName);
      fs.renameSync(req.file.path, finalPath);
      const audioUrl = buildLocalFileUrl(req, storedFileName);

      // Generate waveform peaks from the uploaded file
      console.log('🎵 Generating waveform...');
      const waveformPeaks = await generateWaveformFromFile(finalPath);
      console.log(`✅ Waveform generated: ${waveformPeaks.length} peaks`);

      const trackResult = await Track.create({
        title: normalizedTitle,
        originator: normalizedOriginator,
        genre: normalizedGenre,
        duration: safeDuration,
        audio_url: audioUrl,
        cover_image_url: cover_image_url || null,
        waveform_data: JSON.stringify(waveformPeaks),
      });

      return res.status(201).json({
        success: true,
        message: 'Track uploaded successfully',
        data: {
          track_id: trackResult.insertId,
          title: normalizedTitle,
          originator: normalizedOriginator,
          audio_url: audioUrl,
          duration: safeDuration,
          cover_image_url: cover_image_url || null,
        },
      });
    } catch (error) {
      console.error('Error uploading track:', error);

      deleteTempFile(req.file?.path);

      return res.status(500).json({
        success: false,
        message: 'Failed to upload track',
        error: error.message,
      });
    }
  }

  static async getAllTracks(req, res) {
    try {
      const limit = parseInt(req.query.limit, 10) || 50;
      const offset = parseInt(req.query.offset, 10) || 0;

      const tracks = await Track.getAll(limit, offset);
      return res.status(200).json({
        success: true,
        data: tracks,
        count: tracks.length,
      });
    } catch (error) {
      console.error('Error fetching tracks:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch tracks',
        error: error.message,
      });
    }
  }

  static async getTrackById(req, res) {
    try {
      const { id } = req.params;
      const track = await Track.getById(id);

      if (!track) {
        return res.status(404).json({
          success: false,
          message: 'Track not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: track,
      });
    } catch (error) {
      console.error('Error fetching track:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch track',
        error: error.message,
      });
    }
  }

  static async deleteTrack(req, res) {
    try {
      const { id } = req.params;
      const existingTrack = await Track.getById(id);

      if (!existingTrack) {
        return res.status(404).json({
          success: false,
          message: 'Track not found',
        });
      }

      const result = await Track.delete(id);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Track not found',
        });
      }

      tryDeleteLocalAudio(existingTrack.audio_url);

      return res.status(200).json({
        success: true,
        message: 'Track deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting track:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete track',
        error: error.message,
      });
    }
  }

  static async playTrack(req, res) {
    try {
      const { id } = req.params;
      await Track.incrementPlayCount(id);

      return res.status(200).json({
        success: true,
        message: 'Play count incremented',
      });
    } catch (error) {
      console.error('Error playing track:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to increment play count',
        error: error.message,
      });
    }
  }

  static async getTracksByArtist(req, res) {
    try {
      const { artistId } = req.params;
      const tracks = await Track.getByArtist(artistId);
      return res.status(200).json({
        success: true,
        data: tracks,
        count: tracks.length,
      });
    } catch (error) {
      console.error('Error fetching tracks by artist:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch tracks',
        error: error.message,
      });
    }
  }

  static async searchTracks(req, res) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
      }

      const tracks = await Track.search(q);
      return res.status(200).json({
        success: true,
        data: tracks,
        count: tracks.length,
      });
    } catch (error) {
      console.error('Error searching tracks:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to search tracks',
        error: error.message,
      });
    }
  }

  static async getTopByGenre(req, res) {
    try {
      const limit = parseInt(req.query.limit, 10) || 5;
      const tracks = await Track.getTopByGenre(limit);
      return res.status(200).json({
        success: true,
        data: tracks,
        count: tracks.length,
      });
    } catch (error) {
      console.error('Error fetching top tracks by genre:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch top tracks',
        error: error.message,
      });
    }
  }

  static async getTopTracksByGenre(req, res) {
    try {
      const { genre } = req.params;
      const limit = parseInt(req.query.limit, 10) || 10;
      const tracks = await Track.getTopTracksByGenre(genre, limit);
      return res.status(200).json({
        success: true,
        data: tracks,
        count: tracks.length,
      });
    } catch (error) {
      console.error('Error fetching tracks by genre:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch tracks',
        error: error.message,
      });
    }
  }

  static async getAllGenres(req, res) {
    try {
      const genres = await Track.getAllGenres();
      return res.status(200).json({
        success: true,
        data: genres,
        count: genres.length,
      });
    } catch (error) {
      console.error('Error fetching genres:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch genres',
        error: error.message,
      });
    }
  }

  // Get similar tracks by genre
  static async getSimilarTracks(req, res) {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit, 10) || 20;

      const tracks = await Track.getSimilarTracks(id, limit);

      return res.status(200).json({
        success: true,
        data: tracks,
        count: tracks.length,
      });
    } catch (error) {
      console.error('Error fetching similar tracks:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch similar tracks',
        error: error.message,
      });
    }
  }

  // Get random track by genre
  static async getRandomByGenre(req, res) {
    try {
      const { genre } = req.params;
      const excludeTrackId = req.query.exclude ? parseInt(req.query.exclude, 10) : null;

      const tracks = await Track.getRandomByGenre(genre, excludeTrackId, 1);

      if (tracks.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No tracks found for this genre',
        });
      }

      return res.status(200).json({
        success: true,
        data: tracks[0],
      });
    } catch (error) {
      console.error('Error fetching random track:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch random track',
        error: error.message,
      });
    }
  }

  static async getWaveform(req, res) {
    try {
      const { id } = req.params;
      const track = await Track.getById(id);

      if (!track) {
        return res.status(404).json({ success: false, message: 'Track not found' });
      }

      // Return stored waveform if available
      if (track.waveform_data) {
        const peaks = typeof track.waveform_data === 'string'
          ? JSON.parse(track.waveform_data)
          : track.waveform_data;
        return res.json({ success: true, data: peaks });
      }

      // Generate on-the-fly for tracks without stored waveform
      const filePath = track.file_path || track.audio_url;
      let peaks;

      if (filePath && filePath.startsWith('http')) {
        // External URL — use deterministic fallback based on URL
        const { generateFallbackWaveform } = require('../utils/waveformGenerator.js');
        peaks = generateFallbackWaveform(filePath);
      } else if (filePath) {
        // Local file
        const absPath = path.join(__dirname, '../../uploads', path.basename(filePath));
        const { generateWaveformFromFile } = require('../utils/waveformGenerator.js');
        peaks = await generateWaveformFromFile(absPath);
      } else {
        const { generateFallbackWaveform } = require('../utils/waveformGenerator.js');
        peaks = generateFallbackWaveform(String(id));
      }

      // Cache it in DB for next time
      await Track.saveWaveform(id, peaks);

      return res.json({ success: true, data: peaks });
    } catch (error) {
      console.error('Error fetching waveform:', error);
      return res.status(500).json({ success: false, message: 'Failed to get waveform' });
    }
  }
}

module.exports = TrackController;
