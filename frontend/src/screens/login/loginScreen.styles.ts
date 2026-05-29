import { StyleSheet } from "react-native";

const ORANGE = '#ff8000';


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', justifyContent: 'center' },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 4,
  },
  logoText: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: 26,
    letterSpacing: 1.5,
    fontStyle: 'italic',
  },
  logoUnderline: {
    width: 60,
    height: 3,
    backgroundColor: ORANGE,
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 18,
  },
  loginBox: {
    backgroundColor: '#181818',
    marginHorizontal: 24,
    borderRadius: 18,
    padding: 28,
    elevation: 8,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 6,
  },
  subtitle: {
    color: '#bdbdbd',
    fontSize: 13,
    letterSpacing: 1.1,
    marginBottom: 18,
  },
  label: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 16,
    marginBottom: 4,
    letterSpacing: 1.1,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 2,
    fontWeight: 'bold',
    letterSpacing: 1.1,
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
    backgroundColor: ORANGE,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 28,
    marginBottom: 10,
    shadowColor: ORANGE,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: '#181818',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1.2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ORANGE,
    marginRight: 8,
  },
  statusText: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 12,
  },
  statusTextDim: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: 'bold',
  },
  createAccountBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
  },
  createAccountText: {
    color: '#aaa',
    fontSize: 14,
  },
  createAccountLink: {
    color: ORANGE,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default styles;
