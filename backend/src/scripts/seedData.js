const db = require('../config/db.js');

const artists = [
  { name: 'Onyx Collective', bio: 'Experimental electronic music producer from Berlin', image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80' },
  { name: 'Vector Theory', bio: 'Ambient and downtempo artist exploring sonic landscapes', image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80' },
  { name: 'Silicon Dream', bio: 'Synthwave and retrowave producer', image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80' },
  { name: 'Phase 4', bio: 'Deep house and techno DJ from Amsterdam', image_url: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=400&q=80' },
  { name: 'Carbon', bio: 'Industrial and dark ambient composer', image_url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=400&q=80' },
  { name: 'The Grid', bio: 'Trance and progressive house producer', image_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80' },
  { name: 'Neon Static', bio: 'Glitch hop and future bass artist', image_url: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=400&q=80' },
  { name: 'Analog Drift', bio: 'Lo-fi hip hop and chillhop beats', image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80' },
];

const tracks = [
  // Electronic
  { title: 'Voltage Leak', artist_idx: 0, genre: 'Electronic', duration: 245, play_count: 15420, cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80' },
  { title: 'Circuit Breaker', artist_idx: 2, genre: 'Electronic', duration: 198, play_count: 8930, cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80' },
  { title: 'Digital Pulse', artist_idx: 6, genre: 'Electronic', duration: 312, play_count: 12100, cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80' },
  
  // Ambient
  { title: 'Midnight Oscillations', artist_idx: 1, genre: 'Ambient', duration: 420, play_count: 23450, cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80' },
  { title: 'Echoes of Darkness', artist_idx: 0, genre: 'Ambient', duration: 380, play_count: 18200, cover: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
  { title: 'Stellar Drift', artist_idx: 1, genre: 'Ambient', duration: 456, play_count: 9870, cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  
  // House
  { title: 'Deep Frequency', artist_idx: 3, genre: 'House', duration: 287, play_count: 31200, cover: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=400&q=80' },
  { title: 'Obsidian Groove', artist_idx: 3, genre: 'House', duration: 265, play_count: 19800, cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80' },
  { title: 'Neon Nights', artist_idx: 5, genre: 'House', duration: 298, play_count: 14500, cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=400&q=80' },
  
  // Techno
  { title: 'Industrial Complex', artist_idx: 4, genre: 'Techno', duration: 342, play_count: 27600, cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=400&q=80' },
  { title: 'Machine Code', artist_idx: 4, genre: 'Techno', duration: 315, play_count: 16700, cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80' },
  { title: 'Binary Sunset', artist_idx: 2, genre: 'Techno', duration: 289, play_count: 11200, cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80' },
  
  // Trance
  { title: 'Euphoric State', artist_idx: 5, genre: 'Trance', duration: 412, play_count: 42300, cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80' },
  { title: 'Cosmic Journey', artist_idx: 5, genre: 'Trance', duration: 398, play_count: 28900, cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=400&q=80' },
  { title: 'Astral Projection', artist_idx: 1, genre: 'Trance', duration: 445, play_count: 19300, cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80' },
  
  // Lo-fi
  { title: 'Rainy Day Study', artist_idx: 7, genre: 'Lo-fi', duration: 178, play_count: 56700, cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80' },
  { title: 'Coffee Shop Vibes', artist_idx: 7, genre: 'Lo-fi', duration: 165, play_count: 48200, cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80' },
  { title: 'Midnight Thoughts', artist_idx: 7, genre: 'Lo-fi', duration: 192, play_count: 39800, cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80' },
  
  // Synthwave
  { title: 'Neon Drive', artist_idx: 2, genre: 'Synthwave', duration: 234, play_count: 34500, cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80' },
  { title: 'Retro Future', artist_idx: 2, genre: 'Synthwave', duration: 267, play_count: 22100, cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80' },
  { title: 'Cyber City', artist_idx: 6, genre: 'Synthwave', duration: 298, play_count: 18700, cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=400&q=80' },
  
  // Drum & Bass
  { title: 'Liquid Motion', artist_idx: 6, genre: 'Drum & Bass', duration: 312, play_count: 25400, cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80' },
  { title: 'Breakbeat Symphony', artist_idx: 0, genre: 'Drum & Bass', duration: 289, play_count: 17800, cover: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
  { title: 'Neurofunk Assault', artist_idx: 4, genre: 'Drum & Bass', duration: 325, play_count: 13200, cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=400&q=80' },
];

async function seed() {
  console.log('🌱 Seeding database with sample data...\n');

  try {
    // Insert artists
    console.log('📝 Creating artists...');
    const artistIds = [];
    for (const artist of artists) {
      const [result] = await db.query(
        'INSERT INTO artists (name, bio, image_url) VALUES (?, ?, ?)',
        [artist.name, artist.bio, artist.image_url]
      );
      artistIds.push(result.insertId);
      console.log(`  ✅ ${artist.name}`);
    }

    // Insert tracks
    console.log('\n🎵 Creating tracks...');
    for (const track of tracks) {
      const artistId = artistIds[track.artist_idx];
      await db.query(
        `INSERT INTO tracks (title, artist_id, genre, duration, play_count, cover_image_url, file_path, originator)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          track.title,
          artistId,
          track.genre,
          track.duration,
          track.play_count,
          track.cover,
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // placeholder audio
          artists[track.artist_idx].name,
        ]
      );
      console.log(`  ✅ ${track.title} - ${track.genre} (${track.play_count} plays)`);
    }

    console.log('\n✔ Seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - ${artists.length} artists created`);
    console.log(`   - ${tracks.length} tracks created`);
    console.log(`   - Genres: Electronic, Ambient, House, Techno, Trance, Lo-fi, Synthwave, Drum & Bass`);
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
  } finally {
    process.exit(0);
  }
}

seed();
