const bcrypt = require('bcryptjs');
const db = require('../config/db.js');

const users = [
  {
    username: 'admin',
    email: 'admin@signalonyx.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    username: 'artist_demo',
    email: 'artist@signalonyx.com',
    password: 'Artist@123',
    role: 'artist',
  },
  {
    username: 'user_demo',
    email: 'user@signalonyx.com',
    password: 'User@123',
    role: 'user',
  },
];

async function seed() {
  console.log('🌱 Seeding users...\n');

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 12);
    try {
      await db.query(
        `INSERT INTO users (username, display_name, email, password_hash, role)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE role = VALUES(role)`,
        [u.username, u.username, u.email, hash, u.role]
      );
      console.log(`✅ [${u.role.toUpperCase()}] ${u.email}  |  password: ${u.password}`);
    } catch (err) {
      console.error(`❌ Failed to seed ${u.email}:`, err.message);
    }
  }

  console.log('\n✔ Done.');
  process.exit(0);
}

seed();
