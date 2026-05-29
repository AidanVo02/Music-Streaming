import { StyleSheet } from "react-native";

const ORANGE = '#ff8000';


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', paddingTop: 48 },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  logoText: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: 26,
    letterSpacing: 1.5,
    fontStyle: 'italic',
  },
  protocol: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 1.2,
    marginLeft: 32,
    marginBottom: 2,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 32,
    marginLeft: 32,
    marginBottom: 6,
    lineHeight: 34,
  },
  subtitle: {
    color: '#bdbdbd',
    fontSize: 14,
    marginLeft: 32,
    marginBottom: 18,
    marginRight: 32,
  },
  form: {
    backgroundColor: '#181818',
    marginHorizontal: 24,
    borderRadius: 18,
    padding: 24,
    elevation: 8,
  },
  label: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 16,
    marginBottom: 4,
    letterSpacing: 1.1,
  },
  keyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  keyEnc: {
    color: '#aaa',
    fontSize: 11,
    fontWeight: 'bold',
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
  clearanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  clearanceBarWrap: {
    height: 6,
    backgroundColor: '#222',
    borderRadius: 3,
    marginBottom: 2,
    overflow: 'hidden',
  },
  clearanceBar: {
    width: '40%',
    height: 6,
    backgroundColor: ORANGE,
    borderRadius: 3,
  },
  clearanceText: {
    color: ORANGE,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.1,
  },
  joinBtn: {
    backgroundColor: ORANGE,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 18,
    marginBottom: 2,
    shadowColor: ORANGE,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  joinBtnText: {
    color: '#181818',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1.2,
  },
  terms: {
    color: '#bdbdbd',
    fontSize: 12,
    marginTop: 24,
    marginHorizontal: 32,
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default styles;