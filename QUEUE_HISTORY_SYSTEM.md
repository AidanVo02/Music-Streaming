# Queue & History System Documentation

## Overview
A comprehensive music queue and listening history system with Smart Radio integration.

## System Architecture

### Queue System
- **Purpose**: Manage playback order and enable Previous/Next navigation
- **Limit**: 500 tracks maximum
- **Auto-trim**: When limit reached, removes 250 oldest tracks, keeps 250 most recent
- **Persistence**: Queue persists during app session

### History System
- **Purpose**: Track all songs user has listened to
- **Limit**: 1000 tracks maximum
- **Auto-trim**: When limit reached, removes 500 oldest tracks, keeps 500 most recent
- **Trigger**: Track added to history when played >10% of duration
- **Deduplication**: Same track won't be added twice consecutively

### Smart Radio
- **Purpose**: Automatically find similar tracks when queue ends
- **Trigger**: When user presses Next and no next track in queue
- **Behavior**: Finds track with same genre, adds to queue, and plays it

## User Flows

### Flow 1: User Clicks Track from Discovery/Library
```
1. User clicks Track A
   → Track A added to END of queue
   → Jump to Track A and play
   → Queue: [...existing tracks..., A]

2. Track A plays >10% duration
   → Track A added to History
   → History: [..., A]

3. Track A ends
   → Smart Radio finds Track B (same genre)
   → Track B added to queue
   → Track B plays
   → Queue: [...existing tracks..., A, B]
```

### Flow 2: Next Button Behavior
```
Scenario A: Has next track in queue
1. User at Track A (index 2)
   Queue: [X, Y, A, B, C]
2. Press Next
   → Play Track B (index 3)
   → Queue unchanged

Scenario B: No next track in queue
1. User at Track C (index 4, last track)
   Queue: [X, Y, A, B, C]
2. Press Next
   → Smart Radio finds Track D
   → Track D added to queue
   → Play Track D
   → Queue: [X, Y, A, B, C, D]
```

### Flow 3: Previous Button Behavior
```
1. User at Track C (index 2)
   Queue: [A, B, C, D]
2. Press Previous
   → Play Track B (index 1)
   → Queue unchanged

3. At Track A (index 0, first track)
   → Previous button DISABLED
```

### Flow 4: Queue Limit Reached
```
1. Queue has 500 tracks
   Queue: [Track 1, Track 2, ..., Track 500]
   Current: Track 500 (index 499)

2. Smart Radio adds Track 501
   → Auto-trim triggered
   → Remove tracks 1-250
   → Keep tracks 251-501
   → Queue: [Track 251, ..., Track 501] (250 tracks)
   → Current index adjusted: 499 - 250 = 249
```

### Flow 5: History Tracking
```
1. Play Track A
   → 0% played: Not in history
   → 5% played: Not in history
   → 10% played: ✅ Added to history
   → History: [A]

2. Play Track B
   → 10% played: ✅ Added to history
   → History: [A, B]

3. Play Track A again
   → 10% played: Already in history, skip
   → History: [A, B] (unchanged)
```

## API Reference

### QueueContext

#### State
```typescript
queue: PlayerTrack[]           // All tracks in queue
currentIndex: number           // Current playing track index
shuffle: boolean               // Shuffle mode
repeat: 'off' | 'one' | 'all' // Repeat mode
```

#### Methods
```typescript
// Add track to end of queue (auto-trims if needed)
addToQueue(track: PlayerTrack): void

// Add track after current track
addNextInQueue(track: PlayerTrack): void

// Remove track at index
removeFromQueue(index: number): void

// Clear entire queue
clearQueue(): void

// Navigate to next track (returns null if no next)
playNext(): PlayerTrack | null

// Navigate to previous track (returns null if no previous)
playPrevious(): PlayerTrack | null

// Jump to specific index
playTrackAtIndex(index: number): PlayerTrack | null

// Check if has next/previous
hasNext(): boolean
hasPrevious(): boolean
```

### PlayerContext

#### State
```typescript
currentTrack: PlayerTrack | null  // Currently playing track
history: PlayerTrack[]            // Listening history
isPlaying: boolean
position: number                  // Current position (ms)
duration: number                  // Track duration (ms)
```

#### Methods
```typescript
// Play a track
playTrack(track: PlayerTrack): Promise<void>

// Toggle play/pause
togglePlay(): Promise<void>

// Seek to position
seekTo(ms: number): Promise<void>
```

## Configuration

### Limits
```typescript
QUEUE_LIMIT = 500        // Maximum tracks in queue
QUEUE_TRIM_TO = 250      // Keep this many when trimming

HISTORY_LIMIT = 1000     // Maximum tracks in history
HISTORY_TRIM_TO = 500    // Keep this many when trimming

HISTORY_THRESHOLD = 0.1  // Add to history at 10% played
```

### Performance Considerations
- Queue limit of 500 tracks ≈ 2KB memory (assuming 4 bytes per track reference)
- History limit of 1000 tracks ≈ 4KB memory
- Auto-trim prevents memory bloat
- Deduplication prevents history spam

## Console Logs

### Queue Operations
```
➕ Added track to queue at index X
🗑️ Queue limit reached (500). Trimming to 250 tracks...
✂️ Removed X old tracks. New index: Y
```

### History Operations
```
📚 Adding to history (X% played): [track name]
⚠️ Track already in history, skipping
📚 History length: X
🗑️ History limit reached (1000). Trimming to 500 tracks...
```

### Navigation
```
⏭️ Next button pressed
📊 Queue length: X
📍 Current index: Y
✅ Playing next from queue: [track name]
🎵 Smart Radio: Finding similar track...
✅ Found similar track: [track name]

⏮️ Previous button pressed
✅ Playing previous from queue: [track name]
⚠️ No previous track in queue
```

## Future Features (Phase 3 & 4)

### Phase 3: User Actions
- [ ] "Save Queue as Playlist" button
- [ ] Drag to reorder queue
- [ ] Swipe to remove from queue

### Phase 4: History Screen
- [ ] View full listening history
- [ ] Search history by track/artist
- [ ] Filter by genre/date
- [ ] Clear history button
- [ ] Play track from history

## Testing Scenarios

### Test 1: Queue Auto-Trim
1. Add 500 tracks to queue
2. Add 1 more track
3. Verify: Queue has 250 tracks (oldest 250 removed)
4. Verify: Current index adjusted correctly

### Test 2: History Tracking
1. Play track for 5% duration → Not in history
2. Play track for 15% duration → In history
3. Play same track again → Not duplicated

### Test 3: Smart Radio
1. Play track to end with no next in queue
2. Verify: Similar track found and added to queue
3. Verify: New track plays automatically

### Test 4: Previous/Next Navigation
1. Navigate through queue with Previous/Next
2. Verify: Correct tracks play
3. Verify: Previous disabled at start
4. Verify: Next always enabled (Smart Radio)

---

**Status**: ✅ Phase 1 & 2 Completed
**Last Updated**: 2026-04-23
