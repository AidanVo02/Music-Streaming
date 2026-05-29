import { useState, useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
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
  const soundRef    = useRef<Audio.Sound | null>(null);
  const rafRef      = useRef<number | null>(null);

  // "Ground truth" from expo-av callbacks (updated every ~100ms)
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

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
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
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS:    true,
          staysActiveInBackground: true,
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri: resolvedUrl },
          { shouldPlay: false, progressUpdateIntervalMillis: 100 }, // 100ms sync
          (status) => {
            if (cancelled || !status.isLoaded) return;

            // Update ground-truth ref (no re-render here)
            lastSyncRef.current = {
              positionMs:  status.positionMillis ?? 0,
              timestampMs: performance.now(),
              isPlaying:   status.isPlaying,
            };

            // Only update React state for non-position fields
            setState(s => {
              const next = {
                ...s,
                isPlaying: status.isPlaying,
                duration:  status.durationMillis ?? s.duration,
                isLoaded:  true,
                isLoading: false,
              };

              // Sync position from status when paused / seeking
              if (!status.isPlaying) {
                next.position = status.positionMillis ?? 0;
              }

              return next;
            });

            if (status.isPlaying) {
              startRaf();
            } else {
              stopRaf();
            }

            if (status.didJustFinish) {
              stopRaf();
              setState(s => ({ ...s, isPlaying: false, position: 0 }));
              lastSyncRef.current = { positionMs: 0, timestampMs: 0, isPlaying: false };
              sound.setPositionAsync(0);
            }
          }
        );

        if (cancelled) { await sound.unloadAsync(); return; }

        soundRef.current = sound;
        setState(s => ({ ...s, isLoading: false, isLoaded: true }));
      } catch (e: any) {
        if (!cancelled) {
          setState(s => ({ ...s, isLoading: false, error: 'Failed to load audio' }));
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      stopRaf();
      soundRef.current?.unloadAsync();
      soundRef.current = null;
    };
  }, [resolvedUrl]);

  // ── Controls ─────────────────────────────────────────────────────────────
  const togglePlay = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound) return;
    try {
      if (state.isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch {}
  }, [state.isPlaying]);

  const seekTo = useCallback(async (positionMs: number) => {
    try {
      const clamped = Math.max(0, Math.min(positionMs, state.duration));
      // Optimistic UI update immediately
      setState(s => ({ ...s, position: clamped }));
      lastSyncRef.current = {
        positionMs:  clamped,
        timestampMs: performance.now(),
        isPlaying:   lastSyncRef.current.isPlaying,
      };
      await soundRef.current?.setPositionAsync(clamped);
    } catch {}
  }, [state.duration]);

  const seekBy = useCallback(async (deltaMs: number) => {
    const next = Math.max(0, Math.min(state.position + deltaMs, state.duration));
    await seekTo(next);
  }, [state.position, state.duration, seekTo]);

  return { ...state, togglePlay, seekTo, seekBy };
}
