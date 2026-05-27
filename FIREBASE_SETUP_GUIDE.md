# Firebase Cloud Storage Setup Guide

## 📚 Overview

This guide shows how to setup Firebase Cloud Storage for uploading music files to the backend.

## 🚀 Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"** or select existing project
3. Follow the setup wizard
4. Enable **Cloud Storage** from left menu

### 2. Create Storage Bucket

1. Go to **Cloud Storage** in Firebase Console
2. Click **"Create bucket"**
3. Choose bucket name: `{your-app-name}-uploads`
4. Select location (recommend: US-Central)
5. Choose storage rules: **Start in Production mode**
6. Click **Create**

### 3. Generate Service Account Key

1. Go to **Project Settings** (⚙️ icon)
2. Click **"Service Accounts"** tab
3. Click **"Generate New Private Key"** button
4. JSON file will download automatically
5. Copy the content

### 4. Update Backend `.env`

Thêm các dòng này vào `backend/.env`:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_STORAGE_BUCKET=your_bucket_name.appspot.com
```

**Từ JSON file bạn vừa download:**

```json
{
  "type": "service_account",
  "project_id": "YOUR_PROJECT_ID",
  "private_key": "YOUR_PRIVATE_KEY",
  "client_email": "YOUR_CLIENT_EMAIL",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

**⚠️ IMPORTANT:** 
- Keep `FIREBASE_PRIVATE_KEY` private
- Don't commit `.env` to git
- Use environment variables in production

### 5. Setup Storage Rules (Optional)

Nếu muốn tự động cho phép uploads từ ứng dụng của bạn:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /tracks/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

## 📦 Dependencies Required

Backend cần cài:

```bash
cd backend
npm install firebase-admin multer
```

Frontend cần cài:

```bash
cd frontend
npx expo install expo-document-picker expo-file-system
```

## 🔌 API Endpoints

### Upload Track
```
POST /api/tracks/upload
Content-Type: multipart/form-data

Form Data:
- audio: File (audio file)
- title: string
- originator: string
- genre: string (optional)
- duration: number (optional)
```

**Response:**
```json
{
  "success": true,
  "message": "Track uploaded successfully",
  "data": {
    "track_id": 1,
    "title": "My Track",
    "originator": "Artist Name",
    "audio_url": "https://storage.googleapis.com/...",
    "duration": 180
  }
}
```

### Get All Tracks
```
GET /api/tracks?limit=50&offset=0
```

### Get Track by ID
```
GET /api/tracks/:id
```

### Search Tracks
```
GET /api/tracks/search?q=track_name
```

### Play Track (Increment Count)
```
POST /api/tracks/:id/play
```

### Delete Track
```
DELETE /api/tracks/:id
```

## 🎯 Frontend Usage

### Upload Track Example

```tsx
import { useUploadTrack, usePickAudio } from '@/src/hooks/useUploadTrack';

const MyComponent = () => {
  const { uploadTrack, uploading, progress, error } = useUploadTrack();
  const { pickAudio, picking } = usePickAudio();

  const handleUpload = async () => {
    // 1. Pick audio file
    const audioFile = await pickAudio();
    if (!audioFile) return;

    // 2. Upload
    const result = await uploadTrack(
      audioFile,
      'My Awesome Track',
      'Artist Name',
      'Electronic'
    );

    if (result) {
      console.log('Upload successful!', result.audio_url);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleUpload} disabled={uploading}>
        <Text>{uploading ? `Uploading ${progress}%` : 'Upload Track'}</Text>
      </TouchableOpacity>
      {error && <Text style={{color: 'red'}}>{error}</Text>}
    </View>
  );
};
```

## ⚙️ Without Firebase (Local Storage)

Nếu chưa setup Firebase, backend sẽ:
1. Lưu files vào `backend/uploads/` folder
2. Trả về local URL
3. Files có thể access qua: `http://localhost:5000/filename`

Bạn vẫn có thể test upload functionality mà không cần Firebase!

## 🐛 Troubleshooting

### "Cannot find module 'firebase-admin'"
```bash
cd backend
npm install firebase-admin
npm run dev
```

### "Firebase credentials not configured"
- Check `.env` file
- Verify all Firebase credentials are set
- Restart backend server

### "Bucket not found" Error
- Verify `FIREBASE_STORAGE_BUCKET` is correct
- Should end with `.appspot.com`
- Example: `my-app-12345.appspot.com`

### "Permission denied" Error
- Check Storage Rules in Firebase Console
- Make sure bucket is not in "Restricted mode"
- Verify service account has permissions

### Upload Size Limit
- Default: 500MB
- Change in `backend/src/routes/tracks.js`: `limits: { fileSize: ... }`

## ✅ Testing the Upload

### Using cURL

```bash
curl -X POST http://localhost:5000/api/tracks/upload \
  -F "audio=@/path/to/music.mp3" \
  -F "title=My Track" \
  -F "originator=Artist Name" \
  -F "genre=Electronic"
```

### Using Postman

1. Create POST request to `http://localhost:5000/api/tracks/upload`
2. Go to Body → form-data
3. Add fields:
   - `audio` (File type) → select audio file
   - `title` (Text) → "My Track"
   - `originator` (Text) → "Artist Name"
   - `genre` (Text) → "Electronic"
4. Click Send

## 📊 Database Schema

```sql
CREATE TABLE tracks (
    track_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_id INT,
    album_id INT,
    duration INT DEFAULT 0,
    audio_url VARCHAR(500) NOT NULL,
    lyrics TEXT,
    genre VARCHAR(100),
    originator VARCHAR(255),
    play_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE SET NULL,
    FOREIGN KEY (album_id) REFERENCES albums(album_id) ON DELETE SET NULL
);
```

## 🔒 Security Recommendations

1. **Never commit `.env`** - Add to `.gitignore`
2. **Use environment variables** in production
3. **Set proper Firebase Rules** - Don't allow public writes
4. **Validate file types** - Only allow audio files
5. **Limit file size** - Prevent abuse
6. **Add authentication** - Require user login for uploads
7. **Rate limiting** - Prevent spam uploads

## 📚 Resources

- [Firebase Console](https://console.firebase.google.com)
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/storage/admin)
- [Expo DocumentPicker Docs](https://docs.expo.dev/versions/latest/sdk/document-picker/)

---

**Status:** ✅ Ready for testing!

**Next:** Integrate upload handler to Upload screen and test end-to-end.
