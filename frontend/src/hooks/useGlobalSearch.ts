import { useState, useCallback } from 'react';
import ApiService from '@/src/server/apiService';

export interface SearchResults {
  tracks: any[];
  artists: any[];
  playlists: any[];
}

export function useGlobalSearch() {
  const [results, setResults] = useState<SearchResults>({
    tracks: [],
    artists: [],
    playlists: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query || !query.trim()) {
      setResults({ tracks: [], artists: [], playlists: [] });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [tracksRes, artistsRes, playlistsRes] = await Promise.all([
        ApiService.searchTracks(query).catch(err => {
          console.error('Track search error:', err);
          return { data: [] };
        }),
        ApiService.searchArtists(query).catch(err => {
          console.error('Artist search error:', err);
          return { data: [] };
        }),
        ApiService.searchPlaylists(query).catch(err => {
          console.error('Playlist search error:', err);
          return { data: [] };
        })
      ]);

      setResults({
        tracks: tracksRes?.data || [],
        artists: artistsRes?.data || [],
        playlists: playlistsRes?.data || []
      });
    } catch (err: any) {
      console.error('Global search error:', err);
      setError(err.message || 'An error occurred while searching');
      setResults({ tracks: [], artists: [], playlists: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResults({ tracks: [], artists: [], playlists: [] });
    setError(null);
  }, []);

  return { results, loading, error, search, clearSearch };
}
