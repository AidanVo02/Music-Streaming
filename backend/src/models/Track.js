const db = require('../config/db.js');

const TRACK_SELECT_FIELDS = `
    track_id,
    title,
    album_id,
    artist_id,
    duration,
    file_path,
    file_path AS audio_url,
    lyrics,
    play_count,
    originator,
    genre,
    cover_image_url,
    waveform_data
`;

class Track {
    static async getAll(limit = 50, offset = 0) {
        const [rows] = await db.query(
            `SELECT ${TRACK_SELECT_FIELDS} FROM tracks ORDER BY track_id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(
            `SELECT ${TRACK_SELECT_FIELDS} FROM tracks WHERE track_id = ?`,
            [id]
        );
        return rows[0];
    }

    static async getByArtist(artistId) {
        const [rows] = await db.query(
            `SELECT ${TRACK_SELECT_FIELDS} FROM tracks WHERE artist_id = ? ORDER BY track_id DESC`,
            [artistId]
        );
        return rows;
    }

    static async getByAlbum(albumId) {
        const [rows] = await db.query(
            `SELECT ${TRACK_SELECT_FIELDS} FROM tracks WHERE album_id = ? ORDER BY track_id DESC`,
            [albumId]
        );
        return rows;
    }

    static async create(trackData) {
        const {
            title,
            artist_id = null,
            album_id = null,
            duration,
            audio_url,
            file_path,
            lyrics = null,
            genre = null,
            originator = null,
            cover_image_url = null,
            waveform_data = null,
        } = trackData;

        const [result] = await db.query(
            `INSERT INTO tracks (title, artist_id, album_id, duration, file_path, lyrics, play_count, genre, originator, cover_image_url, waveform_data)
             VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
            [title, artist_id, album_id, duration, file_path || audio_url, lyrics, genre, originator, cover_image_url, waveform_data]
        );
        return result;
    }

    static async update(id, trackData) {
        const { title, lyrics } = trackData;
        const [result] = await db.query(
            'UPDATE tracks SET title = ?, lyrics = ? WHERE track_id = ?',
            [title, lyrics, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM tracks WHERE track_id = ?', [id]);
        return result;
    }

    static async search(searchTerm) {
        const [rows] = await db.query(
            `SELECT ${TRACK_SELECT_FIELDS} FROM tracks WHERE title LIKE ? ORDER BY track_id DESC`,
            [`%${searchTerm}%`]
        );
        return rows;
    }

    static async incrementPlayCount(id) {
        const [result] = await db.query(
            'UPDATE tracks SET play_count = play_count + 1 WHERE track_id = ?',
            [id]
        );
        return result;
    }

    static async saveWaveform(id, peaks) {
        const [result] = await db.query(
            'UPDATE tracks SET waveform_data = ? WHERE track_id = ?',
            [JSON.stringify(peaks), id]
        );
        return result;
    }

    static async getTopByGenre(limit = 5) {
        // Get top track per genre
        const [rows] = await db.query(
            `SELECT t1.track_id, t1.title, t1.album_id, t1.artist_id, t1.duration,
                    t1.file_path, t1.file_path AS audio_url, t1.lyrics, t1.play_count,
                    t1.originator, t1.genre, t1.cover_image_url
             FROM tracks t1
             INNER JOIN (
               SELECT genre, MAX(play_count) as max_plays
               FROM tracks
               WHERE genre IS NOT NULL
               GROUP BY genre
             ) t2 ON t1.genre = t2.genre AND t1.play_count = t2.max_plays
             WHERE t1.genre IS NOT NULL
             GROUP BY t1.track_id
             ORDER BY t1.play_count DESC
             LIMIT ?`,
            [limit]
        );
        return rows;
    }

    static async getTopTracksByGenre(genre, limit = 10) {
        const [rows] = await db.query(
            `SELECT ${TRACK_SELECT_FIELDS}
             FROM tracks
             WHERE genre = ?
             ORDER BY play_count DESC, track_id DESC
             LIMIT ?`,
            [genre, limit]
        );
        return rows;
    }

    static async getAllGenres() {
        const [rows] = await db.query(
            `SELECT DISTINCT genre, COUNT(*) as track_count
             FROM tracks
             WHERE genre IS NOT NULL
             GROUP BY genre
             ORDER BY track_count DESC`
        );
        return rows;
    }

    // Get similar tracks by genre (exclude current track)
    static async getSimilarTracks(trackId, limit = 20) {
        const [rows] = await db.query(
            `SELECT ${TRACK_SELECT_FIELDS}
             FROM tracks t1
             WHERE t1.genre = (SELECT genre FROM tracks WHERE track_id = ?)
               AND t1.track_id != ?
             ORDER BY RAND()
             LIMIT ?`,
            [trackId, trackId, limit]
        );
        return rows;
    }

    // Get random track by genre
    static async getRandomByGenre(genre, excludeTrackId = null, limit = 1) {
        let query = `SELECT ${TRACK_SELECT_FIELDS}
                     FROM tracks
                     WHERE genre = ?`;
        const params = [genre];
        
        if (excludeTrackId) {
            query += ' AND track_id != ?';
            params.push(excludeTrackId);
        }
        
        query += ' ORDER BY RAND() LIMIT ?';
        params.push(limit);
        
        const [rows] = await db.query(query, params);
        return rows;
    }
}

module.exports = Track;
