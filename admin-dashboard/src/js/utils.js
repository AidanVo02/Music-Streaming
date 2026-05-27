// ─── TOAST ───────────────────────────────────────────────────────────────────
export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '💬'}</span><span class="toast-msg">${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
export function openModal(title, bodyHTML, footerHTML = '') {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  if (!overlay || !content) return;

  content.innerHTML = `
    <div class="modal-header">
      <h3>${title}</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">${bodyHTML}</div>
    ${footerHTML ? `<div class="modal-footer">${footerHTML}</div>` : ''}
  `;
  overlay.classList.add('active');
}

export function closeModal() {
  document.getElementById('modal-overlay')?.classList.remove('active');
}
window.closeModal = closeModal;

// ─── FORMAT HELPERS ──────────────────────────────────────────────────────────
export function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDuration(sec) {
  if (!sec) return '—';
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatPlays(n) {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

export function getTimeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  for (const [u, v] of Object.entries({ year:31536000, month:2592000, week:604800, day:86400, hour:3600, minute:60 })) {
    const n = Math.floor(s / v);
    if (n >= 1) return `${n} ${u}${n > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

export function debounce(fn, wait) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

// ─── LOADING STATE ───────────────────────────────────────────────────────────
export function setLoading(el, loading, text = '') {
  if (loading) {
    el.innerHTML = `<div class="loading-state"><div class="spinner"></div>${text ? `<p>${text}</p>` : ''}</div>`;
  }
}

export function setError(el, message) {
  el.innerHTML = `<div class="loading-state" style="color:var(--error)">❌ ${message}</div>`;
}
