import { StyleSheet } from 'react-native';
import THEME from '@/src/constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 6,
  },
  logoText: {
    color: THEME.colors.textPrimary,
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: 2,
  },
  logoAccent: {
    color: THEME.colors.accent,
  },
  logoUnderline: {
    width: 32,
    height: 3,
    backgroundColor: THEME.colors.accent,
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 24,
  },
  loginBox: {
    backgroundColor: THEME.colors.surfaceCard,
    marginHorizontal: 20,
    borderRadius: THEME.radii.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: THEME.colors.borderHighlight,
    ...THEME.shadows.diffuse,
  },
  title: {
    color: THEME.colors.textPrimary,
    fontWeight: '800',
    fontSize: 24,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    marginBottom: 16,
  },
  label: {
    color: THEME.colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
    marginTop: 14,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: THEME.colors.surfaceHover,
    color: THEME.colors.textPrimary,
    borderRadius: THEME.radii.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 2,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeBtn: {
    marginLeft: 8,
    padding: 6,
  },
  loginBtn: {
    backgroundColor: THEME.colors.accent,
    borderRadius: THEME.radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 24,
    marginBottom: 10,
    ...THEME.shadows.glow,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.accent,
    marginRight: 6,
  },
  statusText: {
    color: THEME.colors.accent,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 12,
  },
  statusTextDim: {
    color: THEME.colors.textMuted,
    fontSize: 12,
  },
  createAccountBtn: {
    alignItems: 'center',
    paddingVertical: 13,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: THEME.colors.borderHighlight,
    borderRadius: THEME.radii.full,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  createAccountText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
  },
  createAccountLink: {
    color: THEME.colors.accent,
    fontWeight: '700',
  },
});

export default styles;
