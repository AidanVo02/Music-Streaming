// Test script to verify playlist API
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000';

async function testPlaylistAPI() {
  console.log('[TEST] Testing Playlist API...\n');

  // Test 1: Get public playlists (no auth required)
  console.log('1⃣ Testing GET /api/playlists/public');
  try {
    const res1 = await fetch(`${API_BASE}/api/playlists/public`);
    const data1 = await res1.json();
    console.log('[OK] Status:', res1.status);
    console.log('[OK] Response:', data1);
  } catch (err) {
    console.error('[ERROR] Error:', err.message);
  }

  console.log('\n---\n');

  // Test 2: Create playlist (requires auth)
  console.log('2⃣ Testing POST /api/playlists (without token)');
  try {
    const res2 = await fetch(`${API_BASE}/api/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Playlist' }),
    });
    const data2 = await res2.json();
    console.log('Status:', res2.status);
    console.log('Response:', data2);
    console.log(res2.status === 401 ? '[OK] Correctly requires auth' : '[ERROR] Should require auth');
  } catch (err) {
    console.error('[ERROR] Error:', err.message);
  }

  console.log('\n---\n');

  // Test 3: Login and get token
  console.log('3⃣ Testing login to get token');
  try {
    const res3 = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com', // Change to your test user
        password: 'password123',
      }),
    });
    const data3 = await res3.json();
    console.log('Status:', res3.status);
    
    if (data3.success && data3.token) {
      console.log('[OK] Login successful, got token');
      const token = data3.token;

      console.log('\n---\n');

      // Test 4: Create playlist with token
      console.log('4⃣ Testing POST /api/playlists (with token)');
      const res4 = await fetch(`${API_BASE}/api/playlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: 'My Test Playlist',
          description: 'Created from test script',
          is_public: true,
        }),
      });
      const data4 = await res4.json();
      console.log('Status:', res4.status);
      console.log('Response:', data4);
      console.log(data4.success ? '[OK] Playlist created!' : '[ERROR] Failed to create');
    } else {
      console.log('[ERROR] Login failed:', data3.message);
      console.log('[TIP] Make sure you have a test user or update credentials in this script');
    }
  } catch (err) {
    console.error('[ERROR] Error:', err.message);
  }

  console.log('\n[OK] Test complete!');
}

testPlaylistAPI();
