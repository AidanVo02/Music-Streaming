import { StyleSheet, Dimensions } from 'react-native';
import THEME from '@/src/constants/theme';

const ORANGE = THEME.colors.accent;
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },

  // Header hero image
  heroWrap: {
    width: '100%',
    height: height * 0.38,
    position: 'relative',
  },
  heroImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  heroGradient: {
    ...StyleSheet.absoluteFill,
    // gradient from transparent to #111 at bottom
    backgroundColor: 'transparent',
  },
  backBtn: {
    position: 'absolute',
    top: width * 0.1,
    left: width * 0.04,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: width * 0.08,
    padding: width * 0.025,
    zIndex: 10,
  },
  heroContent: {
    position: 'absolute',
    bottom: width * 0.05,
    left: width * 0.05,
    right: width * 0.05,
  },
  artistLabel: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: width * 0.03,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  artistName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.09,
    letterSpacing: 1,
    lineHeight: width * 0.1,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: width * 0.05,
    marginTop: width * 0.045,
    marginBottom: width * 0.04,
    gap: width * 0.06,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.05,
  },
  statLabel: {
    color: '#aaa',
    fontSize: width * 0.028,
    letterSpacing: 1,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: width * 0.08,
    backgroundColor: THEME.colors.border,
  },

  // Action buttons
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: width * 0.05,
    marginBottom: width * 0.05,
    gap: width * 0.03,
  },
  playAllBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORANGE,
    borderRadius: THEME.radii.full,
    paddingVertical: 14,
    gap: 8,
    ...THEME.shadows.glow,
  },
  playAllText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  shuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.radii.full,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: THEME.colors.borderHighlight,
  },
  shuffleText: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  followBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.radii.full,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: THEME.colors.borderHighlight,
  },

  // Bio section
  bioWrap: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  bioLabel: {
    color: ORANGE,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  bioText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  // Section title
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
    marginLeft: width * 0.05,
    marginBottom: width * 0.025,
    letterSpacing: 1.1,
  },

  // Track row
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e1e',
  },
  trackIndex: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: width * 0.038,
    width: width * 0.07,
  },
  trackInfo: {
    flex: 1,
    marginLeft: width * 0.02,
  },
  trackTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  trackMeta: {
    color: '#aaa',
    fontSize: width * 0.032,
    marginTop: 2,
  },
  trackDuration: {
    color: '#555',
    fontSize: width * 0.035,
    marginRight: width * 0.03,
  },
  trackMoreBtn: {
    padding: width * 0.01,
  },

  // Loading / Error
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#aaa',
    fontSize: width * 0.04,
    marginBottom: width * 0.04,
  },
  retryBtn: {
    backgroundColor: ORANGE,
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.06,
    paddingVertical: width * 0.025,
  },
  retryText: {
    color: THEME.colors.textInverse,
    fontWeight: 'bold',
    fontSize: width * 0.038,
    letterSpacing: 1,
  },
});

export default styles;
