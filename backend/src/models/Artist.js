const db = require('../config/db.js');

class Artist {
  // Lấy tất cả artists
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM artists ORDER BY name ASC');
    return rows;
  }

  // Lấy artist theo ID
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM artists WHERE artist_id = ?', [id]);
    return rows[0];
  }

  // Tạo artist mới
  static async create(artistData) {
    const { name, bio, image_url } = artistData;
    const [result] = await db.query(
      'INSERT INTO artists (name, bio, image_url) VALUES (?, ?, ?)',
      [name, bio, image_url]
    );
    return result;
  }

  // Cập nhật artist
  static async update(id, artistData) {
    const { name, bio, image_url } = artistData;
    const [result] = await db.query(
      'UPDATE artists SET name = ?, bio = ?, image_url = ? WHERE artist_id = ?',
      [name, bio, image_url, id]
    );
    return result;
  }

  // Xóa artist
  static async delete(id) {
    const [result] = await db.query('DELETE FROM artists WHERE artist_id = ?', [id]);
    return result;
  }

  // Tìm artist theo tên
  static async search(searchTerm) {
    const [rows] = await db.query(
      'SELECT * FROM artists WHERE name LIKE ? ORDER BY name ASC',
      [`%${searchTerm}%`]
    );
    return rows;
  }
}

module.exports = Artist;
