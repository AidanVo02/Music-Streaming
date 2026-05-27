# Smart Radio System Guide

## Overview
Smart Radio is an intelligent music discovery feature that automatically finds and plays similar tracks when the queue is empty. It ensures continuous music playback by analyzing the current track's genre and finding matching songs. The system also includes a **Play History** feature that allows users to go back to previously played tracks.

## How It Works

### Logic Flow

#### Next Button
1. **Queue Priority**: If there are tracks in the queue, play the next track from the queue
2. **Smart Radio Mode**: If queue is empty, automatically find a similar track by genre
3. **Seamless Playback**: New track is added to queue and starts playing automatically

#### Previous Button
1. **Queue Priority**: If there are tracks in the queue, play the previous track from the queue
2. **History Mode**: If no queue, play the last track from play history
3. **Smart Radio Fallback**: If no history, find a similar track by genre

### User Experience
- **Next Button**: Always enabled
  - With queue → plays next track in queue
  - Without queue → finds similar track by genre (Smart Radio)
- **Previous Button**: Enabled only when has history or queue
  - With queue → plays previous track in queue
  - Without queue but has history → plays last track from history
  - Without queue or history → **disabled** (can't go back without history)

## Play History Feature

### How History Works
- Every time you play a new track, the previous track is automatically saved to history
- History stores up to **50 tracks** (oldest tracks are removed automatically)
- When you press Previous without a queue, it plays the last track from history
- History is cleared when you stop the player

### Example Flow
```
1. Play Track A → History: []
2. Track A ends → Auto-play Track B (Smart Radio) → History: [A]
3. Track B ends → Auto-play Track C (Smart Radio) → History: [A, B]
4. Press Previous → Play Track B from history → History: [A]
5. Press Previous → Play Track A from history → History: []
6. Press Previous → Button disabled (no history)
```

### Manual Next/Previous Flow
```
1. Play Track A → History: []
2. Press Next → Play Track B (Smart Radio) → History: [A]
3. Press Previous → Play Track A from history → History: []
4. Press Next → Play Track C (Smart Radio) → History: [A]
5. Press Previous → Play Track A from history → History: []
```

## Implementation

### Backend API Endpoints

#### 1. Get Similar Tracks
```
GET /api/tracks/:id/similar?limit=20
```
Returns tracks with the same genre as the specified track (excluding the track itself).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "track_id": 11,
      "title": "Neon Nights",
      "originator": "The Grid",
      "genre": "House",
      "cover_image_url": "...",
      "audio_url": "...",
      "duration": 298,
      ...
    }
  ],
  "count": 1
}
```

#### 2. Get Random Track by Genre
```
GET /api/tracks/genre/:genre/random?exclude=28
```
Returns a random track from the specified genre (optionally excluding a track ID).

### Frontend Implementation

#### Hook: `usePlayerQueue.ts`
```typescript
const playNext = useCallback(async () => {
  // Try queue first
  if (queue.queue.length > 0 && queue.hasNext()) {
    const nextTrack = queue.playNext();
    if (nextTrack) {
      await player.playTrack(nextTrack);
      return;
    }
  }

  // Smart Radio mode
  if (player.currentTrack) {
    const response = await ApiService.request(
      `/api/tracks/${player.currentTrack.track_id}/similar?limit=1`
    );
    
    if (response.success && response.data.length > 0) {
      const similarTrack = response.data[0];
      queue.addToQueue(similarTrack);
      await player.playTrack(similarTrack);
    }
  }
}, [queue, player]);
```

## Database Schema

### Tracks Table
The Smart Radio system relies on the `genre` column in the `tracks` table:

```sql
CREATE TABLE tracks (
  track_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100),  -- Used for Smart Radio matching
  originator VARCHAR(255),
  cover_image_url TEXT,
  audio_url TEXT,
  duration INT,
  ...
);
```

## Features

### ✅ Implemented
- [x] Smart Radio finds similar tracks by genre
- [x] Automatic playback when queue is empty
- [x] Queue takes priority over Smart Radio
- [x] Next button always enabled
- [x] Previous button always enabled
- [x] **Play History system** - tracks last 50 played tracks
- [x] Previous button uses history when no queue
- [x] Track data validation and fallbacks
- [x] Error handling for API failures

### 🎯 Future Enhancements
- [ ] Persistent history (save to AsyncStorage)
- [ ] Clear history button
- [ ] View full play history
- [ ] Multi-factor matching (genre + mood + tempo)
- [ ] User preference learning
- [ ] "Radio Station" mode (continuous Smart Radio)
- [ ] Visual indicator for Smart Radio mode vs Queue mode vs History mode
- [ ] Loading state while fetching similar tracks

## Testing

### Test Smart Radio
1. Play a track (e.g., track ID 28)
2. Don't add any tracks to queue
3. Press Next button
4. System should automatically find and play a similar track by genre

### Test Queue Priority
1. Play a track
2. Add multiple tracks to queue
3. Press Next button
4. Should play next track from queue (not Smart Radio)

### Test API Endpoints
```bash
# Get similar tracks
curl http://localhost:5000/api/tracks/28/similar?limit=1

# Get random track by genre
curl http://localhost:5000/api/tracks/genre/House/random?exclude=28
```

## Error Handling

### Track Data Validation
All tracks fetched from Smart Radio API are validated and normalized:
```typescript
const similarTrack = {
  track_id: rawTrack.track_id,
  title: rawTrack.title || 'Unknown Title',
  originator: rawTrack.originator || 'Unknown Artist',
  cover_image_url: rawTrack.cover_image_url || null,
  audio_url: rawTrack.audio_url || rawTrack.file_path,
  file_path: rawTrack.file_path || rawTrack.audio_url,
  duration: rawTrack.duration || 0,
  genre: rawTrack.genre || null,
  // ... other fields with fallbacks
};
```

### API Failure Handling
- If API request fails → log error, don't crash
- If no similar tracks found → log warning, stop playback
- If track data is invalid → use fallback values

## Files Modified

### Backend
- `backend/src/models/Track.js` - Added `getSimilarTracks()` and `getRandomByGenre()` methods
- `backend/src/controllers/TrackController.js` - Added `getSimilarTracks()` and `getRandomByGenre()` endpoints
- `backend/src/routes/tracks.js` - Added routes for Smart Radio endpoints

### Frontend
- `frontend/src/context/PlayerContext.tsx` - **Added play history system** (stores last 50 tracks)
- `frontend/src/hooks/usePlayerQueue.ts` - Implemented Smart Radio logic with history support
- `frontend/src/context/QueueContext.tsx` - Queue management system
- `frontend/src/screens/player/index.tsx` - Updated to use `player.currentTrack` for real-time UI updates

## Notes

- Smart Radio only works when a track is currently playing
- Genre matching is case-sensitive (ensure consistent genre naming in database)
- Tracks without genre will not be included in Smart Radio results
- System uses `ORDER BY RAND()` for random selection (consider performance for large datasets)

---

**Status**: ✅ Fully Implemented and Tested
**Last Updated**: 2026-04-23
