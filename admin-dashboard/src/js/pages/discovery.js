import { renderNavbar } from '../navbar.js';
import { getAllGenres, getTopByGenre, getTracksByGenre } from '../api.js';
import { formatPlays, formatDuration, escapeHtml, setLoading } from '../utils.js';

renderNavbar('discovery');

const filterEl = document.getElementById('genre-filter');
const listEl   = document.getElementById('tracks-container');
let activeGenre = new URLSearchParams(location.search).get('genre') || '';

async function loadGenres() {
  try {
    const { data } = await getAllGenres();
    (data || []).forEach(g => {
      const btn = document.createElement('button');
      btn.className = 'genre-chip' + (activeGenre === g.genre ? ' active' : '');
      btn.dataset.genre = g.genre;
      btn.textContent = g.genre;
      filterEl.appendChild(btn);
    });
  } catch {}
}

async function loadTracks(genre = '') {
  setLoading(listEl, true, 'Loading signals...');
  try {
    const res = genre
      ? await getTracksByGenre(genre, 20)
      : await getTopByGenre(20);
    const tracks = res.data || [];

    if (!tracks.length) {
      listEl.innerHTML = '<p class="muted center" style="padding:3rem">No tracks found</p>';
      return;
    }

    listEl.innerHTML = tracks.map((t, i) => `
      <div class="track-card">
        <span class="track-num">${i + 1}</span>
        ${t.cover_image_url
          ? `<img class="track-thumb" src="${t.cover_image_url}" alt="${escapeHtml(t.title)}">`
          : `<div class="track-thumb-placeholder">🎵</div>`}
        <div class="track-info">
          <div class="track-title">${escapeHtml(t.title)}</div>
          <div class="track-artist">${escapeHtml(t.originator || 'Unknown')}</div>
        </div>
        <div class="track-meta">
          ${t.genre ? `<span class="badge badge-orange" style="font-size:0.7rem">${t.genre}</span>` : ''}
          <span>▶ ${formatPlays(t.play_count)}</span>
          <span>${formatDuration(t.duration)}</span>
        </div>
      </div>`).join('');
  } catch {
    listEl.innerHTML = '<p class="muted center" style="padding:3rem;color:var(--error)">Failed to load tracks</p>';
  }
}

// Genre chip click
filterEl.addEventListener('click', e => {
  const chip = e.target.closest('.genre-chip');
  if (!chip) return;
  filterEl.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  activeGenre = chip.dataset.genre;
  loadTracks(activeGenre);
});

loadGenres();
loadTracks(activeGenre);
