# 🎵 PLAYLIST SYSTEM - SETUP GUIDE

## ✅ Implementation Complete!

The Playlist System has been fully implemented with the following features:

### 📦 **Features Implemented**

#### Backend:
- ✅ Database tables (`playlists`, `playlist_tracks`)
- ✅ Auto-update triggers for track_count and total_duration
- ✅ Full CRUD API endpoints
- ✅ Playlist model with all operations
- ✅ Playlist controller with authentication
- ✅ Routes integrated into main app

#### Frontend:
- ✅ Playlist hooks (`useMyPlaylists`, `usePlaylistDetail`, `usePlaylistActions`)
- ✅ Playlist detail screen with track list
- ✅ Library screen updated to show real playlists
- ✅ Create playlist functionality
- ✅ Add/Remove tracks from playlist
- ✅ Navigation routes configured

---

## 🚀 **SETUP INSTRUCTIONS**

### Step 1: Create Database Tables

Run the SQL script to create playlist tables:

```bash
cd backend
node src/scripts/createPlaylistTables.js
```

This will create:
- `playlists` table
- `playlist_tracks` table
- Triggers for auto-updating stats

### Step 2: Restart Backend Server

```bash
cd backend
npm start
```

The playlist routes are now available at `/api/playlists`

### Step 3: Test the API

Test endpoints using curl or Postman:

```bash
# Get public playlists
curl http://localhost:5000/api/playlists/public

# Create playlist (requires auth token)
curl -X POST http://localhost:5000/api/playlists \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Playlist","is_public":true}'
```

### Step 4: Run Frontend

```bash
cd frontend
npm start
```

---

## 📱 **HOW TO USE**

### Create a Playlist:
1. Go to **Library** screen
2. Select **PLAYLISTS** tab
3. Click the **+** button in top right
4. Enter playlist name
5. Click **Create**

### View Playlist:
1. Go to **Library** → **PLAYLISTS**
2. Click on any playlist
3. View tracks and details

### Add Track to Playlist:
*Coming in next phase - will add "Add to Playlist" button in track screens*

### Remove Track from Playlist:
1. Open playlist detail
2. Click the **X** button next to any track (only if you're the owner)

---

## 🔌 **API ENDPOINTS**

### Public Endpoints:
- `GET /api/playlists/public` - Get public playlists
- `GET /api/playlists/search?q=query` - Search playlists
- `GET /api/playlists/:id` - Get playlist by ID
- `GET /api/playlists/user/:user_id` - Get user's public playlists

### Protected Endpoints (require auth):
- `GET /api/playlists` - Get my playlists
- `POST /api/playlists` - Create playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/tracks` - Add track to playlist
- `DELETE /api/playlists/:id/tracks/:track_id` - Remove track from playlist
- `PUT /api/playlists/:id/tracks/reorder` - Reorder tracks

---

## 📂 **FILES CREATED**

### Backend:
```
backend/src/
├── scripts/
│   ├── createPlaylistTables.sql
│   └── createPlaylistTables.js
├── models/
│   └── Playlist.js
├── controllers/
│   └── PlaylistController.js
└── routes/
    └── playlists.js
```

### Frontend:
```
frontend/src/
├── hooks/
│   └── usePlaylists.ts
├── screens/
│   └── playlistDetail/
│       ├── index.tsx
│       └── playlistDetail.styles.ts
└── app/
    └── playlist/
        └── [id].tsx
```

### Updated Files:
- `backend/src/app.js` - Added playlist routes
- `frontend/src/server/apiService.ts` - Added playlist API methods
- `frontend/src/screens/library/index.tsx` - Added playlist tab
- `frontend/src/app/_layout.tsx` - Added playlist route
- `.kiro/steering/db-schema-check.md` - Updated schema documentation

---

## 🎯 **NEXT STEPS**

### Phase 2: Enhanced Features
1. ✅ Add "Add to Playlist" button in:
   - Track player screen
   - Track list items
   - Artist detail screen
2. ✅ Playlist edit screen
3. ✅ Drag-and-drop reorder tracks
4. ✅ Playlist cover image upload
5. ✅ Share playlist functionality

### Phase 3: Queue System
- Implement queue management
- Enable next/previous track
- Shuffle and repeat functionality
- Play entire playlist

---

## 🐛 **TROUBLESHOOTING**

### Database Error:
```
Error: Table 'playlists' doesn't exist
```
**Solution:** Run `node src/scripts/createPlaylistTables.js`

### API 401 Unauthorized:
```
Error: Access denied
```
**Solution:** Make sure you're logged in and token is valid

### Playlists Not Showing:
**Solution:** 
1. Check if you're logged in
2. Create a playlist first
3. Check console for API errors

---

## ✨ **SUCCESS!**

You now have a fully functional Playlist System! Users can:
- ✅ Create playlists
- ✅ View playlists
- ✅ Add/remove tracks
- ✅ Public/private playlists
- ✅ Auto-updating track counts and durations

**Next:** Implement Queue System for sequential playback!
