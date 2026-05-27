require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const path = require('path');
const db = require('../config/db');
const { generateWaveformFromFile, generateFallbackWaveform } = require('../utils/waveformGenerator');

async function run() {
  const [tracks] = await db.query(
    'SELECT track_id, file_path, title FROM tracks WHERE waveform_data IS NULL'
  );

  console.log(`🎵 Generating waveforms for ${tracks.length} tracks...`);

  for (const track of tracks) {
    try {
      const filePath = track.file_path;
      let peaks;

      if (filePath && !filePath.startsWith('http')) {
        // Local file
        const absPath = path.join(__dirname, '../../uploads', path.basename(filePath));
        peaks = await generateWaveformFromFile(absPath);
      } else {
        // External URL or null — use deterministic fallback
        peaks = generateFallbackWaveform(filePath || String(track.track_id));
      }

      await db.query(
        'UPDATE tracks SET waveform_data = ? WHERE track_id = ?',
        [JSON.stringify(peaks), track.track_id]
      );
      console.log(`  ✅ [${track.track_id}] ${track.title}`);
    } catch (e) {
      console.error(`  ❌ [${track.track_id}] ${track.title}: ${e.message}`);
    }
  }

  console.log('✅ Done!');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
