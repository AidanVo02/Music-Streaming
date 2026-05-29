import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const ORANGE = '#ff8000';
const BG_COLOR = '#0a0a0a';
const CARD_BG = '#1a1a1a';
const BORDER_COLOR = '#333';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },

  /* Inject Signal Section */
  injectSection: {
    marginHorizontal: width * 0.05,
    marginVertical: width * 0.08,
    alignItems: 'center',
  },

  injectBox: {
    width: width * 0.85,
    height: width * 0.85,
    borderWidth: 2,
    borderColor: ORANGE,
    borderRadius: width * 0.1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: width * 0.05,
  },

  injectText: {
    fontSize: width * 0.055,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: width * 0.02,
  },

  injectSubtext: {
    fontSize: width * 0.03,
    color: '#666',
    letterSpacing: 1.5,
  },

  /* Section Styling */
  section: {
    marginHorizontal: width * 0.05,
    marginVertical: width * 0.06,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: width * 0.04,
  },

  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
  },

  stepLabel: {
    fontSize: width * 0.035,
    color: ORANGE,
    fontWeight: '700',
    letterSpacing: 1,
  },

  /* Metadata Form */
  metadataForm: {
    backgroundColor: CARD_BG,
    borderRadius: width * 0.03,
    padding: width * 0.04,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },

  inputGroup: {
    marginBottom: width * 0.05,
  },

  inputLabel: {
    fontSize: width * 0.03,
    color: '#888',
    letterSpacing: 1,
    marginBottom: width * 0.02,
    fontWeight: '600',
  },

  textInput: {
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    color: '#fff',
    fontSize: width * 0.04,
    paddingVertical: width * 0.03,
    paddingHorizontal: 0,
    letterSpacing: 0.5,
  },

  /* Mastering Chain */
  chainGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: width * 0.04,
    gap: width * 0.03,
  },

  chainCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: width * 0.03,
    padding: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chainCardActive: {
    borderColor: ORANGE,
    backgroundColor: '#2a1a0a',
  },

  chainIcon: {
    fontSize: width * 0.1,
    marginBottom: width * 0.02,
  },

  chainName: {
    fontSize: width * 0.03,
    fontWeight: '700',
    color: '#aaa',
    letterSpacing: 1,
    marginBottom: width * 0.01,
    textAlign: 'center',
  },

  chainDesc: {
    fontSize: width * 0.025,
    color: '#666',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  /* Chain Item */
  chainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: width * 0.02,
    padding: width * 0.04,
    marginBottom: width * 0.04,
  },

  chainItemActive: {
    borderColor: ORANGE,
    backgroundColor: '#2a1a0a',
  },

  chainItemIcon: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.03,
  },

  chainItemContent: {
    flex: 1,
  },

  chainItemName: {
    fontSize: width * 0.035,
    fontWeight: '700',
    color: '#aaa',
    letterSpacing: 1,
    marginBottom: width * 0.005,
  },

  chainItemDesc: {
    fontSize: width * 0.03,
    color: '#666',
    letterSpacing: 0.5,
  },

  /* Signal Chain Analysis */
  analysisBox: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: width * 0.03,
    padding: width * 0.04,
    marginBottom: width * 0.05,
  },

  analysisLabel: {
    fontSize: width * 0.03,
    color: '#666',
    letterSpacing: 1.5,
    marginBottom: width * 0.02,
    fontWeight: '600',
  },

  analysisBadge: {
    position: 'absolute',
    top: width * 0.03,
    right: width * 0.03,
    backgroundColor: ORANGE,
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.01,
    borderRadius: width * 0.02,
  },

  analysisBadgeText: {
    fontSize: width * 0.025,
    color: '#000',
    fontWeight: '700',
    letterSpacing: 1,
  },

  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: width * 0.35,
    marginVertical: width * 0.04,
    gap: width * 0.01,
  },

  bar: {
    flex: 1,
    borderRadius: width * 0.01,
    minHeight: width * 0.02,
  },

  frequencyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: width * 0.02,
  },

  freqLabel: {
    fontSize: width * 0.025,
    color: '#666',
    letterSpacing: 0.5,
  },

  /* Cover Image Picker */
  imagePicker: {
    width: '100%',
    height: width * 0.45,
    borderRadius: width * 0.03,
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#333',
    borderStyle: 'dashed',
    marginTop: width * 0.01,
    position: 'relative',
  },
  imagePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: width * 0.02,
  },
  removeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.015,
    paddingHorizontal: width * 0.025,
    paddingVertical: width * 0.015,
    backgroundColor: '#2a1515',
    borderRadius: width * 0.015,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  removeImageText: {
    color: '#ff4444',
    fontSize: width * 0.028,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePickerPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.02,
  },
  imagePickerText: {
    color: '#555',
    fontSize: width * 0.03,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  imageChangeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingVertical: width * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: width * 0.02,
  },
  imageChangeText: {
    color: '#fff',
    fontSize: width * 0.032,
    fontWeight: '700',
    letterSpacing: 1,
  },

  /* Master Button */
  masterButton: {
    backgroundColor: ORANGE,
    marginHorizontal: width * 0.05,
    marginVertical: width * 0.04,
    paddingVertical: width * 0.05,
    borderRadius: width * 0.02,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: width * 0.02,
  },

  masterButtonText: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1.5,
  },


  // Genre Picker Button
  genrePickerButton: {
    marginTop: width * 0.03,
  },
  // Progress Indicator
  progressContainer: {
    marginHorizontal: width * 0.05,
    marginVertical: width * 0.04,
    padding: width * 0.04,
    backgroundColor: '#1a1a1a',
    borderRadius: width * 0.025,
    borderWidth: 1,
    borderColor: ORANGE,
  },
  progressLabel: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: 'bold',
    marginBottom: width * 0.02,
    textAlign: 'center',
  },
  progressBar: {
    height: width * 0.02,
    backgroundColor: '#333',
    borderRadius: width * 0.01,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ORANGE,
  },
  // Error Container
  errorContainer: {
    marginHorizontal: width * 0.05,
    marginVertical: width * 0.02,
    padding: width * 0.04,
    backgroundColor: '#2a1515',
    borderRadius: width * 0.025,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: width * 0.035,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#181818',
    borderTopLeftRadius: width * 0.05,
    borderTopRightRadius: width * 0.05,
    paddingBottom: width * 0.1,
    maxHeight: height * 0.75,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: ORANGE,
    fontSize: width * 0.05,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  // Search Container
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    marginHorizontal: width * 0.05,
    marginVertical: width * 0.04,
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.03,
    borderRadius: width * 0.025,
    gap: width * 0.02,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  // Loading Container
  loadingContainer: {
    padding: width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#888',
    fontSize: width * 0.035,
    marginTop: width * 0.03,
  },
  // Genre Item
  genreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  genreItemSelected: {
    backgroundColor: '#2a2a2a',
  },
  genreItemText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  genreItemTextSelected: {
    color: ORANGE,
  },
  // Empty Container
  emptyContainer: {
    padding: width * 0.1,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: width * 0.04,
    fontStyle: 'italic',
  },
});