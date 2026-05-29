import styles from "./miniPlayer.styles";
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ORANGE = '#ff8000';

export default function MiniPlayer() {
  return (
    <View style={styles.miniPlayer}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80' }} style={styles.miniPlayerImg} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.miniPlayerTitle}>Echoes of Darkness</Text>
          <Text style={styles.miniPlayerSub}>NOW MASTERING</Text>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="pause" size={28} color={ORANGE} />
        </TouchableOpacity>
      </View>
  );
};