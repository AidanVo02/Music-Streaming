import { login } from '../api.js';
import { saveAuth, isLoggedIn } from '../auth.js';

// Redirect if already logged in
if (isLoggedIn()) window.location.href = '/index.html';

const form    = document.getElementById('login-form');
const errorEl = document.getElementById('login-error');
const btn     = document.getElementById('login-btn');
const togglePw = document.getElementById('toggle-pw');
const pwInput  = document.getElementById('password');

togglePw.addEventListener('click', () => {
  pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
  togglePw.textContent = pwInput.type === 'password' ? '👁' : '🙈';
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  errorEl.classList.add('hidden');
  btn.disabled = true;
  btn.textContent = 'CONNECTING...';

  try {
    const data = await login(
      document.getElementById('email').value.trim(),
      document.getElementById('password').value
    );

    if (data.success && data.data) {
      saveAuth(data.data, data.data.token);
      window.location.href = '/index.html';
    } else {
      showError(data.message || 'Login failed');
    }
  } catch {
    showError('Connection error. Is the server running?');
  } finally {
    btn.disabled = false;
    btn.textContent = 'INITIALIZE ENGINE';
  }
});

function showError(msg) {
  errorEl.textContent = '⚠ ' + msg;
  errorEl.classList.remove('hidden');
}
