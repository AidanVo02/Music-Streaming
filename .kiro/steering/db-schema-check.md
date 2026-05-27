---
inclusion: always
---

# DB Schema Check Rule

Whenever a new feature is added or modified, **always verify the database schema matches** before writing any code.

## Current Database: `oscstation_db` (MySQL)

### Table: `users`
| Column | Type | Notes |
|---|---|---|
| `user_id` | INT, PK, AUTO_INCREMENT | |
| `username` | VARCHAR(255) | required |
| `display_name` | VARCHAR(255) | nullable, alias của username |
| `email` | VARCHAR(255) | required, unique |
| `password_hash` | VARCHAR(255) | required |
| `role` | ENUM('admin','artist','user') | default 'user' |
| `artist_name` | VARCHAR(255) | nullable, stage name/nick name cho artist |
| `profile_pic_url` | VARCHAR | nullable (tên gốc trong DB) |
| `avatar_url` | TEXT | nullable (alias) |
| `subscription_status` | ENUM | existing column |
| `follower_count` | INT | default 0 |
| `is_verified` | BOOLEAN | default FALSE |
| `is_banned` | BOOLEAN | default FALSE |
| `listening_time_hours` | DECIMAL(10,2) | default 0.00, thời gian nghe nhạc |
| `liked_songs_count` | INT | default 0, số bài hát đã thích |
| `discovery_streak_days` | INT | default 0, số ngày nghe nhạc liên tiếp |
| `membership_tier` | ENUM('free','premium','pro') | default 'free' |
| `premium_expires_at` | TIMESTAMP | nullable, ngày hết hạn premium |
| `storage_used_gb` | DECIMAL(10,2) | default 0.00, dung lượng đã dùng |
| `storage_limit_gb` | DECIMAL(10,2) | default 5.00, giới hạn dung lượng |
| `published_tracks_count` | INT | default 0, số track đã publish |
| `total_plays_count` | INT | default 0, tổng lượt phát |
| `followed_artists_count` | INT | default 0, số nghệ sĩ đang follow |
| `playlists_count` | INT | default 0, số playlist đã tạo |
| `created_at` | TIMESTAMP | auto |
| `updated_at` | TIMESTAMP | auto |

### Table: `artist_requests`
| Column | Type | Notes |
|---|---|---|
| `request_id` | INT, PK, AUTO_INCREMENT | |
| `user_id` | INT, FK → users | required |
| `status` | ENUM('pending','approved','rejected') | default 'pending' |
| `note` | TEXT | nullable |
| `reviewed_by` | INT, FK → users | nullable |
| `created_at` | TIMESTAMP | auto |
| `updated_at` | TIMESTAMP | auto |

### Table: `artists`
| Column | Type | Notes |
|---|---|---|
| `artist_id` | INT, PK, AUTO_INCREMENT | |
| `name` | VARCHAR | required |
| `bio` | TEXT | nullable |
| `image_url` | TEXT | nullable |
| `user_id` | INT, FK → users | nullable, unique |

### Table: `tracks`
| Column | Type | Notes |
|---|---|---|
| `track_id` | INT, PK, AUTO_INCREMENT | |
| `title` | VARCHAR | required |
| `artist_id` | INT, FK → artists | nullable |
| `album_id` | INT, FK → albums | nullable |
| `duration` | INT | seconds |
| `file_path` | TEXT | local audio file path / URL |
| `lyrics` | TEXT | nullable |
| `play_count` | INT | default 0 |
| `genre` | VARCHAR(100) | nullable |
| `originator` | VARCHAR(255) | nullable |
| `cover_image_url` | TEXT | nullable |
| `uploaded_by` | INT, FK → users | nullable |

### Table: `playlists`
| Column | Type | Notes |
|---|---|---|
| `playlist_id` | INT, PK, AUTO_INCREMENT | |
| `user_id` | INT, FK → users | required |
| `name` | VARCHAR(255) | required |
| `description` | TEXT | nullable |
| `cover_image_url` | TEXT | nullable |
| `is_public` | BOOLEAN | default TRUE |
| `track_count` | INT | default 0, auto-updated by trigger |
| `total_duration` | INT | default 0, in seconds, auto-updated by trigger |
| `created_at` | TIMESTAMP | auto |
| `updated_at` | TIMESTAMP | auto |

### Table: `playlist_tracks`
| Column | Type | Notes |
|---|---|---|
| `playlist_track_id` | INT, PK, AUTO_INCREMENT | |
| `playlist_id` | INT, FK → playlists | required |
| `track_id` | INT, FK → tracks | required |
| `position` | INT | default 0, order in playlist |
| `added_at` | TIMESTAMP | auto |
| UNIQUE | (playlist_id, track_id) | prevent duplicates |

## Checklist — Before implementing any feature:

1. **Identify all data fields** the feature reads or writes
2. **Cross-check each field** against the tables above
3. **If a column is missing** → provide the `ALTER TABLE` SQL before writing code
4. **If a new table is needed** → provide the `CREATE TABLE` SQL first
5. **Update this steering file** whenever the schema changes

## Backend file locations
- Models: `backend/src/models/`
- Controllers: `backend/src/controllers/`
- Routes: `backend/src/routes/`
- DB config: `backend/src/config/db.js`

## Frontend API layer
- API service: `frontend/src/server/apiService.ts`
- Upload service: `frontend/src/server/uploadService.ts`
- Hooks: `frontend/src/hooks/`
