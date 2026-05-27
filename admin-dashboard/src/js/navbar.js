import { getUser, isLoggedIn, isAdmin, clearAuth } from './auth.js';

const LINKS = [
  { href: '/index.html',     label: 'Home',      key: 'home' },
  { href: '/discovery.html', label: 'Discovery', key: 'discovery' },
  { href: '/library.html',   label: 'Library',   key: 'library' },
];

export function renderNavbar(activePage = '') {
  const user = getUser();

  const navHTML = `
    <nav class="navbar">
      <div class="navbar-inner">
        <a href="/index.html" class="navbar-logo">
          <svg width="28" height="28" viewBox="0 0 60 60" fill="none">
            <rect width="60" height="60" rx="12" fill="#ff8000"/>
            <path d="M20 30L30 20L40 30L30 40L20 30Z" fill="#000"/>
          </svg>
          SIGNAL ONYX
        </a>

        <div class="navbar-links">
          ${LINKS.map(l => `
            <a href="${l.href}" class="navbar-link ${activePage === l.key ? 'active' : ''}">${l.label}</a>
          `).join('')}
          ${isAdmin() ? `<a href="/admin/index.html" class="navbar-link ${activePage === 'admin' ? 'active' : ''}" style="color:var(--orange)">Admin</a>` : ''}
        </div>

        <div class="navbar-actions">
          ${isLoggedIn() ? `
            <a href="/profile.html" class="navbar-avatar" title="${user?.username}">
              ${(user?.username?.[0] || 'U').toUpperCase()}
            </a>
            <button class="btn btn-secondary btn-sm" id="navbar-logout">Logout</button>
          ` : `
            <a href="/login.html" class="btn btn-secondary btn-sm">Login</a>
            <a href="/register.html" class="btn btn-primary btn-sm">Sign Up</a>
          `}
        </div>
      </div>
    </nav>
  `;

  // Inject into body
  const existing = document.querySelector('.navbar');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // Logout handler
  document.getElementById('navbar-logout')?.addEventListener('click', () => {
    clearAuth();
    window.location.href = '/index.html';
  });
}
