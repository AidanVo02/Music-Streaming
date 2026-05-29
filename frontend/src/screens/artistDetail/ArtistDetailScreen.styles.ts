import { StyleSheet, Dimensions } from 'react-native';

const ORANGE = '#ff8000';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },

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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
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
    backgroundColor: '#333',
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
    borderRadius: width * 0.03,
    paddingVertical: width * 0.035,
    gap: 8,
  },
  playAllText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: width * 0.038,
    letterSpacing: 1,
  },
  shuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    borderRadius: width * 0.03,
    paddingVertical: width * 0.035,
    paddingHorizontal: width * 0.05,
    gap: 8,
  },
  shuffleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.038,
    letterSpacing: 1,
  },
  followBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    borderRadius: width * 0.03,
    paddingVertical: width * 0.035,
    paddingHorizontal: width * 0.045,
  },

  // Bio section
  bioWrap: {
    marginHorizontal: width * 0.05,
    marginBottom: width * 0.05,
    backgroundColor: '#181818',
    borderRadius: width * 0.03,
    padding: width * 0.04,
  },
  bioLabel: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: width * 0.03,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  bioText: {
    color: '#ccc',
    fontSize: width * 0.036,
    lineHeight: width * 0.055,
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
    color: '#111',
    fontWeight: 'bold',
    fontSize: width * 0.038,
    letterSpacing: 1,
  },
});

export default styles;
