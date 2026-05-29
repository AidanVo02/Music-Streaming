# Architecture Flow

## Overview

This document explains the core architecture of the Streaming_Web app, including:
- client navigation flow
- backend data relationships
- playlist and queue systems
- how the app screens connect and pass data

It is the consolidated version of `NAVIGATION_FLOW.md` and `PLAYLIST_SYSTEM_SETUP.md`.

---

## App Navigation Flow

### Primary user journeys
1. **Discovery → Player**
   - User selects a track from the discovery screen.
   - App dispatches play action via `QueueContext` and `PlayerContext`.
   - The track is added to the queue and the player screen opens.

2. **Library → Playlist Detail**
   - User opens library, selects the playlist tab.
   - Playlist list is fetched from `/api/playlists`.
   - Selecting a playlist opens `frontend/src/screens/playlistDetail/index.tsx`.

3. **Artist → Tracks**
   - User taps an artist card.
   - Artist detail screen loads tracks for that artist from `/api/artists/:id`.

4. **Upload → Track Upload**
   - Artist user goes to upload screen.
   - Frontend posts multipart form data to `/api/tracks/upload`.
   - Backend stores audio to either local uploads or Firebase Storage.

5. **Authentication**
   - Login/Register screens connect to `/api/auth/login` and `/api/auth/register`.
   - Auth token is stored client-side and reused for protected routes.

### Screen relationships

```
Discovery -> Player -> Queue Modal
       ↘
        Playlist Detail
Library -> Playlist Detail
Profile -> Artist Application
Upload -> Upload API
```

### Navigation structure
- `src/app/(tabs)/discovery.tsx`
- `src/app/(tabs)/library.tsx`
- `src/app/(tabs)/player.tsx`
- `src/app/(tabs)/upload.tsx`
- `src/app/(tabs)/user.tsx`
- `src/app/playlist/[id].tsx`
- `src/app/artist/[id].tsx`
- `src/app/artist-application.tsx`

The root layout uses `Expo Router`, so each screen is a route that can push or replace navigation state.

---

## Backend Architecture

### Core directories
- `backend/src/config/` - DB, JWT, Firebase config
- `backend/src/controllers/` - Business logic for each resource
- `backend/src/models/` - Database models and query helpers
- `backend/src/routes/` - Route definitions for Express
- `backend/src/scripts/` - Database setup and maintenance scripts

### Backend responsibilities
- Route incoming requests
- Validate authentication and role-based access
- Perform CRUD operations on MySQL
- Handle file uploads and Firebase storage
- Return JSON responses for the frontend

---

## Playlist & DB Schema

### Playlist flow
- Create playlist
- Add/remove tracks
- View public playlists
- Manage owner-only permissions

### Playlist data model
- `playlists` stores playlist metadata
- `playlist_tracks` stores track membership and order

### Entity relationship overview

```
Users --< Playlists --< Playlist_Tracks >-- Tracks
Artists --< Tracks
Users --< Likes >-- Tracks
Users --< Artist_Requests
```

### Key tables
- `users`
- `artists`
- `tracks`
- `playlists`
- `playlist_tracks`
- `likes`
- `artist_requests`

### Playlist SQL schema summary

```sql
CREATE TABLE Playlists (
  playlist_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Playlist_Tracks (
  playlist_id INT,
  track_id INT,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  position INT,
  PRIMARY KEY (playlist_id, track_id),
  FOREIGN KEY (playlist_id) REFERENCES Playlists(playlist_id) ON DELETE CASCADE,
  FOREIGN KEY (track_id) REFERENCES Tracks(track_id) ON DELETE CASCADE
);
```

---

## ERD & Relationships

### Simplified ERD
- `Users` owns `Playlists`
- `Playlists` contains many `Tracks`
- `Tracks` belong to an `Artist`
- `Users` like `Tracks`
- `Users` submit `Artist_Requests`

### Screen to entity mapping
- **Discovery** reads `Tracks`
- **Artist Detail** reads `Artists` + `Tracks`
- **Library** reads `Playlists`
- **Playlist Detail** reads `Playlist_Tracks`
- **Player** reads `Queue` + `Track` metadata

---

## How navigation supports features

### Playlist creation loop
1. User clicks create playlist in library
2. Frontend sends `POST /api/playlists`
3. Backend stores playlist and returns new ID
4. Frontend navigates to playlist detail

### Track playback loop
1. User selects track on any screen
2. Frontend updates queue and current track
3. Player screen renders current track
4. Next/Previous actions update queue state

### Smart Radio integration
- Smart Radio only triggers when the queue is empty
- It queries `/api/tracks/:id/similar` by genre
- This keeps playback continuous without manual selection

---

## Notes
- The app is built to separate navigation logic from playback logic.
- Player and queue are managed by React Context so every screen can interact with playback state.
- Backend routes are organized by resource, keeping API layer consistent and testable.
