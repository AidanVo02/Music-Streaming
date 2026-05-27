require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const db = require('./config/db.js');
const artistRoutes = require('./routes/artists.js');
const trackRoutes = require('./routes/tracks.js');
const authRoutes = require('./routes/auth.js');
const artistApplicationRoutes = require('./routes/artistApplication.js');
const adminRoutes = require('./routes/admin.js');
const playlistRoutes = require('./routes/playlists.js');
const likesRoutes = require('./routes/likes.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));
app.use(cors({
  origin: '*',
  credentials: true,
}));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Streaming API!', status: 'running' });
});

// Database test route
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.json({ message: 'Database connected!', data: rows });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/artist-application', artistApplicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/likes', likesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start the server - Listen on all network interfaces (0.0.0.0)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📱 Mobile access: http://192.168.1.101:${PORT}`);
  console.log(`📌 API URL: http://localhost:${PORT}/api/artists`);
  console.log(`🧪 Test DB: http://localhost:${PORT}/test-db`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
