import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from './appBar.styles';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/src/context/AuthContext';

const ORANGE = '#ff8000';

const AppBar = () => {
  const router = useRouter();
  const { user } = useAuthContext();

  return (
    <View style={styles.appBar}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="barcode" size={24} color={ORANGE} style={{ marginRight: 8 }} />
        <Text style={styles.logoText}>SIGNAL ONYX</Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push(user ? '/(tabs)/user' : '/login')}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
      >
        {user ? (
          <Image
            source={{ uri: user?.profile_pic_url || `https://ui-avatars.com/api/?name=${user?.display_name || user?.username || 'U'}&background=ff8000&color=fff&size=100` }}
            style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: ORANGE }}
          />
        ) : (
          <>
            <Ionicons name="log-in-outline" size={20} color="#aaa" />
            <Text style={styles.loginText}>LOGIN</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AppBar;