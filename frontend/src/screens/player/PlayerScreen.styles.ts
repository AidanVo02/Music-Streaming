import { StyleSheet, Dimensions } from 'react-native';

const ORANGE = '#ff8000';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },

  // ── COVER ──────────────────────────────────────────────────
  coverWrap: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  coverImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // Track title + badge row at bottom of cover
  coverTitleWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: width * 0.05,
    paddingBottom: width * 0.04,
    paddingTop: width * 0.12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  coverTitle: {
    color: '#fff',
    fontSize: width * 0.07,
    fontWeight: '900',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  // Quality badge — inline with title row
  qualityBadge: {
    backgroundColor: 'rgba(30,30,30,0.92)',
    borderRadius: width * 0.015,
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.015,
    flexShrink: 0,
    marginLeft: width * 0.02,
    marginBottom: width * 0.005,
  },
  qualityText: {
    color: ORANGE,
    fontSize: width * 0.028,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // ── NOW PLAYING LABEL ──────────────────────────────────────
  nowPlayingLabel: {
    color: ORANGE,
    fontSize: width * 0.038,
    fontWeight: '800',
    letterSpacing: 2,
    paddingHorizontal: width * 0.05,
    paddingTop: width * 0.05,
    paddingBottom: width * 0.02,
  },

  // ── CONTROLS PANEL ─────────────────────────────────────────
  controlsPanel: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: width * 0.04,
    borderRadius: width * 0.04,
    paddingVertical: width * 0.04,
    paddingHorizontal: width * 0.04,
  },
  // Top row: shuffle | prev | PLAY | next | repeat
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: width * 0.01,
  },
  controlBtn: {
    padding: width * 0.025,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    backgroundColor: ORANGE,
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ORANGE,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  // Wrapper for animated glow — separate from the button itself
  playBtnGlow: {
    borderRadius: width * 0.03,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 0 },
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: '#2a2a2a',
    marginVertical: width * 0.03,
  },
  // Bottom row: share | queue | devices | like
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionBtn: {
    alignItems: 'center',
    gap: width * 0.01,
  },
  actionLabel: {
    color: '#666',
    fontSize: width * 0.025,
    letterSpacing: 1,
    fontWeight: '600',
  },
  actionLabelActive: {
    color: ORANGE,
  },

  // ── WAVEFORM + PROGRESS ────────────────────────────────────
  bottomWrap: {
    paddingHorizontal: width * 0.04,
    paddingTop: width * 0.04,
    paddingBottom: width * 0.02,
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: width * 0.1,
    gap: width * 0.005,
    marginBottom: width * 0.025,
  },
  waveBar: {
    flex: 1,
    borderRadius: 2,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#2a2a2a',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: width * 0.02,
  },
  progressFill: {
    height: '100%',
    backgroundColor: ORANGE,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#666',
    fontSize: width * 0.03,
    fontWeight: '600',
  },
});
