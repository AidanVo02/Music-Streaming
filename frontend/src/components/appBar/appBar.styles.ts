import { StyleSheet } from "react-native";
const ORANGE = '#ff8000';

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: '#181818',
    elevation: 4,
  },
  logoText: {
    color: ORANGE,
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 1.5,
    fontStyle: 'italic',
  },
  loginText: {
    color: '#aaa',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 1.2,
  },
});

export default styles;