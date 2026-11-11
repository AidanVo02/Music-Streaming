import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './appBar.styles';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/src/context/AuthContext';
import THEME from '@/src/constants/theme';

const AppBar = () => {
  const router = useRouter();
  const { user } = useAuthContext();

  return (
    <View style={styles.appBar}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="radio-outline" size={22} color={THEME.colors.accent} style={{ marginRight: 8 }} />
        <Text style={styles.logoText}>
          SIGNAL <Text style={styles.logoAccent}>ONYX</Text>
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push(user ? '/(tabs)/user' : '/login')}
        style={styles.loginBtn}
        activeOpacity={0.8}
      >
        {user ? (
          <Image
            source={{ uri: user?.profile_pic_url || `https://ui-avatars.com/api/?name=${user?.display_name || user?.username || 'U'}&background=FF6E44&color=fff&size=100` }}
            style={{ width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: THEME.colors.accent }}
          />
        ) : (
          <>
            <Ionicons name="log-in-outline" size={16} color={THEME.colors.textSecondary} />
            <Text style={styles.loginText}>SIGN IN</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AppBar;