require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const db = require('../config/db');

async function run() {
  const [rows] = await db.query('SELECT track_id, title, file_path FROM tracks LIMIT 5');
  console.table(rows);
  process.exit(0);
}
run().catch(e => { console.error(e.message); process.exit(1); });
