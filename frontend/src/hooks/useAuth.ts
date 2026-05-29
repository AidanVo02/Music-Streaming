import { useState } from 'react';
import ApiService from '@/src/server/apiService';
import { useAuthContext } from '@/src/context/AuthContext';

export const useAuth = () => {
  const { setAuth, logout, refreshUser, user, token, loading } = useAuthContext();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setSubmitting(true);
      setError(null);
      const res = await ApiService.login({ email, password });
      if (res?.success && res?.data) {
        await setAuth(res.data, res.data.token);
        return true;
      }
      setError(res?.message || 'Login failed');
      return false;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setSubmitting(true);
      setError(null);
      const res = await ApiService.register({ username, email, password });
      if (res?.success && res?.data) {
        await setAuth(res.data, res.data.token);
        return true;
      }
      setError(res?.message || 'Registration failed');
      return false;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateProfile = async (formData: FormData): Promise<boolean> => {
    try {
      if (!token) throw new Error('Not authenticated');
      setSubmitting(true);
      setError(null);
      
      const res = await ApiService.updateProfile(formData, token);
      if (res?.success) {
        // Refresh user details to get the new avatar/name
        await refreshUser();
        return true;
      }
      setError(res?.message || 'Profile update failed');
      return false;
    } catch (err: any) {
      setError(err.message || 'Profile update failed');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { login, register, logout, refreshUser, updateProfile, user, token, loading, submitting, error };
};
