import { StyleSheet } from 'react-native';
import THEME from '@/src/constants/theme';

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: THEME.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  logoText: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 2,
  },
  logoAccent: {
    color: THEME.colors.accent,
  },
  loginText: {
    color: THEME.colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 1,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radii.full,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
});

export default styles;