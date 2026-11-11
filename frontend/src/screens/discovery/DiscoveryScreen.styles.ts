import { StyleSheet, Dimensions } from 'react-native';
import THEME from '@/src/constants/theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },

  title: {
    color: THEME.colors.textPrimary,
    fontWeight: '800',
    fontSize: 26,
    marginLeft: 20,
    marginTop: 14,
    marginBottom: 10,
    letterSpacing: 0.3,
  },

  sectionTitle: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
    fontSize: 17,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: 0.2,
  },

  genreChipsWrap: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  genreChip: {
    backgroundColor: THEME.colors.surfaceCard,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radii.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },

  genreChipActive: {
    backgroundColor: THEME.colors.accent,
    borderColor: THEME.colors.accent,
    ...THEME.shadows.glow,
  },

  genreChipText: {
    color: THEME.colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.3,
  },

  genreChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  trackCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.radii.md,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },

  trackCover: {
    width: 52,
    height: 52,
    borderRadius: THEME.radii.sm,
    backgroundColor: THEME.colors.surfaceSubtle,
  },

  trackInfo: {
    flex: 1,
    marginLeft: 14,
  },

  trackTitle: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
    letterSpacing: 0.2,
  },

  trackMeta: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  playCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.radii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: THEME.colors.borderHighlight,
    gap: 4,
  },

  playCountText: {
    color: THEME.colors.accent,
    fontWeight: '700',
    fontSize: 11,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    marginTop: 10,
    fontStyle: 'italic',
  },

  // --- Search Styles ---
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    marginHorizontal: 16,
    borderRadius: THEME.radii.full,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 48,
    borderWidth: 1,
    borderColor: THEME.colors.borderHighlight,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: THEME.colors.textPrimary,
    fontSize: 14,
    height: '100%',
  },
  clearButton: {
    padding: 6,
  },
  horizontalList: {
    paddingLeft: 20,
    paddingRight: 8,
  },

  // Artist Result Card
  artistSearchCard: {
    width: 100,
    marginRight: 14,
    alignItems: 'center',
  },
  artistSearchImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 8,
    backgroundColor: THEME.colors.surfaceCard,
    borderWidth: 1,
    borderColor: THEME.colors.borderHighlight,
  },
  artistSearchName: {
    color: THEME.colors.textPrimary,
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  // Playlist Result Card
  playlistSearchCard: {
    width: 140,
    marginRight: 14,
  },
  playlistSearchImg: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: THEME.radii.md,
    marginBottom: 8,
    backgroundColor: THEME.colors.surfaceCard,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  playlistSearchTitle: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  playlistSearchSub: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});

export default styles;
