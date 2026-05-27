const fs = require('fs');
const path = require('path');

const NUM_PEAKS = 60; // number of bars to generate

/**
 * Generate waveform peaks from a local audio file.
 * Uses music-metadata to read the raw audio stream, then samples
 * the byte values to produce normalized peak amplitudes [0..1].
 *
 * Falls back to a deterministic pseudo-random waveform if the file
 * cannot be decoded (e.g. external URL tracks).
 *
 * @param {string} filePath  Absolute path to the audio file
 * @returns {Promise<number[]>}  Array of NUM_PEAKS values in [0.1, 1.0]
 */
async function generateWaveformFromFile(filePath) {
  try {
    if (!filePath || !fs.existsSync(filePath)) {
      return generateFallbackWaveform(filePath || '');
    }

    // Read raw bytes of the file
    const buffer = fs.readFileSync(filePath);
    const bytes = new Uint8Array(buffer);

    // Skip the first 4 KB (likely header/metadata) and sample the rest
    const start = Math.min(4096, Math.floor(bytes.length * 0.05));
    const usable = bytes.slice(start);

    if (usable.length < NUM_PEAKS) {
      return generateFallbackWaveform(filePath);
    }

    const chunkSize = Math.floor(usable.length / NUM_PEAKS);
    const peaks = [];

    for (let i = 0; i < NUM_PEAKS; i++) {
      const chunk = usable.slice(i * chunkSize, (i + 1) * chunkSize);
      // RMS of the chunk as a rough amplitude proxy
      let sum = 0;
      for (let j = 0; j < chunk.length; j++) {
        // Center around 128 (unsigned PCM midpoint)
        const v = (chunk[j] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / chunk.length);
      peaks.push(rms);
    }

    // Normalize to [0.1, 1.0]
    const max = Math.max(...peaks, 0.001);
    return peaks.map(p => Math.max(0.1, Math.min(1.0, p / max)));
  } catch (err) {
    console.warn('⚠️ Waveform generation failed, using fallback:', err.message);
    return generateFallbackWaveform(filePath || '');
  }
}

/**
 * Deterministic pseudo-random waveform based on the file path string.
 * Same track always gets the same shape — looks unique per track.
 */
function generateFallbackWaveform(seed) {
  const peaks = [];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  for (let i = 0; i < NUM_PEAKS; i++) {
    // Combine multiple sine waves seeded by hash for a natural look
    const t = i / NUM_PEAKS;
    const h = (hash >>> 0) / 0xffffffff;
    const v =
      Math.abs(Math.sin((t + h) * Math.PI * 3.7)) * 0.5 +
      Math.abs(Math.sin((t + h * 0.5) * Math.PI * 7.3)) * 0.3 +
      Math.abs(Math.sin((t + h * 0.3) * Math.PI * 13.1)) * 0.2;
    peaks.push(Math.max(0.1, Math.min(1.0, v)));
    hash = (hash * 1664525 + 1013904223) >>> 0; // LCG step
  }
  return peaks;
}

module.exports = { generateWaveformFromFile, generateFallbackWaveform, NUM_PEAKS };
