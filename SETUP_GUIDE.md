# Setup Guide

## Overview

This guide combines API setup and Firebase setup to show how to clone the project, configure environment variables, and run the app locally.

It is the merged version of `API_SETUP_GUIDE.md` and `FIREBASE_SETUP_GUIDE.md`.

---

## 1. Clone the repository

```bash
git clone https://github.com/AidanVo02/Music-Streaming.git
cd Music-Streaming
```

## 2. Install dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd ../frontend
npm install
```

## 3. Configure backend environment

Create `backend/.env` from `backend/.env.example`.

```bash
cd backend
copy .env.example .env
```

Then populate the file with your local values:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=streaming_web
DB_PORT=3306

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_STORAGE_BUCKET=your_bucket_name.appspot.com
```

> Notes:
> - Keep `.env` private.
> - Do not commit `.env` to Git.
> - Use `.env.example` as the public template only.

## 4. Configure frontend environment

Create `frontend/.env.local` and set the API URL.

```bash
cd ../frontend
New-Item .env.local -ItemType File
```

Add:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000
```

### If using Android emulator
```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000
```

### If using iOS simulator
```env
EXPO_PUBLIC_API_URL=http://127.0.0.1:5000
```

### If using a physical device
```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000
```

## 5. Setup database

### Create MySQL database

Use your MySQL client to create the database:

```sql
CREATE DATABASE streaming_web;
```

### Run schema scripts

If you have setup scripts under `backend/src/scripts`, run:

```bash
cd backend
node src/scripts/createPlaylistTables.js
```

If you need to create other tables, run the available SQL scripts or use the code in `backend/src/scripts`.

## 6. Setup Firebase Cloud Storage

### Create Firebase project
1. Open [Firebase Console](https://console.firebase.google.com).
2. Create or select a project.
3. Enable **Cloud Storage**.
4. Create a storage bucket (recommended: `{project-name}-uploads`).

### Generate service account key
1. Go to Project Settings → Service Accounts.
2. Generate a new private key.
3. Copy the JSON values into `.env`.

### Required env entries
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="YOUR_PRIVATE_KEY"
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_STORAGE_BUCKET=your_bucket_name.appspot.com
```

> If Firebase is not configured, the backend can still fallback to local `backend/uploads/` storage for file uploads.

## 7. Run the backend server

```bash
cd backend
npm start
```

Check that backend is reachable:

- `http://localhost:5000`
- `http://localhost:5000/api/auth/login`

## 8. Run the frontend app

```bash
cd frontend
npm start
```

Then open the Expo web interface or scan the QR code with Expo Go.

## 9. API endpoints summary

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Artists
- `GET /api/artists`
- `GET /api/artists/:id`
- `GET /api/artists/search?q=`

### Tracks
- `GET /api/tracks`
- `GET /api/tracks/:id`
- `POST /api/tracks/upload`
- `POST /api/tracks/:id/play`

### Playlists
- `GET /api/playlists`
- `POST /api/playlists`
- `GET /api/playlists/:id`
- `PUT /api/playlists/:id`
- `DELETE /api/playlists/:id`

## 10. Troubleshooting

### Common issues
- **Cannot connect to backend**: verify `EXPO_PUBLIC_API_URL` and backend is running
- **Auth errors**: verify JWT_SECRET and token handling
- **Firebase errors**: verify storage bucket and private key
- **Database errors**: verify MySQL connection and `backend/.env` values

### Emulator tips
- Use `10.0.2.2` for Android emulator
- Use `127.0.0.1` or `localhost` for iOS simulator
- Use your machine IP for physical devices

## 11. Notes
- `backend/.env.example` is the safe template for env variables.
- `.gitignore` already excludes `node_modules/`, `.env`, `.vscode/`, and `.kiro/`.
- Always keep secrets out of Git.
