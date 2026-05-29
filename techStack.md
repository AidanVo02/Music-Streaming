OscStation - Turn up Ur life (Streaming Music App for Web, Mobile)

Frontend 
- React Native ( EXPO )
- Tailwind CSS
- React

Backend 
- Node.js
- Express.js
- Redis

Database
- MySql
- Firebase
- Google Cloud Storage

Core Features 
1. Searching, Filter search
2. Play, Pause, Next songs
3. Login, Register User

Database Table
1. Nhóm quản lý Nhạc:
    -- 1. Bảng Nghệ sĩ
CREATE TABLE Artists (
    artist_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Album
CREATE TABLE Albums (
    album_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_id INT,
    release_date DATE,
    cover_art_url VARCHAR(500),
    genre VARCHAR(100),
    FOREIGN KEY (artist_id) REFERENCES Artists(artist_id) ON DELETE SET NULL
);

-- 3. Bảng Bài hát (Tracks)
CREATE TABLE Tracks (
    track_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    album_id INT,
    artist_id INT, -- Nghệ sĩ chính
    duration INT NOT NULL, -- Thời lượng tính bằng giây
    file_path VARCHAR(500) NOT NULL, -- Link S3 hoặc server
    lyrics TEXT,
    play_count INT DEFAULT 0,
    FOREIGN KEY (album_id) REFERENCES Albums(album_id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES Artists(artist_id) ON DELETE CASCADE
);

2. Nhóm người dùng, tương tác
    -- 4. Bảng Người dùng
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_pic_url VARCHAR(500),
    subscription_status ENUM('free', 'premium') DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng Danh sách phát (Playlist)
CREATE TABLE Playlists (
    playlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 6. Bảng trung gian Playlist_Tracks (N-N)
-- Để biết bài hát nào nằm trong playlist nào và thứ tự của chúng
CREATE TABLE Playlist_Tracks (
    playlist_id INT,
    track_id INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    position INT, -- Thứ tự bài hát trong playlist
    PRIMARY KEY (playlist_id, track_id),
    FOREIGN KEY (playlist_id) REFERENCES Playlists(playlist_id) ON DELETE CASCADE,
    FOREIGN KEY (track_id) REFERENCES Tracks(track_id) ON DELETE CASCADE
);

-- 7. Bảng Yêu thích (Likes)
CREATE TABLE User_Favorites (
    user_id INT,
    track_id INT,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, track_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (track_id) REFERENCES Tracks(track_id) ON DELETE CASCADE
);

3. Nhóm nâng cao (Theo dõi, Lịch sử )
    -- 8. Bảng Theo dõi Nghệ sĩ
CREATE TABLE Artist_Followers (
    user_id INT,
    artist_id INT,
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, artist_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES Artists(artist_id) ON DELETE CASCADE
);

-- 9. Bảng Lịch sử Nghe (Listening History)
-- Bảng này sẽ rất nhanh đầy, nên cân nhắc index tốt
CREATE TABLE Listening_History (
    history_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    track_id INT,
    listened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (track_id) REFERENCES Tracks(track_id) ON DELETE CASCADE
);