// API Service - Central place to handle all backend API calls
import { MOCK_ARTISTS } from '@/src/utils/mockData';
import { API_BASE_URL } from './apiConfig';

const REQUEST_TIMEOUT = 10000; // 10 seconds
const USE_MOCK_DATA = false; // Set to true to use mock data when backend fails

class ApiService {
  // Generic request method
  static async request(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log('🌐 API Request:', { 
        method: options.method || 'GET', 
        url,
        timestamp: new Date().toISOString()
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}`
        }));
        console.error('❌ API Error:', { 
          endpoint, 
          status: response.status, 
          error 
        });
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Success:', { 
        endpoint, 
        status: response.status,
        dataCount: Array.isArray(data.data) ? data.data.length : 1
      });
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('⏱️ API Timeout:', { endpoint, timeout: REQUEST_TIMEOUT });
        throw new Error(`Request timeout (${REQUEST_TIMEOUT}ms)`);
      }
      console.error('❌ API Request Failed:', { 
        endpoint, 
        error: error.message,
        url: `${API_BASE_URL}${endpoint}`
      });
      throw error;
    }
  }

  // ========== AUTH ENDPOINTS ==========

  static async register(data: { username: string; email: string; password: string }) {
    return this.request('/api/auth/register', { method: 'POST', body: data });
  }

  static async login(data: { email: string; password: string }) {
    return this.request('/api/auth/login', { method: 'POST', body: data });
  }

  static async getMe(token: string) {
    return this.request('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  static async updateProfile(formData: FormData, token: string) {
    // Because we use FormData, we don't set Content-Type header manually
    // fetch will set it automatically with the correct boundary
    try {
      const url = `${API_BASE_URL}/api/auth/profile`;
      console.log('🌐 API Request (Multipart):', { url });

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('❌ API Request Failed:', error.message);
      throw error;
    }
  }

  // ========== ARTISTS ENDPOINTS ==========

  // Lấy tất cả artists
  static async getAllArtists() {
    try {
      return await this.request('/api/artists');
    } catch (error) {
      console.warn('⚠️ Failed to fetch from API, using mock data');
      if (USE_MOCK_DATA) {
        return {
          success: true,
          data: MOCK_ARTISTS,
          count: MOCK_ARTISTS.length,
          isMock: true
        };
      }
      throw error;
    }
  }

  // Lấy artist theo ID
  static async getArtistById(id) {
    return this.request(`/api/artists/${id}`);
  }

  // Tạo artist mới
  static async createArtist(artistData) {
    return this.request('/api/artists', {
      method: 'POST',
      body: artistData,
    });
  }

  // Cập nhật artist
  static async updateArtist(id, artistData) {
    return this.request(`/api/artists/${id}`, {
      method: 'PUT',
      body: artistData,
    });
  }

  // Xóa artist
  static async deleteArtist(id) {
    return this.request(`/api/artists/${id}`, {
      method: 'DELETE',
    });
  }

  // Tìm artist theo tên
  static async searchArtists(searchTerm) {
    return this.request(`/api/artists/search?q=${encodeURIComponent(searchTerm)}`);
  }

  // ========== TRACKS ENDPOINTS ==========

  // Lấy tracks theo artist ID
  static async getTracksByArtist(artistId: number | string) {
    return this.request(`/api/tracks/artist/${artistId}`);
  }

  // Lấy tất cả tracks
  static async getAllTracks() {
    return this.request('/api/tracks');
  }

  // Lấy track theo ID
  static async getTrackById(id: number | string) {
    return this.request(`/api/tracks/${id}`);
  }

  // Lấy top tracks theo genre
  static async getTopByGenre(limit = 5) {
    return this.request(`/api/tracks/top-by-genre?limit=${limit}`);
  }

  // Lấy tracks theo genre cụ thể
  static async getTracksByGenre(genre: string, limit = 10) {
    return this.request(`/api/tracks/genre/${encodeURIComponent(genre)}?limit=${limit}`);
  }

  // Lấy tất cả genres
  static async getAllGenres() {
    return this.request('/api/tracks/genres');
  }

  // Tìm tracks theo tên/tựa đề
  static async searchTracks(searchTerm: string) {
    return this.request(`/api/tracks/search?q=${encodeURIComponent(searchTerm)}`);
  }

  // ========== ARTIST APPLICATION ==========
  static async applyForArtist(data: { artist_name: string; bio?: string | null }, token?: string) {
    return this.request('/api/artist-application/apply', {
      method: 'POST',
      body: data,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  static async getApplicationStatus(token?: string) {
    return this.request('/api/artist-application/status', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  // ========== HEALTH CHECK ==========
  static async healthCheck() {
    return this.request('/');
  }

  // ========== PLAYLISTS ENDPOINTS ==========
  
  // Get my playlists
  static async getMyPlaylists(token: string) {
    return this.request('/api/playlists', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Get public playlists
  static async getPublicPlaylists(limit = 50, offset = 0) {
    return this.request(`/api/playlists/public?limit=${limit}&offset=${offset}`);
  }

  // Get playlist by ID
  static async getPlaylistById(playlistId: number | string) {
    return this.request(`/api/playlists/${playlistId}`);
  }

  // Get user playlists
  static async getUserPlaylists(userId: number | string) {
    return this.request(`/api/playlists/user/${userId}`);
  }

  // Create playlist
  static async createPlaylist(data: {
    name: string;
    description?: string;
    cover_image_url?: string;
    is_public?: boolean;
  }, token: string) {
    return this.request('/api/playlists', {
      method: 'POST',
      body: data,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Update playlist
  static async updatePlaylist(playlistId: number, data: {
    name?: string;
    description?: string;
    cover_image_url?: string;
    is_public?: boolean;
  }, token: string) {
    return this.request(`/api/playlists/${playlistId}`, {
      method: 'PUT',
      body: data,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Delete playlist
  static async deletePlaylist(playlistId: number, token: string) {
    return this.request(`/api/playlists/${playlistId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Add track to playlist
  static async addTrackToPlaylist(playlistId: number, trackId: number, token: string) {
    return this.request(`/api/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: { track_id: trackId },
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Remove track from playlist
  static async removeTrackFromPlaylist(playlistId: number, trackId: number, token: string) {
    return this.request(`/api/playlists/${playlistId}/tracks/${trackId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Search playlists
  static async searchPlaylists(query: string, limit = 20) {
    return this.request(`/api/playlists/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }
}

export default ApiService;
