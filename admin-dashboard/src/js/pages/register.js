import { register } from '../api.js';
import { saveAuth, isLoggedIn } from '../auth.js';

if (isLoggedIn()) window.location.href = '/index.html';

const form     = document.getElementById('register-form');
const errorEl  = document.getElementById('register-error');
const btn      = document.getElementById('register-btn');
const pwInput  = document.getElementById('password');
const togglePw = document.getElementById('toggle-pw');
const fill     = document.getElementById('strength-fill');
const label    = document.getElementById('strength-label');

togglePw.addEventListener('click', () => {
  pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
  togglePw.textContent = pwInput.type === 'password' ? '👁' : '🙈';
});

pwInput.addEventListener('input', () => {
  const p = pwInput.value;
  let score = 0;
  if (p.length >= 8)          score += 40;
  if (/[A-Z]/.test(p))        score += 20;
  if (/[0-9]/.test(p))        score += 20;
  if (/[^A-Za-z0-9]/.test(p)) score += 20;

  fill.style.width = score + '%';
  fill.style.background = score < 40 ? 'var(--error)' : score < 80 ? 'var(--orange)' : 'var(--success)';
  label.textContent = !p ? 'PENDING INITIALIZATION' : score < 40 ? 'WEAK' : score < 80 ? 'MODERATE' : 'STRONG';
  label.style.color = fill.style.background;
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  errorEl.classList.add('hidden');

  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = pwInput.value;

  if (password.length < 6) { showError('Password must be at least 6 characters'); return; }

  btn.disabled = true;
  btn.textContent = 'INITIALIZING...';

  try {
    const data = await register(username, email, password);
    if (data.success && data.data) {
      saveAuth(data.data, data.data.token);
      window.location.href = '/index.html';
    } else {
      showError(data.message || 'Registration failed');
    }
  } catch {
    showError('Connection error. Is the server running?');
  } finally {
    btn.disabled = false;
    btn.textContent = 'JOIN THE STUDIO →';
  }
});

function showError(msg) {
  errorEl.textContent = '⚠ ' + msg;
  errorEl.classList.remove('hidden');
}
