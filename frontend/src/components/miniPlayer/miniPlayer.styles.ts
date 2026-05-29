import { StyleSheet, Dimensions } from 'react-native';

const ORANGE = '#ff8000';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    miniMixCard: {
    flex: 1,
    marginRight: width * 0.025,
    backgroundColor: '#181818',
    borderRadius: 10,
    alignItems: 'center',
    padding: width * 0.02,
  },
  miniMixImg: {
    width: width * 0.16,
    height: width * 0.16,
    borderRadius: 8,
    marginBottom: 4,
  },
  miniMixTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.032,
    textAlign: 'center',
  },
  miniPlayer: {
    position: 'absolute',
    left: width * 0.04,
    right: width * 0.04,
    bottom: 70,
    backgroundColor: '#181818',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.03,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  miniPlayerImg: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 8,
  },
  miniPlayerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  miniPlayerSub: {
    color: ORANGE,
    fontSize: width * 0.03,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default styles;