import { Dimensions } from 'react-native';
import THEME from '@/src/constants/theme';

const { width } = Dimensions.get('window');

export const styles = {
  tabBarActiveTintColor: THEME.colors.accent,
  tabBarInactiveTintColor: THEME.colors.textMuted,
  tabBarStyle: {
    backgroundColor: THEME.colors.backgroundAlt,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
    ...THEME.shadows.diffuse,
  },
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  tabBarItemStyle: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 4,
  },
  headerShown: false,
};
