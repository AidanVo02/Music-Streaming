// Test script to verify playlist API
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000';

async function testPlaylistAPI() {
  console.log('🧪 Testing Playlist API...\n');

  // Test 1: Get public playlists (no auth required)
  console.log('1️⃣ Testing GET /api/playlists/public');
  try {
    const res1 = await fetch(`${API_BASE}/api/playlists/public`);
    const data1 = await res1.json();
    console.log('✅ Status:', res1.status);
    console.log('✅ Response:', data1);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }

  console.log('\n---\n');

  // Test 2: Create playlist (requires auth)
  console.log('2️⃣ Testing POST /api/playlists (without token)');
  try {
    const res2 = await fetch(`${API_BASE}/api/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Playlist' }),
    });
    const data2 = await res2.json();
    console.log('Status:', res2.status);
    console.log('Response:', data2);
    console.log(res2.status === 401 ? '✅ Correctly requires auth' : '❌ Should require auth');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }

  console.log('\n---\n');

  // Test 3: Login and get token
  console.log('3️⃣ Testing login to get token');
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
      console.log('✅ Login successful, got token');
      const token = data3.token;

      console.log('\n---\n');

      // Test 4: Create playlist with token
      console.log('4️⃣ Testing POST /api/playlists (with token)');
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
      console.log(data4.success ? '✅ Playlist created!' : '❌ Failed to create');
    } else {
      console.log('❌ Login failed:', data3.message);
      console.log('💡 Make sure you have a test user or update credentials in this script');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }

  console.log('\n✅ Test complete!');
}

testPlaylistAPI();
