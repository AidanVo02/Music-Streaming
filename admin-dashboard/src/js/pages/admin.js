import { requireAdmin, getUser, clearAuth } from '../auth.js';
import { getStatistics, getUsers, getUserById, updateUser, deleteUser, banUser, unbanUser, getAdminTracks, getAdminTrackById, updateTrack, deleteTrack, getApplications, approveApplication, rejectApplication, getRecentActivity, getAllGenres } from '../api.js';
import { showToast, openModal, closeModal, formatDate, formatDuration, formatPlays, escapeHtml, debounce, getTimeAgo } from '../utils.js';

if (!requireAdmin()) throw new Error('Not admin');

window.closeModal = closeModal;

// ─── INIT ─────────────────────────────────────────────────────────────────────
const adminUser = getUser();
document.getElementById('admin-name').textContent = adminUser?.username?.toUpperCase() || 'ADMIN';
document.getElementById('admin-user-info').textContent = adminUser?.email || '';
document.getElementById('admin-logout').addEventListener('click', () => { clearAuth(); window.location.href = '/index.html'; });

// Sidebar navigation
document.querySelectorAll('.sidebar-link[data-view]').forEach(link => {
  link.addEventListener('click', e => { e.preventDefault(); switchView(link.dataset.view); });
});

// Filters
document.getElementById('role-filter')?.addEventListener('change', loadUsers);
document.getElementById('user-search')?.addEventListener('input', debounce(loadUsers, 400));
document.getElementById('track-search')?.addEventListener('input', debounce(loadTracks, 400));
document.getElementById('genre-filter')?.addEventListener('change', loadTracks);
document.getElementById('status-filter')?.addEventListener('change', loadApplications);

function switchView(name) {
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  document.querySelector(`[data-view="${name}"]`)?.classList.add('active');
  document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
  document.getElementById(`${name}-view`)?.classList.add('active');
  const titles = { overview:'Overview', users:'User Management', tracks:'Track Management', applications:'Artist Applications', settings:'Settings' };
  document.getElementById('page-title').textContent = titles[name] || name;
  switch (name) {
    case 'overview':     loadOverview(); break;
    case 'users':        loadUsers(); break;
    case 'tracks':       loadTracks(); loadGenres(); break;
    case 'applications': loadApplications(); break;
    case 'settings':     loadSettings(); break;
  }
}

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
async function loadOverview() {
  try {
    const { data } = await getStatistics();
    if (data) {
      document.getElementById('stat-users').textContent   = (data.total_users||0).toLocaleString();
      document.getElementById('stat-tracks').textContent  = (data.total_tracks||0).toLocaleString();
      document.getElementById('stat-artists').textContent = (data.total_artists||0).toLocaleString();
      document.getElementById('stat-pending').textContent = (data.pending_applications||0).toLocaleString();
      const badge = document.getElementById('pending-badge');
      if (data.pending_applications > 0) { badge.textContent = data.pending_applications; badge.classList.remove('hidden'); }
      else badge.classList.add('hidden');
    }
  } catch {}

  const actEl = document.getElementById('activity-list');
  try {
    const { data } = await getRecentActivity(12);
    if (!data?.length) { actEl.innerHTML = '<p class="muted center" style="padding:2rem">No recent activity</p>'; return; }
    actEl.innerHTML = data.map(a => `
      <div style="display:flex;align-items:center;gap:1rem;padding:0.75rem 0;border-bottom:1px solid var(--border)">
        <span style="font-size:1.3rem">${a.activity_type==='user_registered'?'👤':'🎵'}</span>
        <div style="flex:1;font-size:0.9rem">
          ${a.activity_type==='user_registered'
            ? `New user: <strong>${escapeHtml(a.username)}</strong>`
            : `Track uploaded: <strong>"${escapeHtml(a.title)}"</strong> by ${escapeHtml(a.username||'Unknown')}`}
        </div>
        <span style="font-size:0.8rem;color:var(--text-muted)">${getTimeAgo(a.created_at)}</span>
      </div>`).join('');
  } catch { actEl.innerHTML = '<p class="muted center" style="padding:2rem;color:var(--error)">Failed to load activity</p>'; }
}

