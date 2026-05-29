import { useState, useEffect } from 'react';
import ApiService from '@/src/server/apiService';

interface Track {
  track_id: number;
  title: string;
  artist_id?: number;
  duration?: number;
  play_count?: number;
  genre?: string;
  cover_image_url?: string;
  audio_url?: string;
}

interface Genre {
  genre: string;
  track_count: number;
}

export const useDiscovery = () => {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [topRes, genresRes] = await Promise.all([
          ApiService.getTopByGenre(10),
          ApiService.getAllGenres(),
        ]);

        if (topRes?.success && topRes?.data) {
          setTopTracks(topRes.data);
        }
        if (genresRes?.success && genresRes?.data) {
          setGenres(genresRes.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load discovery data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { topTracks, genres, loading, error };
};

export const useGenreTracks = (genre: string, limit = 10) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!genre) return;

    const fetchTracks = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await ApiService.getTracksByGenre(genre, limit);
        if (res?.success && res?.data) {
          setTracks(res.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load tracks');
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [genre, limit]);

  return { tracks, loading, error };
};
