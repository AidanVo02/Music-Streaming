import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import ApiService from '@/src/server/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from './AuthContext';

interface LikeContextType {
  likedTrackIds: Set<number>;
  toggleLike: (trackId: number | string) => Promise<boolean>;
  isLiked: (trackId: number | string) => boolean;
  loading: boolean;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export function LikeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const [likedTrackIds, setLikedTrackIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch initial likes
  useEffect(() => {
    let mounted = true;
    
    const fetchLikes = async () => {
      try {
        setLoading(true);
        if (!user) {
          setLikedTrackIds(new Set());
          setLoading(false);
          return;
        }

        const token = await AsyncStorage.getItem('@signal_onyx_token');
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await ApiService.request('/api/likes/ids', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res?.success && Array.isArray(res.data)) {
          if (mounted) {
            setLikedTrackIds(new Set(res.data.map(Number)));
          }
        }
      } catch (err) {
        console.error('Failed to fetch liked tracks:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchLikes();

    return () => {
      mounted = false;
    };
  }, [user]);

  const toggleLike = useCallback(async (trackId: number | string): Promise<boolean> => {
    if (!user) return false;

    const numericId = Number(trackId);

    // Optimistic UI update
    const previousLikes = new Set(likedTrackIds);
    const newLikes = new Set(likedTrackIds);
    const currentlyLiked = newLikes.has(numericId);
    
    if (currentlyLiked) {
      newLikes.delete(numericId);
    } else {
      newLikes.add(numericId);
    }
    
    setLikedTrackIds(newLikes);

    try {
      const token = await AsyncStorage.getItem('@signal_onyx_token');
      const res = await ApiService.request(`/api/likes/${trackId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res?.success) {
        // Revert on failure
        setLikedTrackIds(previousLikes);
        return currentlyLiked;
      }
      
      // Update with server truth
      const isNowLiked = res.liked;
      setLikedTrackIds(prev => {
        const set = new Set(prev);
        if (isNowLiked) set.add(numericId);
        else set.delete(numericId);
        return set;
      });
      
      return isNowLiked;
    } catch (err) {
      console.error('Failed to toggle like:', err);
      // Revert on failure
      setLikedTrackIds(previousLikes);
      return currentlyLiked;
    }
  }, [likedTrackIds, user]);

  const isLiked = useCallback((trackId: number | string) => {
    return likedTrackIds.has(Number(trackId));
  }, [likedTrackIds]);

  return (
    <LikeContext.Provider value={{ likedTrackIds, toggleLike, isLiked, loading }}>
      {children}
    </LikeContext.Provider>
  );
}

export function useLikes() {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error('useLikes must be used within a LikeProvider');
  }
  return context;
}