// ─── USERS ────────────────────────────────────────────────────────────────────
async function loadUsers() {
  const el = document.getElementById('users-table');
  el.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
  const role   = document.getElementById('role-filter').value;
  const search = document.getElementById('user-search').value;
  try {
    const params = { limit: 100 };
    if (role)   params.role   = role;
    if (search) params.search = search;
    const { data, total } = await getUsers(params);
    el.innerHTML = `
      <div style="padding:0.75rem 1rem;font-size:0.82rem;color:var(--text-muted);border-bottom:1px solid var(--border)">
        ${data.length} of ${total} users
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Artist Name</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
        <tbody>${!data.length ? `<tr class="empty-row"><td colspan="8">No users found</td></tr>` :
          data.map(u => `<tr>
            <td>${u.user_id}</td>
            <td><strong>${escapeHtml(u.username)}</strong></td>
            <td style="color:var(--text-muted)">${escapeHtml(u.email)}</td>
            <td><span class="badge badge-${u.role}">${u.role.toUpperCase()}</span></td>
            <td>${u.artist_name ? escapeHtml(u.artist_name) : '<span class="muted">—</span>'}</td>
            <td>${u.is_banned ? '<span class="badge" style="background:var(--error);color:#fff">Banned</span>' : u.is_verified ? '<span class="badge" style="background:var(--success);color:#fff">Verified</span>' : '<span class="muted">Active</span>'}</td>
            <td style="color:var(--text-muted)">${formatDate(u.created_at)}</td>
            <td style="display:flex;gap:0.4rem;flex-wrap:wrap">
              <button class="btn btn-primary btn-sm" onclick="editUser(${u.user_id})">Edit</button>
              ${u.is_banned
                ? `<button class="btn btn-success btn-sm" onclick="toggleBan(${u.user_id},false)">Unban</button>`
                : `<button class="btn btn-secondary btn-sm" onclick="toggleBan(${u.user_id},true)">Ban</button>`}
              ${u.role!=='admin' ? `<button class="btn btn-danger btn-sm" onclick="removeUser(${u.user_id},'${escapeHtml(u.username)}')">Del</button>` : ''}
            </td>
          </tr>`).join('')}
        </tbody>
      </table></div>`;
  } catch { el.innerHTML = '<p class="muted center" style="padding:2rem;color:var(--error)">Failed to load users</p>'; }
}

window.editUser = async function(id) {
  const { data: u } = await getUserById(id);
  openModal('Edit User', `
    <form id="edit-user-form">
      <div class="form-row">
        <div class="input-group"><label>Username</label><input class="input" name="username" value="${escapeHtml(u.username)}" required></div>
        <div class="input-group"><label>Email</label><input class="input" name="email" type="email" value="${escapeHtml(u.email)}" required></div>
      </div>
      <div class="form-row">
        <div class="input-group"><label>Role</label>
          <select class="input" name="role">
            <option value="user"   ${u.role==='user'  ?'selected':''}>User</option>
            <option value="artist" ${u.role==='artist'?'selected':''}>Artist</option>
            <option value="admin"  ${u.role==='admin' ?'selected':''}>Admin</option>
          </select></div>
        <div class="input-group"><label>Membership</label>
          <select class="input" name="membership_tier">
            <option value="free"    ${u.membership_tier==='free'   ?'selected':''}>Free</option>
            <option value="premium" ${u.membership_tier==='premium'?'selected':''}>Premium</option>
            <option value="pro"     ${u.membership_tier==='pro'    ?'selected':''}>Pro</option>
          </select></div>
      </div>
      <div class="input-group"><label>Artist Name</label><input class="input" name="artist_name" value="${escapeHtml(u.artist_name||'')}"></div>
      <div class="form-row" style="margin-top:0.5rem">
        <label class="checkbox-label"><input type="checkbox" name="is_verified" ${u.is_verified?'checked':''}> Verified</label>
        <label class="checkbox-label"><input type="checkbox" name="is_banned"   ${u.is_banned  ?'checked':''}> Banned</label>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1.5rem;justify-content:flex-end">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </div>
    </form>`);

  document.getElementById('edit-user-form').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const res = await updateUser(id, {
      username: fd.get('username'), email: fd.get('email'), role: fd.get('role'),
      artist_name: fd.get('artist_name') || null, membership_tier: fd.get('membership_tier'),
      is_verified: fd.get('is_verified')==='on', is_banned: fd.get('is_banned')==='on',
    });
    if (res.success) { showToast('User updated', 'success'); closeModal(); loadUsers(); }
    else showToast(res.message || 'Update failed', 'error');
  });
};

