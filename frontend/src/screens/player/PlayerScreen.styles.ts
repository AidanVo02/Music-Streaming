import { StyleSheet, Dimensions } from 'react-native';
import THEME from '@/src/constants/theme';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },

  contentScroll: {
    flex: 1,
  },

  contentContainer: {
    paddingBottom: 28,
  },

  // ── FLOATING COVER ART ─────────────────────────────────────
  coverOuterWrap: {
    paddingHorizontal: width * 0.08,
    paddingTop: width * 0.04,
    alignItems: 'center',
  },
  coverWrap: {
    width: width * 0.84,
    height: width * 0.84,
    borderRadius: THEME.radii.xl,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surfaceCard,
    borderWidth: 1,
    borderColor: THEME.colors.borderHighlight,
    ...THEME.shadows.diffuse,
  },
  coverImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // ── TRACK TITLE & ARTIST META ──────────────────────────────
  metaSection: {
    paddingHorizontal: width * 0.08,
    paddingTop: width * 0.06,
    paddingBottom: width * 0.02,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleTextWrap: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  coverTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  artistName: {
    color: THEME.colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  qualityBadge: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.borderHighlight,
    borderRadius: THEME.radii.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  qualityText: {
    color: THEME.colors.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  // ── WAVEFORM + PROGRESS ────────────────────────────────────
  bottomWrap: {
    paddingHorizontal: width * 0.08,
    paddingTop: width * 0.05,
    paddingBottom: width * 0.02,
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 48,
    gap: 2.5,
    marginBottom: 14,
  },
  waveBar: {
    flex: 1,
    borderRadius: 2,
  },
  progressBar: {
    height: 3,
    backgroundColor: THEME.colors.surfaceHover,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // ── CONTROLS PANEL ─────────────────────────────────────────
  controlsPanel: {
    backgroundColor: THEME.colors.surfaceCard,
    marginHorizontal: width * 0.06,
    marginTop: width * 0.04,
    borderRadius: THEME.radii.xl,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.diffuse,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlBtn: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    backgroundColor: THEME.colors.accent,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.glow,
  },
  playBtnGlow: {
    borderRadius: 32,
    shadowColor: THEME.colors.accent,
    shadowOffset: { width: 0, height: 4 },
  },

  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: 18,
  },

  // Secondary actions row: playlist, queue, like
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radii.sm,
  },
  actionLabel: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  actionLabelActive: {
    color: THEME.colors.accent,
  },
});
