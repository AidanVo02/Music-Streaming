// ─── API SERVICE ─────────────────────────────────────────────────────────────
const DEFAULT_API = 'http://192.168.1.101:5000';
export const API_BASE_URL = localStorage.getItem('api_url') || DEFAULT_API;

export async function apiCall(endpoint, method = 'GET', body = null, requireAuth = true) {
  const token = localStorage.getItem('auth_token');
  
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (requireAuth && token) {
    opts.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    opts.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api${endpoint}`, opts);
    
    // Handle 401 - session expired
    if (res.status === 401 && requireAuth) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login.html';
      throw new Error('Session expired');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ─── AUTH ENDPOINTS ──────────────────────────────────────────────────────────
export async function login(email, password) {
  return apiCall('/auth/login', 'POST', { email, password }, false);
}

export async function register(username, email, password) {
  return apiCall('/auth/register', 'POST', { username, email, password }, false);
}

export async function getMe() {
  return apiCall('/auth/me');
}

// ─── TRACKS ENDPOINTS ────────────────────────────────────────────────────────
export async function getAllTracks() {
  return apiCall('/tracks', 'GET', null, false);
}

export async function getTrackById(id) {
  return apiCall(`/tracks/${id}`, 'GET', null, false);
}

export async function getTopByGenre(limit = 8) {
  return apiCall(`/tracks/top-by-genre?limit=${limit}`, 'GET', null, false);
}

export async function getTracksByGenre(genre, limit = 10) {
  return apiCall(`/tracks/genre/${encodeURIComponent(genre)}?limit=${limit}`, 'GET', null, false);
}

export async function getAllGenres() {
  return apiCall('/tracks/genres', 'GET', null, false);
}

// ─── ARTISTS ENDPOINTS ───────────────────────────────────────────────────────
export async function getAllArtists() {
  return apiCall('/artists', 'GET', null, false);
}

export async function getArtistById(id) {
  return apiCall(`/artists/${id}`, 'GET', null, false);
}

export async function getTracksByArtist(artistId) {
  return apiCall(`/tracks/artist/${artistId}`, 'GET', null, false);
}

// ─── ARTIST APPLICATION ──────────────────────────────────────────────────────
export async function applyForArtist(data) {
  return apiCall('/artist-application/apply', 'POST', data);
}

export async function getApplicationStatus() {
  return apiCall('/artist-application/status');
}

// ─── ADMIN ENDPOINTS ─────────────────────────────────────────────────────────
export async function getStatistics() {
  return apiCall('/admin/statistics');
}

export async function getUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiCall(`/admin/users${query ? '?' + query : ''}`);
}

export async function getUserById(id) {
  return apiCall(`/admin/users/${id}`);
}

export async function updateUser(id, data) {
  return apiCall(`/admin/users/${id}`, 'PUT', data);
}

export async function deleteUser(id) {
  return apiCall(`/admin/users/${id}`, 'DELETE');
}

export async function banUser(id) {
  return apiCall(`/admin/users/${id}/ban`, 'PUT');
}

export async function unbanUser(id) {
  return apiCall(`/admin/users/${id}/unban`, 'PUT');
}

export async function getAdminTracks(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiCall(`/admin/tracks${query ? '?' + query : ''}`);
}

export async function getAdminTrackById(id) {
  return apiCall(`/admin/tracks/${id}`);
}

export async function updateTrack(id, data) {
  return apiCall(`/admin/tracks/${id}`, 'PUT', data);
}

export async function deleteTrack(id) {
  return apiCall(`/admin/tracks/${id}`, 'DELETE');
}

export async function getApplications(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiCall(`/admin/applications${query ? '?' + query : ''}`);
}

export async function approveApplication(id) {
  return apiCall(`/admin/applications/${id}/approve`, 'PUT');
}

export async function rejectApplication(id) {
  return apiCall(`/admin/applications/${id}/reject`, 'PUT');
}

export async function getRecentActivity(limit = 10) {
  return apiCall(`/admin/activity?limit=${limit}`);
}
