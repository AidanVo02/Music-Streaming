require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const db = require('../config/db');

async function run() {
  try {
    const [cols] = await db.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tracks' AND COLUMN_NAME = 'created_at'
    `);

    if (cols.length > 0) {
      console.log('✅ created_at already exists in tracks');
    } else {
      await db.query(`ALTER TABLE tracks ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
      console.log('✅ Added created_at to tracks');
    }

    // Also check uploaded_by
    const [ubCols] = await db.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tracks' AND COLUMN_NAME = 'uploaded_by'
    `);
    if (ubCols.length === 0) {
      await db.query(`ALTER TABLE tracks ADD COLUMN uploaded_by INT NULL`);
      console.log('✅ Added uploaded_by to tracks');
    } else {
      console.log('✅ uploaded_by already exists in tracks');
    }

    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

run();
