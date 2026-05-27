require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const db = require('../config/db');

async function run() {
  const [cols] = await db.query(`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tracks' AND COLUMN_NAME = 'waveform_data'
  `);
  if (cols.length > 0) {
    console.log('✅ waveform_data column already exists');
  } else {
    await db.query(`ALTER TABLE tracks ADD COLUMN waveform_data JSON NULL AFTER cover_image_url`);
    console.log('✅ Added waveform_data column to tracks');
  }
  process.exit(0);
}
run().catch(e => { console.error(e.message); process.exit(1); });
