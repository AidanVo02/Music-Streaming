import { renderNavbar } from '../navbar.js';
import { getAllArtists, getAllTracks } from '../api.js';
import { formatPlays, formatDuration, escapeHtml, setLoading } from '../utils.js';

renderNavbar('library');

const tabs = document.querySelectorAll('.lib-tab');
const artistsPanel = document.getElementById('artists-panel');
const tracksPanel  = document.getElementById('tracks-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const which = tab.dataset.tab;
    artistsPanel.classList.toggle('active', which === 'artists');
    tracksPanel.classList.toggle('active',  which === 'tracks');
    if (which === 'tracks' && !tracksPanel.dataset.loaded) loadTracks();
  });
});

async function loadArtists() {
  setLoading(artistsPanel, true, 'Loading artists...');
  try {
    const { data } = await getAllArtists();
    if (!data?.length) { artistsPanel.innerHTML = '<p class="muted center" style="padding:3rem">No artists yet</p>'; return; }
    artistsPanel.innerHTML = `<div class="artists-grid">${
      data.map(a => `
        <div class="artist-card card card-hover">
          ${a.image_url
            ? `<img class="artist-img" src="${a.image_url}" alt="${escapeHtml(a.name)}">`
            : `<div class="artist-img-placeholder">${a.name[0].toUpperCase()}</div>`}
          <div class="artist-name">${escapeHtml(a.name)}</div>
          ${a.bio ? `<div class="artist-bio">${escapeHtml(a.bio.substring(0,80))}${a.bio.length>80?'…':''}</div>` : ''}
        </div>`).join('')
    }</div>`;
  } catch { artistsPanel.innerHTML = '<p class="muted center" style="padding:3rem;color:var(--error)">Failed to load artists</p>'; }
}

async function loadTracks() {
  setLoading(tracksPanel, true, 'Loading tracks...');
  tracksPanel.dataset.loaded = '1';
  try {
    const { data } = await getAllTracks();
    if (!data?.length) { tracksPanel.innerHTML = '<p class="muted center" style="padding:3rem">No tracks yet</p>'; return; }
    tracksPanel.innerHTML = data.map((t, i) => `
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
  } catch { tracksPanel.innerHTML = '<p class="muted center" style="padding:3rem;color:var(--error)">Failed to load tracks</p>'; }
}

loadArtists();
