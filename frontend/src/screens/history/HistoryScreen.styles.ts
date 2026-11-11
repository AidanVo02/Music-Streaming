import { StyleSheet, Dimensions } from 'react-native';
import THEME from '@/src/constants/theme';

const { width } = Dimensions.get('window');
const ORANGE = THEME.colors.accent;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: 0.3,
    marginHorizontal: 20,
    marginTop: 20,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceCard,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: THEME.radii.full,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: THEME.colors.borderHighlight,
  },
  searchInput: {
    flex: 1,
    color: THEME.colors.textPrimary,
    fontSize: 14,
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 100,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  trackContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: THEME.radii.sm,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: 0.2,
  },
  trackArtist: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    color: THEME.colors.textMuted,
    fontSize: 14,
    marginTop: 16,
    fontStyle: 'italic',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
