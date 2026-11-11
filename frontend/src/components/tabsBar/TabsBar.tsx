import React from 'react';
import { View, TouchableOpacity, Text, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useAuthContext } from '@/src/context/AuthContext';
import THEME from '@/src/constants/theme';

const { width } = Dimensions.get('window');

interface TabItem {
  name: string;
  label: string;
  requireAuth?: boolean;
  requireRole?: string[];
  icon: (focused: boolean) => React.ReactNode;
}

const tabs: TabItem[] = [
  {
    name: 'index',
    label: 'Home',
    icon: (focused) => (
      <Ionicons
        name={focused ? 'home' : 'home-outline'}
        size={22}
        color={focused ? THEME.colors.accent : THEME.colors.textMuted}
      />
    ),
  },
  {
    name: 'discovery',
    label: 'Discover',
    icon: (focused) => (
      <Ionicons
        name={focused ? 'compass' : 'compass-outline'}
        size={22}
        color={focused ? THEME.colors.accent : THEME.colors.textMuted}
      />
    ),
  },
  {
    name: 'library',
    label: 'Library',
    icon: (focused) => (
      <Ionicons
        name={focused ? 'musical-notes' : 'musical-notes-outline'}
        size={22}
        color={focused ? THEME.colors.accent : THEME.colors.textMuted}
      />
    ),
  },
  {
    name: 'upload',
    label: 'Upload',
    requireAuth: true,
    requireRole: ['artist', 'admin'],
    icon: (focused) => (
      <Ionicons
        name={focused ? 'cloud-upload' : 'cloud-upload-outline'}
        size={22}
        color={focused ? THEME.colors.accent : THEME.colors.textMuted}
      />
    ),
  },
  {
    name: 'user',
    label: 'Profile',
    requireAuth: true,
    icon: (focused) => (
      <Ionicons
        name={focused ? 'person' : 'person-outline'}
        size={22}
        color={focused ? THEME.colors.accent : THEME.colors.textMuted}
      />
    ),
  },
];

const TabsBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthContext();

  const visibleTabs = tabs.filter((t) => {
    if (t.requireAuth && !user) return false;
    if (t.requireRole && (!user || !t.requireRole.includes(user.role))) return false;
    return true;
  });

  const getActiveTab = () => {
    if (pathname.includes('discovery')) return 'discovery';
    if (pathname.includes('library')) return 'library';
    if (pathname.includes('upload')) return 'upload';
    if (pathname.includes('player')) return 'player';
    if (pathname.includes('user')) return 'user';
    return 'index';
  };

  const activeTab = getActiveTab();

  const handleTabPress = (tabName: string) => {
    if (tabName === 'index') {
      router.push('/(tabs)' as any);
    } else {
      router.push(`/(tabs)/${tabName}` as any);
    }
  };

  return (
    <View style={tabStyles.wrapper}>
      <View style={tabStyles.container}>
        {visibleTabs.map((tab) => {
          const isFocused = activeTab === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              style={[tabStyles.tabItem, isFocused && tabStyles.tabItemActive]}
              onPress={() => handleTabPress(tab.name)}
              activeOpacity={0.7}
            >
              {tab.icon(isFocused)}
              <Text
                style={[
                  tabStyles.tabLabel,
                  { color: isFocused ? THEME.colors.accent : THEME.colors.textMuted },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const tabStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: THEME.colors.background,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: THEME.colors.backgroundAlt,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    height: 64,
    paddingBottom: 6,
    paddingTop: 6,
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
    borderRadius: THEME.radii.sm,
  },
  tabItemActive: {
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 0.4,
    marginTop: 2,
  },
});

export default TabsBar;
