import { renderNavbar } from '../navbar.js';
import { getMe, applyForArtist, getApplicationStatus } from '../api.js';
import { getUser, getToken, isLoggedIn, clearAuth, refreshUser } from '../auth.js';
import { showToast, escapeHtml } from '../utils.js';

renderNavbar('profile');

if (!isLoggedIn()) { window.location.href = '/login.html'; }

const el = document.getElementById('profile-content');

async function loadProfile() {
  const user = await refreshUser() || getUser();
  if (!user) { window.location.href = '/login.html'; return; }

  let appStatus = 'none';
  if (user.role === 'user') {
    try {
      const res = await getApplicationStatus();
      if (res?.data?.status) appStatus = res.data.status;
    } catch {}
  }

  const isArtist = ['artist', 'admin'].includes(user.role);

  el.innerHTML = `
    <!-- Profile Header -->
    <div class="profile-header card">
      <div class="profile-avatar">${(user.username?.[0] || 'U').toUpperCase()}</div>
      <div class="profile-info">
        <h2>${escapeHtml(user.username?.toUpperCase())}</h2>
        <span class="badge badge-${user.role}">${user.role === 'artist' ? 'CERTIFIED ARTIST' : user.role.toUpperCase()}</span>
        ${user.artist_name ? `<p class="muted" style="margin-top:0.4rem">${escapeHtml(user.artist_name)}</p>` : ''}
      </div>
      <button class="btn btn-danger btn-sm" id="logout-btn" style="margin-left:auto">Logout</button>
    </div>

    <!-- Stats -->
    <div class="stats-grid" style="margin-top:1.5rem">
      ${isArtist ? `
        <div class="stat-card"><div class="stat-icon">🎵</div><div><div class="stat-value">${user.published_tracks_count || 0}</div><div class="stat-label">Published Tracks</div></div></div>
        <div class="stat-card"><div class="stat-icon">▶</div><div><div class="stat-value">${fmtNum(user.total_plays_count)}</div><div class="stat-label">Total Plays</div></div></div>
        <div class="stat-card"><div class="stat-icon">💾</div><div><div class="stat-value">${parseFloat(user.storage_used_gb||0).toFixed(1)} GB</div><div class="stat-label">Storage Used</div></div></div>
      ` : `
        <div class="stat-card"><div class="stat-icon">⏱</div><div><div class="stat-value">${parseFloat(user.listening_time_hours||0).toFixed(1)}h</div><div class="stat-label">Listening Time</div></div></div>
        <div class="stat-card"><div class="stat-icon">❤️</div><div><div class="stat-value">${user.liked_songs_count || 0}</div><div class="stat-label">Liked Songs</div></div></div>
        <div class="stat-card"><div class="stat-icon">🔥</div><div><div class="stat-value">${user.discovery_streak_days || 0}d</div><div class="stat-label">Discovery Streak</div></div></div>
      `}
    </div>

    <!-- CTA Section -->
    <div style="margin-top:1.5rem">
      ${isArtist ? `
        <div class="card" style="display:flex;align-items:center;gap:1rem">
          <span style="font-size:2rem">🎙</span>
          <div>
            <div style="font-weight:700;letter-spacing:1px">ARTIST STUDIO</div>
            <div class="muted" style="font-size:0.85rem">Upload tracks, view analytics</div>
          </div>
          <a href="/upload.html" class="btn btn-primary btn-sm" style="margin-left:auto">Upload Track</a>
        </div>
      ` : appStatus === 'pending' ? `
        <div class="card" style="border-color:var(--warning);background:#1a1400">
          <div style="display:flex;align-items:center;gap:1rem">
            <span style="font-size:2rem">⏳</span>
            <div>
              <div style="font-weight:700;color:var(--warning);letter-spacing:1px">APPLICATION PENDING</div>
              <div class="muted" style="font-size:0.85rem">Your artist application is under review</div>
            </div>
          </div>
        </div>
      ` : appStatus === 'rejected' ? `
        <div class="card" style="border-color:var(--error);background:#1a0a0a;cursor:pointer" onclick="openApplyModal()">
          <div style="display:flex;align-items:center;gap:1rem">
            <span style="font-size:2rem">❌</span>
            <div style="flex:1">
              <div style="font-weight:700;color:var(--error);letter-spacing:1px">APPLICATION REJECTED</div>
              <div class="muted" style="font-size:0.85rem">Click to apply again</div>
            </div>
            <span style="color:var(--error)">→</span>
          </div>
        </div>
      ` : `
        <div class="card" style="border-color:var(--orange);cursor:pointer" onclick="openApplyModal()">
          <div style="display:flex;align-items:center;gap:1rem">
            <span style="font-size:2rem">📡</span>
            <div style="flex:1">
              <div style="font-weight:700;color:var(--orange);letter-spacing:1px">READY TO BROADCAST?</div>
              <div class="muted" style="font-size:0.85rem">Apply for Artist Role and start uploading</div>
            </div>
            <span style="color:var(--orange)">→</span>
          </div>
        </div>
      `}
    </div>
  `;

  document.getElementById('logout-btn').addEventListener('click', () => {
    clearAuth();
    window.location.href = '/index.html';
  });
}

window.openApplyModal = function() {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <div class="modal-header"><h3>APPLY FOR ARTIST ROLE</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div class="input-group">
        <label>ARTIST NAME / STAGE NAME *</label>
        <input class="input" id="apply-name" placeholder="Your artist name" maxlength="50">
      </div>
      <div class="input-group">
        <label>BIO (OPTIONAL)</label>
        <textarea class="input" id="apply-bio" placeholder="Tell us about your music..." rows="3" maxlength="500"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" id="apply-submit-btn" onclick="submitApplication()">SUBMIT APPLICATION</button>
    </div>`;
  overlay.classList.add('active');
};

window.submitApplication = async function() {
  const name = document.getElementById('apply-name').value.trim();
  const bio  = document.getElementById('apply-bio').value.trim();
  if (!name || name.length < 3) { showToast('Artist name must be at least 3 characters', 'error'); return; }

  const btn = document.getElementById('apply-submit-btn');
  btn.disabled = true; btn.textContent = 'Submitting...';

  try {
    const res = await applyForArtist({ artist_name: name, bio: bio || null });
    if (res.success) {
      showToast('Application submitted! Waiting for admin review.', 'success');
      document.getElementById('modal-overlay').classList.remove('active');
      loadProfile();
    } else {
      showToast(res.message || 'Failed to submit', 'error');
    }
  } catch { showToast('Connection error', 'error'); }
  finally { btn.disabled = false; btn.textContent = 'SUBMIT APPLICATION'; }
};

window.closeModal = function() {
  document.getElementById('modal-overlay').classList.remove('active');
};

function fmtNum(n) {
  if (!n) return '0';
  if (n >= 1000000) return (n/1000000).toFixed(1)+'M';
  if (n >= 1000)    return (n/1000).toFixed(1)+'K';
  return String(n);
}

loadProfile();
