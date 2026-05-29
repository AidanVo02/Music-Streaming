import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ORANGE = '#ff8000';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    marginHorizontal: width * 0.05,
    marginTop: width * 0.05,
    textTransform: 'uppercase',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginHorizontal: width * 0.05,
    marginTop: width * 0.04,
    marginBottom: width * 0.04,
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.04,
    height: width * 0.12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: width * 0.04,
    marginLeft: width * 0.02,
  },
  listContainer: {
    paddingBottom: width * 0.25,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  trackContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
  },
  cover: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.015,
    backgroundColor: '#222',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  trackTitle: {
    fontSize: width * 0.04,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  trackArtist: {
    fontSize: width * 0.032,
    color: '#888',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: width * 0.2,
  },
  emptyText: {
    color: '#aaa',
    fontSize: width * 0.04,
    marginTop: width * 0.04,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
