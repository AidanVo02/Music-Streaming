# SIGNAL ONYX / Streaming_Web

A full-stack music streaming platform with a modern Expo React Native frontend, Node.js/Express backend, admin dashboard, playlists, queue system, and artist management.

## 🚀 Why this project stands out
- Smooth queue, playlist, and player controls
- Artist applications with admin approval
- Secure authentication and role-based access
- Smart radio / playback history features
- Modular backend with API routes, models, and middleware

## 🧩 Tech stack
- Frontend: Expo / React Native, Expo Router, Tailwind CSS
- Backend: Node.js, Express, MySQL, Firebase, JWT
- Storage: Google Cloud Storage + local uploads
- Database: MySQL
- Admin dashboard: static HTML/CSS/JS in `admin-dashboard/`

## ✨ Main features
- Authentication: register, login, role-based access
- User profiles, artist profiles, and statistics
- Playlist creation, update, delete, and track management
- Queue system: next/previous, shuffle, repeat, jump-to-track
- Smart Radio fallback when queue is empty
- Track upload, waveform visualization, and playback controls
- Admin panel: manage users, artists, applications, and verify content

## 📂 Repository layout
- `backend/` – backend API, models, controllers, routes, scripts
- `frontend/` – Expo mobile/web app with screens, components, and API service
- `admin-dashboard/` – standalone admin UI files
- `techStack.md`, `PROJECT_SUMMARY.md`, and other guides with architecture notes

## 🔐 Important security setup
- Never commit `backend/.env` or any `.env` secrets
- Use `backend/.env.example` to copy environment keys without values
- `backend/.gitignore` and root `.gitignore` now ignore `node_modules/` and `.env`

## ✅ Quick start
1. Copy env template:
   ```bash
   cd backend
   cp .env.example .env
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
4. Start backend:
   ```bash
   cd ../backend
   npm start
   ```
5. Start frontend:
   ```bash
   cd ../frontend
   npm start
   ```

## 📌 Notes
- `backend/.env.example` contains placeholders only; do not store real secrets in README or repo.
- `backend/.gitignore` also ignores backend-specific `node_modules/` and `.env` files.
