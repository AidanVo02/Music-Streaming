# Streaming_Web Frontend

This is the Expo frontend for the Streaming_Web project. The app uses **Expo Router** and communicates with the backend API running on port 5000.

## Project setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Configure the backend API URL

   The frontend reads the API base URL from frontend/.env.local using `EXPO_PUBLIC_API_URL`.

   Example:

   ```env
   EXPO_PUBLIC_API_URL=http://192.168.1.101:5000
   ```

   - For local browser/web use: http://localhost:5000
   - For Android emulator: http://10.0.2.2:5000
   - For iOS simulator: http://127.0.0.1:5000 or http://localhost:5000
   - For a physical device: use your machine IP address, e.g. http://192.168.x.x:5000

3. Start the backend server first

   ```bash
   cd ../backend
   npm start
   ```

4. Start the frontend app

   ```bash
   cd ../frontend
   npm start
   ```

## Running the app

- Web: http://localhost:8081
- Mobile: scan the QR code with Expo Go or use expo run:android / expo run:ios

## Key directories

- src/app/: Expo Router entry points and route screens
- src/screens/: main screen components
- src/server/: backend API service and config
- src/context/: app-wide state and authentication contexts

## API sync status

The frontend currently calls these routes through EXPO_PUBLIC_API_URL:

- /api/auth/*
- /api/artists/*
- /api/tracks/*
- /api/artist-application/*
- /api/playlists/*
- /api/likes/*

## Notes

- I confirmed the backend root endpoint (/) and /test-db are reachable on http://localhost:5000.
- The frontend currently uses http://192.168.1.101:5000 in .env.local.
- If you run web on the same machine, http://localhost:5000 is usually the best choice.
