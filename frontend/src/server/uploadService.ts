import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

import { API_BASE_URL } from './apiConfig';

interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    track_id: number;
    title: string;
    originator: string;
    audio_url: string;
    duration: number;
  };
  error?: string;
}

interface PickedAudioFile {
  file?: File;
  uri?: string;
  name: string;
  size?: number;
  type?: string;
}

const isWebFile = (audioFile: PickedAudioFile): audioFile is PickedAudioFile & { file: File } =>
  typeof File !== 'undefined' && audioFile.file instanceof File;

const parseJsonSafely = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

class UploadService {
  static async pickImageFile(): Promise<{ file?: File; uri?: string; name: string; type: string } | null> {
    // Web platform: use browser file picker
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = () => {
          const selectedFile = input.files?.[0];
          if (!selectedFile) {
            resolve(null);
            return;
          }
          const uri = URL.createObjectURL(selectedFile);
          resolve({
            file: selectedFile,
            uri,
            name: selectedFile.name,
            type: selectedFile.type || 'image/jpeg',
          });
        };

        input.click();
      });
    }

    // Mobile platform: use expo-document-picker
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        name: asset.name,
        type: asset.mimeType || 'image/jpeg',
      };
    } catch (error) {
      console.error('Error picking image:', error);
      return null;
    }
  }

  static async pickAudioFile(): Promise<PickedAudioFile | null> {
    // Web platform: use browser file picker
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';

        input.onchange = () => {
          const selectedFile = input.files?.[0];

          if (!selectedFile) {
            resolve(null);
            return;
          }

          resolve({
            file: selectedFile,
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type || 'audio/mpeg',
          });
        };

        input.click();
      });
    }

    // Mobile platform: use expo-document-picker
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        name: asset.name,
        size: asset.size,
        type: asset.mimeType || 'audio/mpeg',
      };
    } catch (error) {
      console.error('Error picking audio file:', error);
      return null;
    }
  }

  static async uploadTrack(
    audioFile: PickedAudioFile,
    title: string,
    originator: string,
    genre = 'Electronic',
    duration = 180,
    token?: string
  ): Promise<UploadResponse> {
    const formData = new FormData();

    if (isWebFile(audioFile)) {
      formData.append('audio', audioFile.file, audioFile.name);
    } else if (audioFile.uri) {
      formData.append('audio', {
        uri: audioFile.uri,
        type: audioFile.type || 'audio/mpeg',
        name: audioFile.name,
      } as never);
    } else {
      throw new Error('Invalid audio file payload');
    }

    formData.append('title', title);
    formData.append('originator', originator);
    formData.append('genre', genre);
    formData.append('duration', duration.toString());

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/tracks/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await parseJsonSafely(response);

    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    return data as UploadResponse;
  }

  static async getAllTracks(limit = 50, offset = 0) {
    const response = await fetch(`${API_BASE_URL}/api/tracks?limit=${limit}&offset=${offset}`);
    const data = await parseJsonSafely(response);

    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    return data;
  }

  static async getTrackById(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/tracks/${id}`);
    const data = await parseJsonSafely(response);

    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    return data;
  }

  static async playTrack(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/tracks/${id}/play`, {
      method: 'POST',
    });
    const data = await parseJsonSafely(response);

    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    return data;
  }

  static async deleteTrack(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/tracks/${id}`, {
      method: 'DELETE',
    });
    const data = await parseJsonSafely(response);

    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    return data;
  }

  static async searchTracks(query: string) {
    const response = await fetch(
      `${API_BASE_URL}/api/tracks/search?q=${encodeURIComponent(query)}`
    );
    const data = await parseJsonSafely(response);

    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    return data;
  }
}

export default UploadService;
