import { StyleSheet, Dimensions } from 'react-native';

const ORANGE = '#ff8000';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },

  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.08,
    marginLeft: width * 0.05,
    marginTop: width * 0.025,
    marginBottom: width * 0.02,
    letterSpacing: 1.5,
  },

  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
    marginLeft: width * 0.05,
    marginTop: width * 0.04,
    marginBottom: width * 0.025,
    letterSpacing: 1.1,
  },

  genreChipsWrap: {
    paddingHorizontal: width * 0.05,
    marginBottom: width * 0.03,
  },

  genreChip: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: width * 0.05,
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.02,
    marginRight: width * 0.025,
  },

  genreChipActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },

  genreChipText: {
    color: '#aaa',
    fontWeight: 'bold',
    fontSize: width * 0.032,
    letterSpacing: 1,
  },

  genreChipTextActive: {
    color: '#111',
  },

  trackCard: {
    backgroundColor: '#181818',
    borderRadius: width * 0.03,
    marginHorizontal: width * 0.05,
    marginBottom: width * 0.03,
    padding: width * 0.03,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  trackCover: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.02,
    backgroundColor: '#222',
  },

  trackInfo: {
    flex: 1,
    marginLeft: width * 0.03,
  },

  trackTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
    marginBottom: 2,
  },

  trackMeta: {
    color: '#aaa',
    fontSize: width * 0.032,
    marginTop: 2,
  },

  playCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.025,
    paddingVertical: width * 0.015,
    gap: 4,
  },

  playCountText: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: width * 0.03,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    color: '#555',
    fontSize: width * 0.038,
    marginTop: 10,
  },

  // --- Search Styles ---
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginHorizontal: width * 0.05,
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
    marginBottom: width * 0.04,
    height: width * 0.12,
  },
  searchIcon: {
    marginRight: width * 0.02,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: width * 0.04,
    height: '100%',
  },
  clearButton: {
    padding: width * 0.02,
  },
  horizontalList: {
    paddingLeft: width * 0.05,
    paddingRight: width * 0.01,
  },
  
  // Artist Result Card
  artistSearchCard: {
    width: width * 0.28,
    marginRight: width * 0.04,
    alignItems: 'center',
  },
  artistSearchImg: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: (width * 0.28) / 2,
    marginBottom: 8,
    backgroundColor: '#222',
  },
  artistSearchName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.035,
    textAlign: 'center',
  },

  // Playlist Result Card
  playlistSearchCard: {
    width: width * 0.4,
    marginRight: width * 0.04,
  },
  playlistSearchImg: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#222',
  },
  playlistSearchTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.038,
  },
  playlistSearchSub: {
    color: '#aaa',
    fontSize: width * 0.03,
    marginTop: 2,
  },
});

export default styles;
