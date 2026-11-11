import { useState, useEffect, useRef, useCallback } from 'react';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer, AudioStatus } from 'expo-audio';
import { API_BASE_URL } from '@/src/server/apiConfig';

export interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  position: number;   // ms — smoothly interpolated
  duration: number;   // ms
  error: string | null;
}

export function useAudioPlayer(audioUrl?: string | null) {
  const playerRef   = useRef<AudioPlayer | null>(null);
  const subRef      = useRef<{ remove: () => void } | null>(null);
  const rafRef      = useRef<number | null>(null);

  // "Ground truth" from expo-audio callbacks (updated every ~100ms)
  const lastSyncRef = useRef({ positionMs: 0, timestampMs: 0, isPlaying: false });

  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isLoading: false,
    isLoaded:  false,
    position:  0,
    duration:  0,
    error:     null,
  });

  // ── Smooth RAF loop ──────────────────────────────────────────────────────
  const startRaf = useCallback(() => {
    if (rafRef.current !== null) return;

    const tick = () => {
      const { positionMs, timestampMs, isPlaying } = lastSyncRef.current;
      if (isPlaying) {
        const elapsed = performance.now() - timestampMs;
        const interpolated = positionMs + elapsed;
        setState(s => ({ ...s, position: interpolated }));
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

  // ── Resolve URL ──────────────────────────────────────────────────────────
  const resolvedUrl = audioUrl
    ? audioUrl.startsWith('http')
      ? audioUrl
      : `${API_BASE_URL}${audioUrl.startsWith('/') ? '' : '/'}${audioUrl}`
    : null;

  // ── Load audio ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!resolvedUrl) return;

    let cancelled = false;

    const load = async () => {
      stopRaf();

      if (subRef.current) {
        try {
          subRef.current.remove();
        } catch {}
        subRef.current = null;
      }

      if (playerRef.current) {
        try {
          playerRef.current.pause();
          playerRef.current.remove();
        } catch {}
        playerRef.current = null;
      }

      setState(s => ({
        ...s,
        isLoading: true,
        isLoaded:  false,
        error:     null,
        position:  0,
        duration:  0,
      }));

      try {
        try {
          await setAudioModeAsync({
            playsInSilentMode: true,
            shouldPlayInBackground: true,
          });
        } catch {}

        if (cancelled) return;

        const player = createAudioPlayer(resolvedUrl, { updateInterval: 100 });

        if (cancelled) {
          player.remove();
          return;
        }

        const sub = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
          if (cancelled) return;

          const posMs = (status.currentTime ?? 0) * 1000;
          const durMs = (status.duration ?? 0) * 1000;

          // Update ground-truth ref (no re-render here)
          lastSyncRef.current = {
            positionMs:  posMs,
            timestampMs: performance.now(),
            isPlaying:   status.playing,
          };

          setState(s => {
            const next = {
              ...s,
              isPlaying: status.playing,
              duration:  durMs > 0 ? durMs : s.duration,
              isLoaded:  status.isLoaded,
              isLoading: false,
              error:     status.error ?? s.error,
            };

            // Sync position from status when paused / seeking
            if (!status.playing) {
              next.position = posMs;
            }

            return next;
          });

          if (status.playing) {
            startRaf();
          } else {
            stopRaf();
          }

          if (status.didJustFinish) {
            stopRaf();
            setState(s => ({ ...s, isPlaying: false, position: 0 }));
            lastSyncRef.current = { positionMs: 0, timestampMs: 0, isPlaying: false };
            try {
              player.seekTo(0);
            } catch {}
          }
        });

        subRef.current = sub;
        playerRef.current = player;
        setState(s => ({ ...s, isLoading: false, isLoaded: true }));
      } catch {
        if (!cancelled) {
          setState(s => ({ ...s, isLoading: false, error: 'Failed to load audio' }));
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      stopRaf();
      if (subRef.current) {
        try {
          subRef.current.remove();
        } catch {}
        subRef.current = null;
      }
      if (playerRef.current) {
        try {
          playerRef.current.pause();
          playerRef.current.remove();
        } catch {}
        playerRef.current = null;
      }
    };
  }, [resolvedUrl]);

  // ── Controls ─────────────────────────────────────────────────────────────
  const togglePlay = useCallback(async () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      if (state.isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    } catch {}
  }, [state.isPlaying]);

  const seekTo = useCallback(async (positionMs: number) => {
    try {
      if (!Number.isFinite(positionMs) || !Number.isFinite(state.duration) || state.duration <= 0) {
        return;
      }
      const clamped = Math.max(0, Math.min(positionMs, state.duration));
      if (!Number.isFinite(clamped)) return;

      // Optimistic UI update immediately
      setState(s => ({ ...s, position: clamped }));
      lastSyncRef.current = {
        positionMs:  clamped,
        timestampMs: performance.now(),
        isPlaying:   lastSyncRef.current.isPlaying,
      };
      if (playerRef.current) {
        await playerRef.current.seekTo(clamped / 1000);
      }
    } catch {}
  }, [state.duration]);

  const seekBy = useCallback(async (deltaMs: number) => {
    if (!Number.isFinite(deltaMs) || !Number.isFinite(state.duration) || state.duration <= 0) return;
    const currentPos = Number.isFinite(state.position) ? state.position : 0;
    const next = Math.max(0, Math.min(currentPos + deltaMs, state.duration));
    if (Number.isFinite(next)) {
      await seekTo(next);
    }
  }, [state.position, state.duration, seekTo]);

  return { ...state, togglePlay, seekTo, seekBy };
}
