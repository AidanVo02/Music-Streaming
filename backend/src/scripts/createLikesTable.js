require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const db = require('../config/db');

async function createLikesTable() {
  try {
    console.log('🔄 Checking if liked_tracks table exists...');

    const [tables] = await db.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'liked_tracks'
    `, [process.env.DB_NAME || 'oscstation_db']);

    if (tables.length > 0) {
      console.log('✅ liked_tracks table already exists');
      return process.exit(0);
    }

    console.log('➕ Creating liked_tracks table...');

    await db.query(`
      CREATE TABLE liked_tracks (
        user_id INT NOT NULL,
        track_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, track_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (track_id) REFERENCES tracks(track_id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_track_id (track_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      COMMENT='Tracks liked by users'
    `);

    console.log('✅ liked_tracks table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createLikesTable();
