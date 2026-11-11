import { StyleSheet, Dimensions } from 'react-native';
import THEME from '@/src/constants/theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  miniMixCard: {
    flex: 1,
    marginRight: 10,
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.radii.md,
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  miniMixImg: {
    width: 60,
    height: 60,
    borderRadius: THEME.radii.sm,
    marginBottom: 6,
  },
  miniMixTitle: {
    color: THEME.colors.textPrimary,
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  miniPlayer: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 74,
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: THEME.colors.borderHighlight,
    ...THEME.shadows.floating,
  },
  miniPlayerImg: {
    width: 44,
    height: 44,
    borderRadius: THEME.radii.sm,
  },
  miniPlayerTitle: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  miniPlayerSub: {
    color: THEME.colors.accent,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});

export default styles;