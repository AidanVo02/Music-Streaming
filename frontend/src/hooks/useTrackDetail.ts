import { useState, useEffect } from 'react';
import ApiService from '@/src/server/apiService';

interface Track {
  track_id: number;
  title: string;
  artist_id?: number;
  album_id?: number;
  duration?: number;
  play_count?: number;
  genre?: string;
  originator?: string;
  cover_image_url?: string;
  audio_url?: string;
  file_path?: string;
  lyrics?: string;
}

interface UseTrackDetailReturn {
  track: Track | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTrackDetail = (trackId: number | string): UseTrackDetailReturn => {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrack = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ApiService.getTrackById(trackId);
      if (res?.success && res?.data) {
        setTrack(res.data);
      } else if (res?.data) {
        setTrack(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load track');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackId) fetchTrack();
  }, [trackId]);

  return { track, loading, error, refetch: fetchTrack };
};
