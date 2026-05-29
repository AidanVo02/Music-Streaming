import { StyleSheet, Dimensions } from 'react-native';

const ORANGE = '#ff8000';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
    paddingBottom: height * 0.02,
    backgroundColor: '#181818',
    elevation: 4,
  },
  logoText: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: width * 0.05,
    letterSpacing: 1.5,
    fontStyle: 'italic',
  },
  greetingSection: {
    paddingHorizontal: width * 0.05,
    paddingTop: width * 0.05,
    paddingBottom: width * 0.02,
  },
  greetingText: {
    color: '#fff',
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  banner: {
    height: width * 0.6,
    borderRadius: 18,
    marginHorizontal: width * 0.04,
    marginBottom: width * 0.06,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#222',
  },
  bannerImg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bannerContent: {
    position: 'absolute',
    top: width * 0.06,
    left: width * 0.05,
    bottom: width * 0.06,
    right: width * 0.05,
    justifyContent: 'flex-end',
  },
  featuredLabel: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: width * 0.032,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  bannerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.08,
    marginBottom: 4,
  },
  bannerDesc: {
    color: '#ccc',
    fontSize: width * 0.035,
    marginBottom: 12,
  },
  listenBtn: {
    backgroundColor: ORANGE,
    borderRadius: 20,
    paddingHorizontal: width * 0.06,
    paddingVertical: width * 0.025,
    alignSelf: 'flex-start',
  },
  listenBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
  section: {
    marginBottom: width * 0.08,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.05,
  },
  sectionAction: {
    color: '#aaa',
    fontSize: width * 0.035,
    fontWeight: '600',
  },
  listContentContainer: {
    paddingLeft: width * 0.05,
    paddingRight: width * 0.01,
  },
  trackCard: {
    width: width * 0.35,
    marginRight: width * 0.04,
  },
  trackImg: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#222',
  },
  trackTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.035,
  },
  trackSub: {
    color: '#aaa',
    fontSize: width * 0.03,
    marginTop: 2,
  },
  artistCard: {
    width: width * 0.28,
    marginRight: width * 0.04,
    alignItems: 'center',
  },
  artistImg: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: (width * 0.28) / 2,
    marginBottom: 8,
    backgroundColor: '#222',
  },
  artistName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.035,
    textAlign: 'center',
  },
  playlistCard: {
    width: width * 0.4,
    marginRight: width * 0.04,
  },
  playlistImg: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#222',
  },
  playlistTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.038,
  },
  playlistSub: {
    color: '#aaa',
    fontSize: width * 0.03,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#888',
    fontSize: width * 0.035,
    paddingHorizontal: width * 0.05,
    fontStyle: 'italic',
  }
});

export default styles;