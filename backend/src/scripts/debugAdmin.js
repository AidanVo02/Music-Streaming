require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const db = require('../config/db');

async function debug() {
  try {
    // Check tracks columns
    const [trackCols] = await db.query('DESCRIBE tracks');
    console.log('=== TRACKS COLUMNS ===');
    trackCols.forEach(c => console.log(' -', c.Field, '|', c.Type));

    // Check artist_requests
    const [[cnt]] = await db.query('SELECT COUNT(*) as total FROM artist_requests');
    console.log('\n=== ARTIST_REQUESTS COUNT ===', cnt.total);

    const [apps] = await db.query('SELECT * FROM artist_requests');
    console.log('=== ARTIST_REQUESTS DATA ===');
    console.log(apps);

    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

debug();
