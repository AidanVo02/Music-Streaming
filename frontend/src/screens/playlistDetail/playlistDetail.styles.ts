import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ORANGE = '#ff8000';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  header: {
    padding: width * 0.05,
    gap: width * 0.04,
  },
  coverImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: width * 0.03,
    backgroundColor: '#1a1a1a',
  },
  headerInfo: {
    gap: width * 0.02,
  },
  playlistName: {
    fontSize: width * 0.07,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: width * 0.035,
    color: '#aaa',
    lineHeight: width * 0.05,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
    marginTop: width * 0.01,
  },
  metaText: {
    fontSize: width * 0.03,
    color: '#888',
    fontWeight: '600',
  },
  metaDot: {
    fontSize: width * 0.03,
    color: '#555',
  },
  creatorText: {
    fontSize: width * 0.032,
    color: '#666',
    fontWeight: '600',
    marginTop: width * 0.01,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: width * 0.05,
    gap: width * 0.03,
    marginBottom: width * 0.04,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.03,
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: '#333',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tracksSection: {
    paddingHorizontal: width * 0.05,
    paddingBottom: width * 0.3,
  },
  sectionTitle: {
    fontSize: width * 0.032,
    fontWeight: '800',
    color: '#888',
    letterSpacing: 1.5,
    marginBottom: width * 0.03,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width * 0.03,
    gap: width * 0.02,
  },
  trackMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
  },
  trackPosition: {
    fontSize: width * 0.035,
    color: '#666',
    fontWeight: '700',
    width: width * 0.06,
    textAlign: 'center',
  },
  trackCover: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: width * 0.015,
    backgroundColor: '#1a1a1a',
  },
  trackInfo: {
    flex: 1,
    gap: 3,
  },
  trackTitle: {
    fontSize: width * 0.038,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  trackArtist: {
    fontSize: width * 0.032,
    color: '#888',
    fontWeight: '600',
  },
  trackDuration: {
    fontSize: width * 0.032,
    color: '#666',
    fontWeight: '600',
    marginRight: width * 0.02,
  },
  removeButton: {
    padding: width * 0.01,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: width * 0.15,
    gap: width * 0.03,
  },
  emptyText: {
    fontSize: width * 0.038,
    color: '#555',
    fontWeight: '600',
  },
  errorText: {
    fontSize: width * 0.04,
    color: '#aaa',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: ORANGE,
    paddingHorizontal: width * 0.08,
    paddingVertical: width * 0.03,
    borderRadius: width * 0.02,
  },
  retryButtonText: {
    color: '#000',
    fontSize: width * 0.035,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
