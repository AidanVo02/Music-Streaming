import { StyleSheet, Dimensions } from 'react-native';

const ORANGE = '#ff8000';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.08,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 2,
    borderBottomColor: ORANGE,
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
    color: '#666',
    fontSize: width * 0.03,
    marginBottom: width * 0.02,
    fontStyle: 'italic',
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.035,
    color: '#fff',
    fontSize: width * 0.04,
  },
  textArea: {
    height: width * 0.3,
    paddingTop: width * 0.035,
  },
  charCount: {
    color: '#666',
    fontSize: width * 0.028,
    textAlign: 'right',
    marginTop: width * 0.01,
  },
  requirementsBox: {
    backgroundColor: '#1a2a1a',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: width * 0.025,
    padding: width * 0.04,
    marginBottom: width * 0.04,
  },
  requirementsTitle: {
    color: '#4CAF50',
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
    color: '#aaa',
    fontSize: width * 0.035,
    flex: 1,
  },
  benefitsBox: {
    backgroundColor: '#2a1a0a',
    borderWidth: 1,
    borderColor: ORANGE,
    borderRadius: width * 0.025,
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
    color: '#aaa',
    fontSize: width * 0.035,
    flex: 1,
  },
  submitButton: {
    backgroundColor: ORANGE,
    marginHorizontal: width * 0.05,
    marginTop: width * 0.02,
    paddingVertical: width * 0.045,
    borderRadius: width * 0.02,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: width * 0.02,
  },
  submitButtonText: {
    color: '#000',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  cancelButton: {
    marginHorizontal: width * 0.05,
    marginTop: width * 0.03,
    paddingVertical: width * 0.04,
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: '#666',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: width * 0.038,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default styles;
