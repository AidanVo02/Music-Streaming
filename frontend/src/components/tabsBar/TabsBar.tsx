import React from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useAuthContext } from '@/src/context/AuthContext';

const { width } = Dimensions.get('window');
const ORANGE = '#ff8000';

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
    icon: (focused) => <Ionicons name={focused ? 'home' : 'home-outline'} size={width * 0.065} color={focused ? ORANGE : '#aaa'} />,
  },
  {
    name: 'discovery',
    label: 'Discovery',
    icon: (focused) => <Ionicons name={focused ? 'compass' : 'compass-outline'} size={width * 0.065} color={focused ? ORANGE : '#aaa'} />,
  },
  {
    name: 'library',
    label: 'Library',
    icon: (focused) => <Ionicons name={focused ? 'albums' : 'albums-outline'} size={width * 0.065} color={focused ? ORANGE : '#aaa'} />,
  },
  {
    name: 'upload',
    label: 'Upload',
    requireAuth: true,
    requireRole: ['artist', 'admin'],
    icon: (focused) => <Ionicons name={focused ? 'cloud-upload' : 'cloud-upload-outline'} size={width * 0.065} color={focused ? ORANGE : '#aaa'} />,
  },
  {
    name: 'user',
    label: 'Profile',
    requireAuth: true,
    icon: (focused) => <Ionicons name={focused ? 'person' : 'person-outline'} size={width * 0.065} color={focused ? ORANGE : '#aaa'} />,
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
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
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
    }}>
      {visibleTabs.map((tab) => {
        const isFocused = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: width * 0.01 }}
            onPress={() => handleTabPress(tab.name)}
          >
            {tab.icon(isFocused)}
            <Text style={{
              fontSize: width * 0.025,
              fontWeight: '600',
              letterSpacing: 1.1,
              marginTop: 2,
              color: isFocused ? ORANGE : '#aaa',
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabsBar;
