import { useState, useEffect, useCallback } from 'react';
import ApiService from '@/src/server/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Playlist {
  playlist_id: number;
  user_id: number;
  name: string;
  description?: string;
  cover_image_url?: string;
  is_public: boolean;
  track_count: number;
  total_duration: number;
  created_at: string;
  updated_at: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
}

export interface PlaylistTrack {
  track_id: number;
  title: string;
  artist_name?: string;
  artist_image_url?: string;
  cover_image_url?: string;
  audio_url?: string;
  duration?: number;
  genre?: string;
  position: number;
  added_at: string;
}

export interface PlaylistWithTracks extends Playlist {
  tracks: PlaylistTrack[];
}

// ─── GET MY PLAYLISTS ──────────────────────────────────────────────────────
export function useMyPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('@signal_onyx_token');
      
      if (!token) {
        setPlaylists([]);
        return;
      }

      const response = await ApiService.request('/api/playlists', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPlaylists(response.data || []);
    } catch (err: any) {
      console.error('Failed to fetch playlists:', err);
      setError(err.message || 'Failed to load playlists');
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  return { playlists, loading, error, refetch: fetchPlaylists };
}

// ─── GET PLAYLIST DETAIL ───────────────────────────────────────────────────
export function usePlaylistDetail(playlistId: string | number) {
  const [playlist, setPlaylist] = useState<PlaylistWithTracks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylist = useCallback(async () => {
    if (!playlistId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await ApiService.request(`/api/playlists/${playlistId}`);
      setPlaylist(response.data);
    } catch (err: any) {
      console.error('Failed to fetch playlist:', err);
      setError(err.message || 'Failed to load playlist');
      setPlaylist(null);
    } finally {
      setLoading(false);
    }
  }, [playlistId]);

  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  return { playlist, loading, error, refetch: fetchPlaylist };
}

// ─── GET PUBLIC PLAYLISTS ──────────────────────────────────────────────────
export function usePublicPlaylists(limit = 50) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ApiService.request(`/api/playlists/public?limit=${limit}`);
      setPlaylists(response.data || []);
    } catch (err: any) {
      console.error('Failed to fetch public playlists:', err);
      setError(err.message || 'Failed to load playlists');
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  return { playlists, loading, error, refetch: fetchPlaylists };
}

// ─── PLAYLIST ACTIONS ──────────────────────────────────────────────────────
export function usePlaylistActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPlaylist = async (data: {
    name: string;
    description?: string;
    cover_image_url?: string;
    is_public?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('@signal_onyx_token');

      console.log('🔑 Creating playlist with token:', token ? 'Token exists' : 'No token');

      if (!token) {
        throw new Error('Not authenticated. Please login first.');
      }

      const response = await ApiService.request('/api/playlists', {
        method: 'POST',
        body: data,
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('✅ Playlist created successfully:', response);

      return response.data;
    } catch (err: any) {
      console.error('Failed to create playlist:', err);
      setError(err.message || 'Failed to create playlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePlaylist = async (
    playlistId: number,
    data: {
      name?: string;
      description?: string;
      cover_image_url?: string;
      is_public?: boolean;
    }
  ) => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('@signal_onyx_token');

      const response = await ApiService.request(`/api/playlists/${playlistId}`, {
        method: 'PUT',
        body: data,
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (err: any) {
      console.error('Failed to update playlist:', err);
      setError(err.message || 'Failed to update playlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePlaylist = async (playlistId: number) => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('@signal_onyx_token');

      await ApiService.request(`/api/playlists/${playlistId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      return true;
    } catch (err: any) {
      console.error('Failed to delete playlist:', err);
      setError(err.message || 'Failed to delete playlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addTrackToPlaylist = async (playlistId: number, trackId: number) => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('@signal_onyx_token');

      await ApiService.request(`/api/playlists/${playlistId}/tracks`, {
        method: 'POST',
        body: { track_id: trackId },
        headers: { Authorization: `Bearer ${token}` },
      });

      return true;
    } catch (err: any) {
      console.error('Failed to add track:', err);
      setError(err.message || 'Failed to add track');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeTrackFromPlaylist = async (playlistId: number, trackId: number) => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('@signal_onyx_token');

      await ApiService.request(`/api/playlists/${playlistId}/tracks/${trackId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      return true;
    } catch (err: any) {
      console.error('Failed to remove track:', err);
      setError(err.message || 'Failed to remove track');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
  };
}
