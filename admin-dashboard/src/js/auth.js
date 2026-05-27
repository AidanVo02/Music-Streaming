// ─── AUTH STATE ──────────────────────────────────────────────────────────────
export function getToken()   { return localStorage.getItem('auth_token'); }
export function getUser()    { const u = localStorage.getItem('auth_user'); return u ? JSON.parse(u) : null; }
export function isLoggedIn() { return !!getToken() && !!getUser(); }
export function isAdmin()    { return getUser()?.role === 'admin'; }
export function isArtist()   { return ['artist', 'admin'].includes(getUser()?.role); }

export function saveAuth(user, token) {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

// Refresh user data from server
export async function refreshUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const API_BASE_URL = localStorage.getItem('api_url') || 'http://192.168.1.101:5000';
    const res  = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data?.success && data?.data) {
      localStorage.setItem('auth_user', JSON.stringify(data.data));
      return data.data;
    }
  } catch {}
  return null;
}

// ─── NAVBAR HELPERS ──────────────────────────────────────────────────────────
export function updateNavbarAuth() {
  const user = getUser();
  const loginBtn  = document.getElementById('nav-login-btn');
  const userMenu  = document.getElementById('nav-user-menu');
  const userLabel = document.getElementById('nav-username');
  const adminLink = document.getElementById('nav-admin-link');

  if (user) {
    loginBtn?.classList.add('hidden');
    userMenu?.classList.remove('hidden');
    if (userLabel) userLabel.textContent = user.username?.toUpperCase();
    if (adminLink) {
      user.role === 'admin'
        ? adminLink.classList.remove('hidden')
        : adminLink.classList.add('hidden');
    }
  } else {
    loginBtn?.classList.remove('hidden');
    userMenu?.classList.add('hidden');
    adminLink?.classList.add('hidden');
  }
}

export function requireAuth(redirectTo = '/login.html') {
  if (!isLoggedIn()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

export function requireAdmin(redirectTo = '/index.html') {
  if (!isLoggedIn() || !isAdmin()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}
