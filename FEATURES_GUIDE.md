# Features Guide

## Overview

This document consolidates the advanced feature logic for the music streaming app, including:
- queue system
- listening history
- Smart Radio

It is the merged version of `QUEUE_SYSTEM_GUIDE.md`, `QUEUE_HISTORY_SYSTEM.md`, and `SMART_RADIO_GUIDE.md`.

---

## Queue System Logic

### Objectives
- provide smooth next/previous navigation
- support shuffle
- support repeat modes
- ensure auto-play of next track
- maintain a consistent queue state across screens

### Queue architecture

The queue is managed by `QueueContext` and exposed through hooks like `usePlayerQueue()`.

#### State
```ts
queue: PlayerTrack[]
currentIndex: number
shuffle: boolean
repeat: 'off' | 'all' | 'one'
```

#### Core operations
- `addToQueue(track)` → push new track to end
- `addNext(track)` → insert after current track
- `removeFromQueue(index)` → delete track
- `clearQueue()` → empty queue
- `playNext()` → move to next or trigger Smart Radio
- `playPrevious()` → move to previous in queue
- `playTrackAtIndex(index)` → jump to a specific track

### Navigation behavior

#### Next button
Priority order:
1. queue next track
2. future stack (if using history-based navigation)
3. Smart Radio when queue is empty

#### Previous button
- Goes back through `history`
- If no history and queue exists, uses previous queue item
- Disabled when no prior track exists

### Repeat modes
- `off` → normal playback until queue end
- `all` → loop queue
- `one` → replay current track continuously

### Shuffle mode
- Shuffle modifies queue order without changing the current track.
- Original order can be restored if needed.
- The current track remains in place while the rest of the queue shuffles.

### Auto-play
- When a track ends, the system automatically calls `playNext()`.
- Behavior respects repeat and shuffle state.
- If no next track and repeat is off, playback stops.

---

## History System Logic

### Purpose
The history system captures what the user has already listened to and enables smarter previous navigation.

### Key rules
- Add a track to history after it has played more than 10% of its duration.
- Do not add duplicate consecutive tracks.
- Keep history in order of listening.
- Trim history when it exceeds the limit.

### Limits
- `HISTORY_LIMIT = 1000`
- `HISTORY_TRIM_TO = 500`

### Example flow
```text
1. Play Track A → appears in history after 10%
2. Play Track B → history becomes [A]
3. Press Previous → returns to A
4. Play Track C → history becomes [A, B]
```

### User behavior
- Previous uses history when queue has no backward item.
- If history exists and queue is empty, previous opens last played track.
- History is a fallback when the standard queue cannot provide a previous track.

---

## Smart Radio Logic

### Purpose
Keep playback continuous by selecting a similar next track automatically when the queue is empty.

### When Smart Radio activates
- no next track in queue
- user presses Next OR current track ends
- queue is empty after playback

### Priority rules
- If queue has a next track → play it first
- If no queue track and history exists → use history only for Previous
- Smart Radio only handles forward playback when there is no queue candidate

### How similarity is determined
- Based on `genre` of current track
- Backend endpoint queries similar tracks excluding the current one
- Response returns a best-match similar track

### Example flow
```text
1. Current track ends
2. Queue is empty
3. Call GET /api/tracks/:id/similar?limit=1
4. Add returned track to queue
5. Play the new track
```

### Smart Radio endpoint
- `GET /api/tracks/:id/similar?limit=20`
- Optional: `GET /api/tracks/genre/:genre/random?exclude=ID`

### Frontend implementation
```ts
const playNext = useCallback(async () => {
  if (queue.hasNext()) {
    queue.playNext();
    return;
  }

  if (!player.currentTrack) return;

  const response = await ApiService.getSimilarTracks(player.currentTrack.track_id);
  if (response.success && response.data.length > 0) {
    const nextTrack = response.data[0];
    queue.addToQueue(nextTrack);
    player.playTrack(nextTrack);
  }
}, [queue, player]);
```

### User experience
- **Next button always enabled**
- **Previous button enabled** only when history or queue provides a backward track
- Smart Radio is seamless and only appears when manual selection is not available

---

## Combined feature best practices

### Consistency
- Keep queue state and history state separated but synchronized.
- Always treat queue as source of truth for forward playback.
- Use history only for backward navigation and user recall.

### Performance
- Trim queue and history to avoid uncontrolled growth.
- Avoid repeated API calls for Smart Radio when the current track is still loading.
- Prefer in-memory track metadata for playback instead of refetching on every navigation event.

### Troubleshooting
- If Next skips tracks, check queue index updates.
- If Previous fails, check history deduplication logic.
- If Smart Radio returns wrong genre, ensure the backend genre query is correct.

---

## Files and components

### Frontend
- `frontend/src/context/QueueContext.tsx`
- `frontend/src/context/PlayerContext.tsx`
- `frontend/src/hooks/usePlayerQueue.ts`
- `frontend/src/screens/player/index.tsx`
- `frontend/src/components/QueueModal.tsx`

### Backend
- `backend/src/controllers/TrackController.js`
- `backend/src/routes/tracks.js`
- `backend/src/models/Track.js`

---

## Summary

This guide explains the algorithmic thinking behind advanced playback features:
- stable queue navigation
- history-aware previous navigation
- content-aware Smart Radio fallback

These systems work together to deliver a smooth music listening experience and show clear technical design for a senior reviewer.
