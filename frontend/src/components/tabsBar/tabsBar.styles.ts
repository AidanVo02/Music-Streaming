import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = {
  tabBarActiveTintColor: '#ff8000',
  tabBarInactiveTintColor: '#aaa',
  tabBarStyle: {
    backgroundColor: '#181818',
    borderTopWidth: 1,
    borderTopColor: '#222',
    height: width * 0.18,
    paddingBottom: width * 0.015,
    paddingTop: width * 0.01,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarLabelStyle: {
    fontSize: width * 0.035,
    fontWeight: '600' as const,
    letterSpacing: 1.1,
    marginTop: 2,
  },
  tabBarItemStyle: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: width * 0.01,
  },
  headerShown: false,
};
