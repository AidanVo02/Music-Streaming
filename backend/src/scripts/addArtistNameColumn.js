require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const db = require('../config/db');

async function addArtistNameColumn() {
  try {
    console.log('🔄 Checking if artist_name column exists...');

    // Check if column exists
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME = 'artist_name'
    `, [process.env.DB_NAME || 'oscstation_db']);

    if (columns.length > 0) {
      console.log('✅ artist_name column already exists');
      process.exit(0);
    }

    console.log('➕ Adding artist_name column...');

    // Add column
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN artist_name VARCHAR(255) NULL 
      COMMENT 'Stage name/nick name for artist' 
      AFTER role
    `);

    console.log('✅ artist_name column added successfully');

    // Verify
    const [result] = await db.query('DESCRIBE users');
    console.log('\n📋 Users table structure:');
    console.table(result);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addArtistNameColumn();
