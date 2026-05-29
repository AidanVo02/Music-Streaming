import { useState } from 'react';
import UploadService from '@/src/server/uploadService';
import { useAuthContext } from '@/src/context/AuthContext';

interface UploadTrackResponse {
  track_id: number;
  title: string;
  originator: string;
  audio_url: string;
  duration: number;
}

interface UseUploadTrackReturn {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadTrack: (
    audioFile: any,
    title: string,
    originator: string,
    genre?: string
  ) => Promise<UploadTrackResponse | null>;
}

export const useUploadTrack = (): UseUploadTrackReturn => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthContext();

  const uploadTrack = async (
    audioFile: any,
    title: string,
    originator: string,
    genre: string = 'Electronic'
  ): Promise<UploadTrackResponse | null> => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      console.log('📤 Starting upload:', { title, originator, genre });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      // Upload track with token
      const response = await UploadService.uploadTrack(
        audioFile,
        title,
        originator,
        genre,
        180,
        token || undefined
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (response.success && response.data) {
        console.log('✅ Upload successful');
        setTimeout(() => {
          setUploading(false);
          setProgress(0);
        }, 1000);
        return response.data;
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      console.error('❌ Upload error:', err);
      setUploading(false);
      setProgress(0);
      return null;
    }
  };

  return {
    uploading,
    progress,
    error,
    uploadTrack,
  };
};

interface UsePickAudioReturn {
  picking: boolean;
  error: string | null;
  pickAudio: () => Promise<any>;
}

export const usePickAudio = (): UsePickAudioReturn => {
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickAudio = async () => {
    try {
      setPicking(true);
      setError(null);

      console.log('🎵 Picking audio file...');
      const file = await UploadService.pickAudioFile();

      setPicking(false);
      return file;
    } catch (err: any) {
      setError(err.message || 'Failed to pick file');
      console.error('❌ Pick error:', err);
      setPicking(false);
      return null;
    }
  };

  return {
    picking,
    error,
    pickAudio,
  };
};

interface UsePickImageReturn {
  picking: boolean;
  error: string | null;
  pickImage: () => Promise<any>;
}

export const usePickImage = (): UsePickImageReturn => {
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      setPicking(true);
      setError(null);
      const file = await UploadService.pickImageFile();
      setPicking(false);
      return file;
    } catch (err: any) {
      setError(err.message || 'Failed to pick image');
      setPicking(false);
      return null;
    }
  };

  return { picking, error, pickImage };
};
