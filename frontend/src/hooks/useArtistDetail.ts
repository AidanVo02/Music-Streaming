import { useState, useEffect } from 'react';
import ApiService from '@/src/server/apiService';

interface Artist {
  artist_id?: number;
  id?: number;
  name: string;
  bio?: string;
  image_url?: string;
}

interface Track {
  track_id: number;
  title: string;
  duration?: number;
  play_count?: number;
  file_path?: string;
  audio_url?: string;
}

interface UseArtistDetailReturn {
  artist: Artist | null;
  tracks: Track[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useArtistDetail = (artistId: number | string): UseArtistDetailReturn => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [artistRes, tracksRes] = await Promise.all([
        ApiService.getArtistById(artistId),
        ApiService.getTracksByArtist(artistId),
      ]);

      if (artistRes?.success && artistRes?.data) {
        setArtist(artistRes.data);
      } else if (artistRes?.data) {
        setArtist(artistRes.data);
      }

      if (tracksRes?.success && Array.isArray(tracksRes?.data)) {
        setTracks(tracksRes.data);
      } else {
        setTracks([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load artist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (artistId) fetchData();
  }, [artistId]);

  return { artist, tracks, loading, error, refetch: fetchData };
};
