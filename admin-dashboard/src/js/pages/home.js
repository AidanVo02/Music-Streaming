import { renderNavbar } from '../navbar.js';
import { getTopByGenre, getAllGenres, getAllArtists } from '../api.js';
import { formatPlays, formatDuration, escapeHtml } from '../utils.js';

renderNavbar('home');

async function loadTopTracks() {
  const el = document.getElementById('top-tracks');
  try {
    const { data } = await getTopByGenre(8);
    if (!data?.length) { el.innerHTML = '<p class="muted center">No tracks yet</p>'; return; }
    el.innerHTML = data.map(t => `
      <div class="track-card" onclick="window.location.href='/discovery.html'">
        ${t.cover_image_url
          ? `<img class="track-thumb" src="${t.cover_image_url}" alt="${escapeHtml(t.title)}">`
          : `<div class="track-thumb-placeholder">🎵</div>`}
        <div class="track-info">
          <div class="track-title">${escapeHtml(t.title)}</div>
          <div class="track-artist">${escapeHtml(t.originator || 'Unknown')}</div>
        </div>
        <div class="track-meta">
          <span>${t.genre ? `<span class="badge badge-orange" style="font-size:0.7rem">${t.genre}</span>` : ''}</span>
          <span>▶ ${formatPlays(t.play_count)}</span>
          <span>${formatDuration(t.duration)}</span>
        </div>
      </div>`).join('');
  } catch { el.innerHTML = '<p class="muted center">Failed to load tracks</p>'; }
}

async function loadGenres() {
  const el = document.getElementById('genre-chips');
  try {
    const { data } = await getAllGenres();
    if (!data?.length) { el.innerHTML = ''; return; }
    el.innerHTML = data.map(g => `
      <a href="/discovery.html?genre=${encodeURIComponent(g.genre)}" class="genre-chip">
        ${g.genre} <span class="muted">${g.track_count}</span>
      </a>`).join('');
  } catch { el.innerHTML = ''; }
}

async function loadArtists() {
  const el = document.getElementById('artists-grid');
  try {
    const { data } = await getAllArtists();
    if (!data?.length) { el.innerHTML = '<p class="muted center">No artists yet</p>'; return; }
    el.innerHTML = data.slice(0, 8).map(a => `
      <div class="artist-card" onclick="window.location.href='/library.html'">
        ${a.image_url
          ? `<img class="artist-img" src="${a.image_url}" alt="${escapeHtml(a.name)}">`
          : `<div class="artist-img-placeholder">${a.name[0].toUpperCase()}</div>`}
        <div class="artist-name">${escapeHtml(a.name)}</div>
      </div>`).join('');
  } catch { el.innerHTML = '<p class="muted center">Failed to load artists</p>'; }
}

loadTopTracks();
loadGenres();
loadArtists();
