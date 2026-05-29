import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface User {
  user_id: number;
  username: string;
  display_name?: string;
  email: string;
  role: 'admin' | 'artist' | 'user';
  artist_name?: string;
  profile_pic_url?: string;
  is_verified?: boolean;
  listening_time_hours?: number;
  liked_songs_count?: number;
  discovery_streak_days?: number;
  membership_tier?: 'free' | 'premium' | 'pro';
  storage_used_gb?: number;
  storage_limit_gb?: number;
  published_tracks_count?: number;
  total_plays_count?: number;
  followed_artists_count?: number;
  playlists_count?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = '@signal_onyx_token';
const USER_KEY = '@signal_onyx_user';

// In-memory fallback storage for when AsyncStorage fails
let memoryStorage: { [key: string]: string } = {};

const safeAsyncStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.warn('AsyncStorage.getItem failed, using memory fallback:', error);
      return memoryStorage[key] || null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
      memoryStorage[key] = value; // Also save to memory
    } catch (error) {
      console.warn('AsyncStorage.setItem failed, using memory fallback:', error);
      memoryStorage[key] = value;
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      delete memoryStorage[key];
    } catch (error) {
      console.warn('AsyncStorage.removeItem failed, using memory fallback:', error);
      delete memoryStorage[key];
    }
  },
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app start
  useEffect(() => {
    const restore = async () => {
      try {
        const [savedToken, savedUser] = await Promise.all([
          safeAsyncStorage.getItem(TOKEN_KEY),
          safeAsyncStorage.getItem(USER_KEY),
        ]);
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          console.log('✅ Session restored successfully');
        }
      } catch (e) {
        console.warn('⚠️ Failed to restore session:', e);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const setAuth = async (newUser: User, newToken: string) => {
    try {
      await Promise.all([
        safeAsyncStorage.setItem(TOKEN_KEY, newToken),
        safeAsyncStorage.setItem(USER_KEY, JSON.stringify(newUser)),
      ]);
      setUser(newUser);
      setToken(newToken);
      console.log('✅ Auth saved successfully');
    } catch (error) {
      console.error('❌ Failed to save auth:', error);
      // Still set in state even if storage fails
      setUser(newUser);
      setToken(newToken);
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        safeAsyncStorage.removeItem(TOKEN_KEY),
        safeAsyncStorage.removeItem(USER_KEY),
      ]);
      setUser(null);
      setToken(null);
      console.log('✅ Logged out successfully');
    } catch (error) {
      console.error('❌ Failed to logout:', error);
      setUser(null);
      setToken(null);
    }
  };

  // Fetch latest user data from server and update local state + storage
  const refreshUser = async () => {
    const currentToken = token;
    if (!currentToken) return;
    try {
      const res = await fetch(
        `${require('@/src/server/apiConfig').API_BASE_URL}/api/auth/me`,
        { headers: { Authorization: `Bearer ${currentToken}` } }
      );
      const data = await res.json();
      if (data?.success && data?.data) {
        const updatedUser: User = data.data;
        await safeAsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);
        console.log('✅ User refreshed, role:', updatedUser.role);
      }
    } catch (error) {
      console.warn('⚠️ Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, setAuth, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
};
