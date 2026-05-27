require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const db = require('../config/db');

async function createArtistRequestsTable() {
  try {
    console.log('🔄 Checking if artist_requests table exists...');

    // Check if table exists
    const [tables] = await db.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'artist_requests'
    `, [process.env.DB_NAME || 'oscstation_db']);

    if (tables.length > 0) {
      console.log('✅ artist_requests table already exists');
      
      // Show table structure
      const [structure] = await db.query('DESCRIBE artist_requests');
      console.log('\n📋 Table structure:');
      console.table(structure);
      
      process.exit(0);
    }

    console.log('➕ Creating artist_requests table...');

    // Create table
    await db.query(`
      CREATE TABLE artist_requests (
        request_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        note TEXT NULL,
        reviewed_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      COMMENT='Artist role application requests'
    `);

    console.log('✅ artist_requests table created successfully');

    // Show table structure
    const [structure] = await db.query('DESCRIBE artist_requests');
    console.log('\n📋 Table structure:');
    console.table(structure);

    // Show all tables
    const [allTables] = await db.query('SHOW TABLES');
    console.log('\n📚 All tables in database:');
    console.table(allTables);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

createArtistRequestsTable();
