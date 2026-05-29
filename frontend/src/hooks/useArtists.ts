import { useState, useEffect } from 'react';
import ApiService from '@/src/server/apiService';

interface Artist {
  artist_id: number;
  id: number;
  name: string;
  bio?: string;
  image_url?: string;
}

interface UseArtistsReturn {
  artists: Artist[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useArtists = (): UseArtistsReturn => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Fetching artists...');
      const response = await ApiService.getAllArtists();
      console.log('📥 API Response:', response);

      if (response?.success && response?.data && Array.isArray(response.data)) {
        console.log(`✅ Got ${response.data.length} artists`);
        setArtists(response.data);
      } else {
        console.warn('⚠️ Invalid response format:', response);
        setError('Invalid data format from server');
        setArtists([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch artists');
      console.error('❌ Error fetching artists:', err);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  return {
    artists,
    loading,
    error,
    refetch: fetchArtists,
  };
};

interface UseSearchArtistsReturn {
  results: Artist[];
  loading: boolean;
  error: string | null;
  search: (term: string) => void;
}

export const useSearchArtists = (): UseSearchArtistsReturn => {
  const [results, setResults] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.searchArtists(term);
      if (response.success && response.data) {
        setResults(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Search failed');
      console.error('Error searching artists:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    search,
  };
};
