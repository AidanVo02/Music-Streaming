import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { Audio } from 'expo-av';
import { API_BASE_URL } from '@/src/server/apiConfig';

export interface PlayerTrack {
  track_id: number;
  title: string;
  originator?: string;
  cover_image_url?: string;
  audio_url?: string;
  file_path?: string;
  duration?: number;
  genre?: string;
}

interface PlayerContextType {
  currentTrack: PlayerTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  position: number;   // ms
  duration: number;   // ms
  isTrackEnded: boolean;
  history: PlayerTrack[];  // Previously played tracks
  future: PlayerTrack[];   // Tracks to play next (for Previous/Next navigation)
  playTrack: (track: PlayerTrack, addToFuture?: boolean) => Promise<void>;
  togglePlay: () => Promise<void>;
  seekTo: (ms: number) => Promise<void>;
  stopPlayer: () => Promise<void>;
  popHistory: () => PlayerTrack | null;  // Get and remove last track from history
  popFuture: () => PlayerTrack | null;   // Get and remove first track from future
  addToFuture: (track: PlayerTrack) => void;  // Add track to future
}

const PlayerContext = createContext<PlayerContextType | null>(null);

const HISTORY_LIMIT = 1000; // Maximum tracks in history
const HISTORY_TRIM_TO = 500; // Keep this many tracks when limit reached
const HISTORY_THRESHOLD = 0.1; // Add to history when played >10% of track

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const soundRef    = useRef<Audio.Sound | null>(null);
  const rafRef      = useRef<number | null>(null);
  const lastSyncRef = useRef({ positionMs: 0, timestampMs: 0, isPlaying: false });
  const currentTrackRef = useRef<PlayerTrack | null>(null);  // Ref to track current track
  const addedToHistoryRef = useRef(false); // Track if current track was added to history
  const playTokenRef = useRef(0); // Token to prevent race conditions during track loading

  const [currentTrack, setCurrentTrack] = useState<PlayerTrack | null>(null);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [position,     setPosition]     = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [isTrackEnded, setIsTrackEnded] = useState(false);
  const [history,      setHistory]      = useState<PlayerTrack[]>([]);  // Track history
  const [future,       setFuture]       = useState<PlayerTrack[]>([]);  // Future tracks

  // Keep ref in sync with state
  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  // ─── AUTO-ADD TO HISTORY WHEN >10% PLAYED ─────────────────────────────
  useEffect(() => {
    if (currentTrack && duration > 0 && position > 0 && !addedToHistoryRef.current) {
      const playedPercentage = position / duration;
      
      if (playedPercentage >= HISTORY_THRESHOLD) {
        console.log(`📚 Adding to history (${Math.round(playedPercentage * 100)}% played):`, currentTrack.title);
        
        setHistory(prev => {
          // Check if track already exists in history (avoid duplicates)
          const exists = prev.some(t => t.track_id === currentTrack.track_id);
          if (exists) {
            console.log('⚠️ Track already in history, skipping');
            return prev;
          }
          
          const newHistory = [...prev, currentTrack];
          
          // Trim if needed
          if (newHistory.length > HISTORY_LIMIT) {
            console.log(`🗑️ History limit reached (${HISTORY_LIMIT}). Trimming to ${HISTORY_TRIM_TO} tracks...`);
            return newHistory.slice(-HISTORY_TRIM_TO);
          }
          
          console.log(`📚 History length: ${newHistory.length}`);
          return newHistory;
        });
        
        addedToHistoryRef.current = true;
      }
    }
  }, [currentTrack, position, duration]);

  // Reset history flag when track changes
  useEffect(() => {
    addedToHistoryRef.current = false;
  }, [currentTrack?.track_id]);

  // ── RAF smooth position ──────────────────────────────────────────────────
  const startRaf = useCallback(() => {
    if (rafRef.current !== null) return;
    const tick = () => {
      const { positionMs, timestampMs, isPlaying: playing } = lastSyncRef.current;
      if (playing) {
        setPosition(positionMs + (performance.now() - timestampMs));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // ── Unload current sound ─────────────────────────────────────────────────
  const unloadSound = useCallback(async () => {
    stopRaf();
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    lastSyncRef.current = { positionMs: 0, timestampMs: 0, isPlaying: false };
  }, [stopRaf]);

  // ── Play a track ─────────────────────────────────────────────────────────
  const playTrack = useCallback(async (track: PlayerTrack, addToFuture: boolean = true) => {
    // Increment the play token to invalidate any previous pending play requests
    playTokenRef.current += 1;
    const currentToken = playTokenRef.current;

    await unloadSound();
    
    // Check if another playTrack call was made while we were unloading
    if (currentToken !== playTokenRef.current) return;

    setCurrentTrack(track);
    setIsLoading(true);
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
    setIsTrackEnded(false);

    const rawUrl = track.audio_url ?? track.file_path ?? '';
    const url = rawUrl.startsWith('http')
      ? rawUrl
      : `${API_BASE_URL}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;

    if (!url) {
      if (currentToken === playTokenRef.current) setIsLoading(false);
      return;
    }

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS:    true,
        staysActiveInBackground: true,
      });

      // Avoid creating sound if another track is already requested
      if (currentToken !== playTokenRef.current) return;

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, progressUpdateIntervalMillis: 100 },
        (status) => {
          if (!status.isLoaded) return;
          
          // Only sync state if this token is actually the currently active one (prevents memory leak and TDZ error on Web)
          if (playTokenRef.current !== currentToken) return;

          lastSyncRef.current = {
            positionMs:  status.positionMillis ?? 0,
            timestampMs: performance.now(),
            isPlaying:   status.isPlaying,
          };

          setIsPlaying(status.isPlaying);
          setDuration(status.durationMillis ?? 0);
          setIsLoading(false);

          if (!status.isPlaying) {
            stopRaf();
            setPosition(status.positionMillis ?? 0);
          } else {
            startRaf();
          }

          if (status.didJustFinish) {
            stopRaf();
            setIsPlaying(false);
            setPosition(0);
            setIsTrackEnded(true);
            lastSyncRef.current = { positionMs: 0, timestampMs: 0, isPlaying: false };
            soundRef.current?.setPositionAsync(0);
          }
        }
      );

      // If a newer track was requested while createAsync was running, unload this orphaned sound
      if (currentToken !== playTokenRef.current) {
        await sound.unloadAsync();
        return;
      }

      soundRef.current = sound;
    } catch {
      // Check if we are still active before setting loading to false
      if (currentToken === playTokenRef.current) {
        setIsLoading(false);
      }
    }
  }, [unloadSound, startRaf, stopRaf]);

  // ── Toggle play/pause ────────────────────────────────────────────────────
  const togglePlay = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    } catch {}
  }, [isPlaying]);

  // ── Seek ─────────────────────────────────────────────────────────────────
  const seekTo = useCallback(async (ms: number) => {
    const clamped = Math.max(0, Math.min(ms, duration));
    setPosition(clamped);
    lastSyncRef.current = {
      positionMs:  clamped,
      timestampMs: performance.now(),
      isPlaying:   lastSyncRef.current.isPlaying,
    };
    await soundRef.current?.setPositionAsync(clamped);
  }, [duration]);

  // ── Stop ─────────────────────────────────────────────────────────────────
  const stopPlayer = useCallback(async () => {
    await unloadSound();
    setCurrentTrack(null);
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
    setIsTrackEnded(false);
    setHistory([]);  // Clear history when stopping
    setFuture([]);   // Clear future when stopping
  }, [unloadSound]);

  // ── Pop history (get and remove last track) ──────────────────────────────
  const popHistory = useCallback((): PlayerTrack | null => {
    if (history.length === 0) return null;
    
    const lastTrack = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    return lastTrack;
  }, [history]);

  // ── Pop future (get and remove first track) ──────────────────────────────
  const popFuture = useCallback((): PlayerTrack | null => {
    if (future.length === 0) return null;
    
    const nextTrack = future[0];
    setFuture(prev => prev.slice(1));
    console.log('🔮 Popped from future:', nextTrack.title, '| Remaining:', future.length - 1);
    return nextTrack;
  }, [future]);

  // ── Add to future ─────────────────────────────────────────────────────────
  const addToFuture = useCallback((track: PlayerTrack) => {
    setFuture(prev => {
      const newFuture = [...prev, track];
      console.log('🔮 Added to future:', track.title, '| Total:', newFuture.length);
      return newFuture;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => () => { unloadSound(); }, []);

  return (
    <PlayerContext.Provider value={{
      currentTrack, isPlaying, isLoading, position, duration, isTrackEnded, history, future,
      playTrack, togglePlay, seekTo, stopPlayer, popHistory, popFuture, addToFuture,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
};