window.toggleBan = async function(id, ban) {
  if (!confirm(`${ban?'Ban':'Unban'} this user?`)) return;
  const res = ban ? await banUser(id) : await unbanUser(id);
  if (res.success) { showToast(res.message, 'success'); loadUsers(); loadOverview(); }
  else showToast(res.message || 'Failed', 'error');
};

window.removeUser = async function(id, name) {
  if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
  const res = await deleteUser(id);
  if (res.success) { showToast('User deleted', 'success'); loadUsers(); loadOverview(); }
  else showToast(res.message || 'Failed', 'error');
};

// ─── TRACKS ───────────────────────────────────────────────────────────────────
async function loadTracks() {
  const el = document.getElementById('tracks-table');
  el.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
  const genre  = document.getElementById('genre-filter').value;
  const search = document.getElementById('track-search').value;
  try {
    const params = { limit: 100 };
    if (genre)  params.genre  = genre;
    if (search) params.search = search;
    const { data, total } = await getAdminTracks(params);
    el.innerHTML = `
      <div style="padding:0.75rem 1rem;font-size:0.82rem;color:var(--text-muted);border-bottom:1px solid var(--border)">${data.length} of ${total} tracks</div>
      <div class="table-wrap"><table>
        <thead><tr><th>ID</th><th>Cover</th><th>Title</th><th>Artist</th><th>Genre</th><th>Plays</th><th>Duration</th><th>Actions</th></tr></thead>
        <tbody>${!data.length ? `<tr class="empty-row"><td colspan="8">No tracks found</td></tr>` :
          data.map(t => `<tr>
            <td>${t.track_id}</td>
            <td>${t.cover_image_url ? `<img class="track-thumb" src="${t.cover_image_url}" style="width:40px;height:40px;border-radius:4px;object-fit:cover">` : '<div style="width:40px;height:40px;background:var(--bg-hover);border-radius:4px;display:flex;align-items:center;justify-content:center">🎵</div>'}</td>
            <td><strong>${escapeHtml(t.title)}</strong></td>
            <td style="color:var(--text-muted)">${escapeHtml(t.originator||t.artist_name||'Unknown')}</td>
            <td>${t.genre?`<span class="badge badge-orange">${t.genre}</span>`:'<span class="muted">—</span>'}</td>
            <td>${formatPlays(t.play_count)}</td>
            <td>${formatDuration(t.duration)}</td>
            <td style="display:flex;gap:0.4rem">
              <button class="btn btn-primary btn-sm" onclick="editTrack(${t.track_id})">Edit</button>
              <button class="btn btn-danger btn-sm"  onclick="removeTrack(${t.track_id},'${escapeHtml(t.title)}')">Del</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table></div>`;
  } catch { el.innerHTML = '<p class="muted center" style="padding:2rem;color:var(--error)">Failed to load tracks</p>'; }
}

async function loadGenres() {
  try {
    const { data } = await getAllGenres();
    const el = document.getElementById('genre-filter');
    el.innerHTML = '<option value="">All Genres</option>' + (data||[]).map(g=>`<option value="${g.genre}">${g.genre}</option>`).join('');
  } catch {}
}

window.editTrack = async function(id) {
  const { data: t } = await getAdminTrackById(id);
  openModal('Edit Track', `
    <form id="edit-track-form">
      <div class="input-group"><label>Title</label><input class="input" name="title" value="${escapeHtml(t.title)}" required></div>
      <div class="form-row">
        <div class="input-group"><label>Artist / Originator</label><input class="input" name="originator" value="${escapeHtml(t.originator||'')}"></div>
        <div class="input-group"><label>Genre</label><input class="input" name="genre" value="${escapeHtml(t.genre||'')}"></div>
      </div>
      <div class="input-group"><label>Play Count</label><input class="input" name="play_count" type="number" min="0" value="${t.play_count||0}"></div>
      <div class="input-group"><label>Lyrics</label><textarea class="input" name="lyrics" rows="4">${escapeHtml(t.lyrics||'')}</textarea></div>
      <div style="display:flex;gap:0.75rem;margin-top:1.5rem;justify-content:flex-end">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </div>
    </form>`);

  document.getElementById('edit-track-form').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const res = await updateTrack(id, { title: fd.get('title'), originator: fd.get('originator')||null, genre: fd.get('genre')||null, play_count: parseInt(fd.get('play_count'))||0, lyrics: fd.get('lyrics')||null });
    if (res.success) { showToast('Track updated', 'success'); closeModal(); loadTracks(); loadOverview(); }
    else showToast(res.message||'Failed', 'error');
  });
};

window.removeTrack = async function(id, title) {
  if (!confirm(`Delete "${title}"?`)) return;
  const res = await deleteTrack(id);
  if (res.success) { showToast('Track deleted', 'success'); loadTracks(); loadOverview(); }
  else showToast(res.message||'Failed', 'error');
};

// ─── APPLICATIONS ─────────────────────────────────────────────────────────────
async function loadApplications() {
  const el = document.getElementById('applications-table');
  el.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
  const status = document.getElementById('status-filter').value;
  try {
    const params = {};
    if (status) params.status = status;
    const { data } = await getApplications(params);
    const apps = data || [];
    el.innerHTML = `
      <div style="padding:0.75rem 1rem;font-size:0.82rem;color:var(--text-muted);border-bottom:1px solid var(--border)">${apps.length} application${apps.length!==1?'s':''}</div>
      <div class="table-wrap"><table>
        <thead><tr><th>ID</th><th>User</th><th>Email</th><th>Artist Name</th><th>Bio</th><th>Status</th><th>Submitted</th><th>Actions</th></tr></thead>
        <tbody>${!apps.length ? `<tr class="empty-row"><td colspan="8">No applications found</td></tr>` :
          apps.map(a => `<tr>
            <td>${a.request_id}</td>
            <td><strong>${escapeHtml(a.username)}</strong></td>
            <td style="color:var(--text-muted)">${escapeHtml(a.email)}</td>
            <td>${a.artist_name?escapeHtml(a.artist_name):'<span class="muted">—</span>'}</td>
            <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-muted)">${a.note?escapeHtml(a.note.substring(0,60)):'—'}</td>
            <td><span class="badge badge-${a.status}">${a.status.toUpperCase()}</span></td>
            <td style="color:var(--text-muted)">${formatDate(a.created_at)}</td>
            <td style="display:flex;gap:0.4rem">
              ${a.status==='pending' ? `
                <button class="btn btn-success btn-sm" onclick="approveApp(${a.request_id})">Approve</button>
                <button class="btn btn-danger btn-sm"  onclick="rejectApp(${a.request_id})">Reject</button>
              ` : '<span class="muted">—</span>'}
            </td>
          </tr>`).join('')}
        </tbody>
      </table></div>`;
  } catch { el.innerHTML = '<p class="muted center" style="padding:2rem;color:var(--error)">Failed to load applications</p>'; }
}

window.approveApp = async function(id) {
  if (!confirm('Approve this application?')) return;
  const res = await approveApplication(id);
  if (res.success) { showToast('Approved! User is now an artist.', 'success'); loadApplications(); loadOverview(); }
  else showToast(res.message||'Failed', 'error');
};

window.rejectApp = async function(id) {
  if (!confirm('Reject this application?')) return;
  const res = await rejectApplication(id);
  if (res.success) { showToast('Application rejected.', 'success'); loadApplications(); }
  else showToast(res.message||'Failed', 'error');
};

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function loadSettings() {
  document.getElementById('api-endpoint').value = localStorage.getItem('api_url') || 'http://192.168.1.101:5000';
}

window.saveSettings = function() {
  const val = document.getElementById('api-endpoint').value.trim();
  if (!val) { showToast('URL cannot be empty', 'error'); return; }
  localStorage.setItem('api_url', val);
  showToast('Settings saved', 'success');
};

window.resetSettings = function() {
  localStorage.removeItem('api_url');
  document.getElementById('api-endpoint').value = 'http://192.168.1.101:5000';
  showToast('Reset to default', 'success');
};

// ─── START ────────────────────────────────────────────────────────────────────
loadOverview();
