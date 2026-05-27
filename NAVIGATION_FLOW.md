# Navigation Flow - History & Future System

## Concept
The player maintains two stacks:
- **History**: Tracks you've already played (for Previous button)
- **Future**: Tracks you'll play next (for Next button after going back)

## Visual Representation

```
History          Current          Future
-------          -------          ------
                 Track A          
```

### Flow Example

#### 1. Initial State - Play Track A
```
History: []
Current: Track A
Future: []
```

#### 2. Track A Ends → Auto-play Track B (Smart Radio)
```
History: [A]
Current: Track B
Future: []
```

#### 3. Press Previous → Go back to Track A
```
History: []
Current: Track A
Future: [B]  ← Track B moved to future!
```

#### 4. Track A Ends Again → Play Track B from Future
```
History: [A]
Current: Track B  ← Same Track B, not a new one!
Future: []
```

#### 5. Track B Ends → Auto-play Track C (Smart Radio)
```
History: [A, B]
Current: Track C
Future: []
```

#### 6. Press Previous → Go back to Track B
```
History: [A]
Current: Track B
Future: [C]  ← Track C moved to future!
```

#### 7. Press Previous Again → Go back to Track A
```
History: []
Current: Track A
Future: [B, C]  ← Both B and C in future!
```

#### 8. Press Next → Play Track B from Future
```
History: [A]
Current: Track B
Future: [C]
```

#### 9. Press Next Again → Play Track C from Future
```
History: [A, B]
Current: Track C
Future: []
```

## Key Features

### ✅ Bidirectional Navigation
- Previous button goes back through history
- Next button goes forward through future (if exists)
- Smart Radio only activates when future is empty

### ✅ Consistent Playback
- When you go back and let track finish, it plays the same next track
- No random tracks when navigating back and forth
- Smart Radio only finds new tracks when moving forward without future

### ✅ Natural Flow
```
Play A → Auto B → Previous → A → Auto B (same B!)
```

## Implementation Details

### History Stack
- Stores up to 50 previously played tracks
- Pushed when playing a new track
- Popped when pressing Previous

### Future Stack
- Stores tracks to play next
- Pushed when pressing Previous (current track moves to future)
- Popped when pressing Next (if future exists)
- Cleared when stopping player

### Smart Radio
- Only activates when:
  - No queue
  - No future tracks
  - User presses Next or track ends
- Finds similar tracks by genre
- Does NOT activate for Previous button

## Console Logs

```
📝 Adding to history: [track name]
📚 History length: X
🔮 Added to future: [track name] | Total: X
🔮 Popped from future: [track name] | Remaining: X
🔙 Playing from history: [track name]
⏭️ Next button pressed
⏮️ Previous button pressed
🎵 Smart Radio: Finding similar track...
```

## User Experience

### Previous Button
- Enabled when: Has history or queue
- Behavior: Go back to last played track
- Future: Current track moves to future

### Next Button
- Always enabled
- Priority: Queue → Future → Smart Radio
- Behavior: 
  1. If has future → play from future
  2. Else → find similar track (Smart Radio)

---

**Status**: ✅ Fully Implemented
**Last Updated**: 2026-04-23
