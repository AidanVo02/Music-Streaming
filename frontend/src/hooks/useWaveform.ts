import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/src/server/apiConfig';

const NUM_PEAKS = 60;

// Deterministic fallback — same seed → same shape, always
function fallbackWaveform(seed: string): number[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return Array.from({ length: NUM_PEAKS }, (_, i) => {
    const t = i / NUM_PEAKS;
    const h = (hash >>> 0) / 0xffffffff;
    const v =
      Math.abs(Math.sin((t + h) * Math.PI * 3.7)) * 0.5 +
      Math.abs(Math.sin((t + h * 0.5) * Math.PI * 7.3)) * 0.3 +
      Math.abs(Math.sin((t + h * 0.3) * Math.PI * 13.1)) * 0.2;
    hash = (hash * 1664525 + 1013904223) >>> 0;
    return Math.max(0.1, Math.min(1.0, v));
  });
}

export function useWaveform(trackId?: string | number) {
  const [peaks, setPeaks] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!trackId) {
      setPeaks(fallbackWaveform('default'));
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`${API_BASE_URL}/api/tracks/${trackId}/waveform`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setPeaks(data.data);
        } else {
          setPeaks(fallbackWaveform(String(trackId)));
        }
      })
      .catch(() => {
        if (!cancelled) setPeaks(fallbackWaveform(String(trackId)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [trackId]);

  return { peaks, loading };
}
