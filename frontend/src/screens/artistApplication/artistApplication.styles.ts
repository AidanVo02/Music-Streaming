import { StyleSheet, Dimensions } from 'react-native';
import THEME from '@/src/constants/theme';

const ORANGE = THEME.colors.accent;
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: THEME.colors.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderHighlight,
  },
  headerTitle: {
    color: '#fff',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginTop: width * 0.04,
    marginBottom: width * 0.02,
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    color: '#aaa',
    fontSize: width * 0.035,
    textAlign: 'center',
    lineHeight: width * 0.055,
  },
  formSection: {
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.06,
  },
  sectionTitle: {
    color: ORANGE,
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: width * 0.04,
    letterSpacing: 1.5,
  },
  inputGroup: {
    marginBottom: width * 0.05,
  },
  inputLabel: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: '700',
    marginBottom: width * 0.015,
    letterSpacing: 0.5,
  },
  inputHint: {
    color: THEME.colors.textMuted,
    fontSize: width * 0.03,
    marginBottom: width * 0.02,
    fontStyle: 'italic',
  },
  textInput: {
    backgroundColor: THEME.colors.surfaceCard,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radii.md,
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.035,
    color: THEME.colors.textPrimary,
    fontSize: width * 0.04,
  },
  textArea: {
    height: width * 0.3,
    paddingTop: width * 0.035,
  },
  charCount: {
    color: THEME.colors.textMuted,
    fontSize: width * 0.028,
    textAlign: 'right',
    marginTop: width * 0.01,
  },
  requirementsBox: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    borderWidth: 1,
    borderColor: THEME.colors.success,
    borderRadius: THEME.radii.lg,
    padding: width * 0.04,
    marginBottom: width * 0.04,
  },
  requirementsTitle: {
    color: THEME.colors.success,
    fontSize: width * 0.038,
    fontWeight: 'bold',
    marginBottom: width * 0.03,
    letterSpacing: 1,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width * 0.02,
    gap: width * 0.02,
  },
  requirementText: {
    color: THEME.colors.textSecondary,
    fontSize: width * 0.035,
    flex: 1,
  },
  benefitsBox: {
    backgroundColor: THEME.colors.accentMuted,
    borderWidth: 1,
    borderColor: THEME.colors.borderActive,
    borderRadius: THEME.radii.lg,
    padding: width * 0.04,
    marginBottom: width * 0.04,
  },
  benefitsTitle: {
    color: ORANGE,
    fontSize: width * 0.038,
    fontWeight: 'bold',
    marginBottom: width * 0.03,
    letterSpacing: 1,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width * 0.025,
    gap: width * 0.02,
  },
  benefitText: {
    color: THEME.colors.textSecondary,
    fontSize: width * 0.035,
    flex: 1,
  },
  submitButton: {
    backgroundColor: ORANGE,
    marginHorizontal: width * 0.05,
    marginTop: width * 0.02,
    paddingVertical: width * 0.04,
    borderRadius: THEME.radii.full,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: width * 0.02,
    ...THEME.shadows.glow,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  cancelButton: {
    marginHorizontal: width * 0.05,
    marginTop: width * 0.03,
    paddingVertical: width * 0.035,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: THEME.colors.textSecondary,
    fontSize: width * 0.038,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default styles;
