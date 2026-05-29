import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePlayer } from '@/src/context/PlayerContext';
import AppBar from '@/src/components/appBar';
import TabsBar from '@/src/components/tabsBar/TabsBar';
import styles from './HistoryScreen.styles';
import { PlayerTrack } from '@/src/context/PlayerContext';

const { width } = Dimensions.get('window');
const ORANGE = '#ff8000';
const FALLBACK = 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=200&q=60';

const HistoryScreen = () => {
  const router = useRouter();
  const player = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');

  // Reverse history so newest is at the top
  const historyList = useMemo(() => {
    return [...player.history].reverse();
  }, [player.history]);

  // Filter history based on search query
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return historyList;
    const lowerQuery = searchQuery.toLowerCase();
    return historyList.filter((track) => {
      const matchTitle = track.title?.toLowerCase().includes(lowerQuery);
      const matchArtist = track.originator?.toLowerCase().includes(lowerQuery);
      return matchTitle || matchArtist;
    });
  }, [historyList, searchQuery]);

  const handlePlayTrack = async (track: PlayerTrack) => {
    try {
      await player.playTrack(track);
    } catch (e) {
      console.error('Error playing track from history:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppBar />

      {/* Header and Search */}
      <View>
        <Text style={styles.title}>LISTENING HISTORY</Text>
        
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={width * 0.05} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search in history..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={width * 0.05} color="#aaa" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredHistory.length > 0 ? (
          filteredHistory.map((track, index) => {
            const isPlaying = player.currentTrack?.track_id === track.track_id && player.isPlaying;
            return (
              <TouchableOpacity
                key={`${track.track_id}-${index}`}
                style={styles.trackItem}
                onPress={() => handlePlayTrack(track)}
              >
                <View style={styles.trackContent}>
                  <Image
                    source={{ uri: track.cover_image_url || FALLBACK }}
                    style={styles.cover}
                  />
                  <View style={styles.info}>
                    <Text 
                      style={[styles.trackTitle, isPlaying && { color: ORANGE }]} 
                      numberOfLines={1}
                    >
                      {track.title}
                    </Text>
                    <Text style={styles.trackArtist} numberOfLines={1}>
                      {track.originator || 'Unknown Artist'}
                    </Text>
                  </View>
                </View>

                {isPlaying ? (
                  <Ionicons name="pause-circle" size={width * 0.07} color={ORANGE} />
                ) : (
                  <Ionicons name="play-circle-outline" size={width * 0.07} color="#666" />
                )}
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={width * 0.15} color="#333" />
            <Text style={styles.emptyText}>
              {searchQuery ? "No matching tracks found." : "You haven't listened to anything yet."}
            </Text>
          </View>
        )}
      </ScrollView>

      <TabsBar />

    </SafeAreaView>
  );
};

export default HistoryScreen;
