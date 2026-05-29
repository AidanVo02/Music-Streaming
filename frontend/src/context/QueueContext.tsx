import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { PlayerTrack } from './PlayerContext';

interface QueueContextType {
  queue: PlayerTrack[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  
  // Queue management
  setQueue: (tracks: PlayerTrack[], startIndex?: number) => void;
  addToQueue: (track: PlayerTrack) => void;
  addToQueueAndPlay: (track: PlayerTrack) => PlayerTrack; // Add and return track to play
  addNextInQueue: (track: PlayerTrack) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  moveInQueue: (fromIndex: number, toIndex: number) => void;
  
  // Navigation
  playNext: () => PlayerTrack | null;
  playPrevious: () => PlayerTrack | null;
  playTrackAtIndex: (index: number) => PlayerTrack | null;
  
  // Modes
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  
  // Getters
  hasNext: () => boolean;
  hasPrevious: () => boolean;
  getCurrentTrack: () => PlayerTrack | null;
  getUpNext: () => PlayerTrack[];
}

const QueueContext = createContext<QueueContextType | null>(null);

const QUEUE_LIMIT = 500; // Maximum tracks in queue
const QUEUE_TRIM_TO = 250; // Keep this many tracks when limit reached

export const QueueProvider = ({ children }: { children: React.ReactNode }) => {
  const [queue, setQueueState] = useState<PlayerTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'one' | 'all'>('off');
  const [originalQueue, setOriginalQueue] = useState<PlayerTrack[]>([]); // For shuffle

  // ─── AUTO-TRIM QUEUE ───────────────────────────────────────────────────
  const trimQueueIfNeeded = useCallback((newQueue: PlayerTrack[], newIndex: number) => {
    if (newQueue.length > QUEUE_LIMIT) {
      console.log(`🗑️ Queue limit reached (${QUEUE_LIMIT}). Trimming to ${QUEUE_TRIM_TO} tracks...`);
      
      // Keep the most recent QUEUE_TRIM_TO tracks
      const trimmedQueue = newQueue.slice(-QUEUE_TRIM_TO);
      
      // Adjust current index
      const indexOffset = newQueue.length - QUEUE_TRIM_TO;
      const adjustedIndex = Math.max(0, newIndex - indexOffset);
      
      console.log(`✂️ Removed ${indexOffset} old tracks. New index: ${adjustedIndex}`);
      
      return { queue: trimmedQueue, index: adjustedIndex };
    }
    return { queue: newQueue, index: newIndex };
  }, []);

  // ─── SET QUEUE ─────────────────────────────────────────────────────────
  const setQueue = useCallback((tracks: PlayerTrack[], startIndex: number = 0) => {
    const { queue: trimmedQueue, index: adjustedIndex } = trimQueueIfNeeded(tracks, startIndex);
    setQueueState(trimmedQueue);
    setOriginalQueue(trimmedQueue);
    setCurrentIndex(adjustedIndex);
  }, [trimQueueIfNeeded]);

  // ─── ADD TO QUEUE ──────────────────────────────────────────────────────
  const addToQueue = useCallback((track: PlayerTrack) => {
    setQueueState(prev => {
      const newQueue = [...prev, track];
      const { queue: trimmedQueue, index: adjustedIndex } = trimQueueIfNeeded(newQueue, currentIndex);
      setOriginalQueue(trimmedQueue);
      setCurrentIndex(adjustedIndex);
      return trimmedQueue;
    });
  }, [currentIndex, trimQueueIfNeeded]);

  // ─── ADD TO QUEUE AND PLAY ─────────────────────────────────────────────
  const addToQueueAndPlay = useCallback((track: PlayerTrack): PlayerTrack => {
    // Calculate new index before adding
    const newIndex = queue.length;
    
    // Add to queue
    const newQueue = [...queue, track];
    const { queue: trimmedQueue, index: adjustedIndex } = trimQueueIfNeeded(newQueue, newIndex);
    
    setQueueState(trimmedQueue);
    setOriginalQueue(trimmedQueue);
    setCurrentIndex(adjustedIndex);
    
    console.log(`➕ Added track to queue at index ${adjustedIndex}`);
    
    return track;
  }, [queue, trimQueueIfNeeded]);

  // ─── ADD NEXT IN QUEUE ─────────────────────────────────────────────────
  const addNextInQueue = useCallback((track: PlayerTrack) => {
    setQueueState(prev => {
      const newQueue = [...prev];
      newQueue.splice(currentIndex + 1, 0, track);
      return newQueue;
    });
    setOriginalQueue(prev => {
      const newQueue = [...prev];
      newQueue.splice(currentIndex + 1, 0, track);
      return newQueue;
    });
  }, [currentIndex]);

  // ─── REMOVE FROM QUEUE ─────────────────────────────────────────────────
  const removeFromQueue = useCallback((index: number) => {
    setQueueState(prev => prev.filter((_, i) => i !== index));
    setOriginalQueue(prev => prev.filter((_, i) => i !== index));
    
    // Adjust current index if needed
    if (index < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    } else if (index === currentIndex && currentIndex >= queue.length - 1) {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    }
  }, [currentIndex, queue.length]);

  // ─── CLEAR QUEUE ───────────────────────────────────────────────────────
  const clearQueue = useCallback(() => {
    setQueueState([]);
    setOriginalQueue([]);
    setCurrentIndex(-1);
  }, []);

  // ─── MOVE IN QUEUE ─────────────────────────────────────────────────────
  const moveInQueue = useCallback((fromIndex: number, toIndex: number) => {
    setQueueState(prev => {
      const newQueue = [...prev];
      const [removed] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, removed);
      return newQueue;
    });
    
    // Adjust current index
    if (fromIndex === currentIndex) {
      setCurrentIndex(toIndex);
    } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
      setCurrentIndex(prev => prev - 1);
    } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex]);

  // ─── PLAY NEXT ─────────────────────────────────────────────────────────
  const playNext = useCallback((): PlayerTrack | null => {
    if (queue.length === 0) return null;

    // Repeat one - stay on same track
    if (repeat === 'one') {
      return queue[currentIndex] || null;
    }

    // Normal next
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return queue[currentIndex + 1];
    }

    // Repeat all - go to start
    if (repeat === 'all') {
      setCurrentIndex(0);
      return queue[0];
    }

    // No next track
    return null;
  }, [queue, currentIndex, repeat]);

  // ─── PLAY PREVIOUS ─────────────────────────────────────────────────────
  const playPrevious = useCallback((): PlayerTrack | null => {
    if (queue.length === 0) return null;

    // Repeat one - stay on same track
    if (repeat === 'one') {
      return queue[currentIndex] || null;
    }

    // Normal previous
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return queue[currentIndex - 1];
    }

    // Repeat all - go to end
    if (repeat === 'all') {
      setCurrentIndex(queue.length - 1);
      return queue[queue.length - 1];
    }

    // No previous track
    return null;
  }, [queue, currentIndex, repeat]);

  // ─── PLAY TRACK AT INDEX ───────────────────────────────────────────────
  const playTrackAtIndex = useCallback((index: number): PlayerTrack | null => {
    if (index < 0 || index >= queue.length) return null;
    setCurrentIndex(index);
    return queue[index];
  }, [queue]);

  // ─── TOGGLE SHUFFLE ────────────────────────────────────────────────────
  const toggleShuffle = useCallback(() => {
    setShuffle(prev => {
      const newShuffle = !prev;
      
      if (newShuffle) {
        // Shuffle: randomize queue but keep current track
        const currentTrack = queue[currentIndex];
        const otherTracks = queue.filter((_, i) => i !== currentIndex);
        const shuffled = [...otherTracks].sort(() => Math.random() - 0.5);
        setQueueState([currentTrack, ...shuffled]);
        setCurrentIndex(0);
      } else {
        // Un-shuffle: restore original order
        const currentTrack = queue[currentIndex];
        const originalIndex = originalQueue.findIndex(t => t.track_id === currentTrack?.track_id);
        setQueueState(originalQueue);
        setCurrentIndex(originalIndex >= 0 ? originalIndex : 0);
      }
      
      return newShuffle;
    });
  }, [queue, currentIndex, originalQueue]);

  // ─── TOGGLE REPEAT ─────────────────────────────────────────────────────
  const toggleRepeat = useCallback(() => {
    setRepeat(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  // ─── GETTERS ───────────────────────────────────────────────────────────
  const hasNext = useCallback(() => {
    if (repeat === 'one' || repeat === 'all') return true;
    return currentIndex < queue.length - 1;
  }, [currentIndex, queue.length, repeat]);

  const hasPrevious = useCallback(() => {
    if (repeat === 'one' || repeat === 'all') return true;
    return currentIndex > 0;
  }, [currentIndex, repeat]);

  const getCurrentTrack = useCallback(() => {
    return queue[currentIndex] || null;
  }, [queue, currentIndex]);

  const getUpNext = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= queue.length - 1) return [];
    return queue.slice(currentIndex + 1);
  }, [queue, currentIndex]);

  return (
    <QueueContext.Provider value={{
      queue,
      currentIndex,
      shuffle,
      repeat,
      setQueue,
      addToQueue,
      addToQueueAndPlay,
      addNextInQueue,
      removeFromQueue,
      clearQueue,
      moveInQueue,
      playNext,
      playPrevious,
      playTrackAtIndex,
      toggleShuffle,
      toggleRepeat,
      hasNext,
      hasPrevious,
      getCurrentTrack,
      getUpNext,
    }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) throw new Error('useQueue must be used inside QueueProvider');
  return context;
};
