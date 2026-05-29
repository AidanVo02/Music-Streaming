
import { StyleSheet, Dimensions } from 'react-native';

const ORANGE = '#ff8000';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: width * 0,
    width: '100%',
    height: '100%',
  },
  profireSpace: {
    height: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  logoText: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: width * 0.05,
    letterSpacing: 1.5,
    fontStyle: 'italic',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: width * 0.05,
  },
  profileImage: {
    width: width * 0.26,
    height: width * 0.26,
    borderRadius: width * 0.13,
    borderWidth: 2,
    borderColor: ORANGE,
    marginBottom: width * 0.025,
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
    backgroundColor: '#222',
    borderRadius: width * 0.025,
    padding: width * 0.04,
    marginBottom: width * 0.025,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  parameterLabel: {
    color: '#aaa',
    fontSize: width * 0.035,
  },
  parameterValue: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  storageBar: {
    height: width * 0.025,
    borderRadius: width * 0.012,
    backgroundColor: '#333',
    overflow: 'hidden',
    marginTop: width * 0.02,
  },
  storageFill: {
    height: '100%',
    backgroundColor: ORANGE,
  },
  signalClustersSection: {
    marginVertical: width * 0.05,
  },
  clusterCard: {
    backgroundColor: '#222',
    borderRadius: width * 0.025,
    padding: width * 0.04,
    marginBottom: width * 0.025,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clusterIcon: {
    marginRight: width * 0.04,
  },
  clusterImage: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: width * 0.03,
    marginRight: width * 0.04,
  },
  clusterDetails: {
    flex: 1,
  },
  clusterTitle: {
    color: '#fff',
    fontSize: width * 0.042,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clusterSubtitle: {
    color: '#aaa',
    fontSize: width * 0.032,
  },
  becomeArtistBanner: {
    marginHorizontal: width * 0.05,
    marginVertical: width * 0.04,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: ORANGE,
    borderRadius: width * 0.025,
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
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editAvatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  editAvatarImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333',
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
    color: '#aaa',
    fontSize: 12,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
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
    borderRadius: 8,
    backgroundColor: '#333',
  },
  cancelBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  saveBtnText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default styles;