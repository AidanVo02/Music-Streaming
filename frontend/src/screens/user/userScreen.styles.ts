
import { StyleSheet, Dimensions } from 'react-native';
import THEME from '@/src/constants/theme';

const ORANGE = THEME.colors.accent;
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 0,
    width: '100%',
    height: '100%',
  },
  profireSpace: {
    height: height * 0.02,
    paddingHorizontal: 20,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  logoText: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 2,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: THEME.colors.borderHighlight,
    marginBottom: 10,
  },
  username: {
    color: '#fff',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRole: {
    color: ORANGE,
    fontSize: width * 0.035,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  parametersSection: {
    marginVertical: width * 0.05,
  },
  parameterCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.radii.md,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  parameterLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
  },
  parameterValue: {
    color: THEME.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  storageBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.surfaceHover,
    overflow: 'hidden',
    marginTop: 8,
  },
  storageFill: {
    height: '100%',
    backgroundColor: ORANGE,
  },
  signalClustersSection: {
    marginVertical: width * 0.05,
  },
  clusterCard: {
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.radii.lg,
    padding: width * 0.04,
    marginBottom: width * 0.025,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  clusterIcon: {
    marginRight: width * 0.04,
  },
  clusterImage: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: THEME.radii.md,
    marginRight: width * 0.04,
  },
  clusterDetails: {
    flex: 1,
  },
  clusterTitle: {
    color: THEME.colors.textPrimary,
    fontSize: width * 0.042,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clusterSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: width * 0.032,
  },
  becomeArtistBanner: {
    marginHorizontal: width * 0.05,
    marginVertical: width * 0.04,
    backgroundColor: THEME.colors.surfaceCard,
    borderWidth: 1,
    borderColor: THEME.colors.borderActive,
    borderRadius: THEME.radii.lg,
    padding: width * 0.04,
  },
  becomeArtistContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
  },
  becomeArtistText: {
    flex: 1,
  },
  becomeArtistTitle: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  becomeArtistSubtitle: {
    color: ORANGE,
    fontSize: width * 0.035,
    fontWeight: '600',
  },

  // Edit Profile Styles
  editProfileBtn: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#555',
  },
  editProfileText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.radii.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: THEME.colors.borderHighlight,
    ...THEME.shadows.floating,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  editAvatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  editAvatarImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  editAvatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: ORANGE,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: THEME.colors.surfaceHover,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radii.md,
    color: THEME.colors.textPrimary,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: THEME.radii.full,
    backgroundColor: THEME.colors.surfaceHover,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  cancelBtnText: {
    color: THEME.colors.textSecondary,
    fontWeight: '700',
  },
  saveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: THEME.radii.full,
    backgroundColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    ...THEME.shadows.glow,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default styles;