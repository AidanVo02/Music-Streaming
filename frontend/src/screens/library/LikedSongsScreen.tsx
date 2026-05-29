import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePlayer } from '@/src/context/PlayerContext';
import AppBar from '@/src/components/appBar';
import TabsBar from '@/src/components/tabsBar/TabsBar';
import styles from './LikedSongsScreen.styles';
import ApiService from '@/src/server/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerTrack } from '@/src/context/PlayerContext';
import { useLikes } from '@/src/context/LikeContext';

const { width } = Dimensions.get('window');
const ORANGE = '#ff8000';
const FALLBACK = 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=200&q=60';

const LikedSongsScreen = () => {
  const router = useRouter();
  const player = usePlayer();
  const { isLiked, loading: likesLoading } = useLikes();
  const [searchQuery, setSearchQuery] = useState('');
  const [likedTracks, setLikedTracks] = useState<PlayerTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchLiked = async () => {
      try {
        const token = await AsyncStorage.getItem('@signal_onyx_token');
        const res = await ApiService.request('/api/likes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res?.success && mounted) {
          setLikedTracks(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch liked tracks:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchLiked();
    return () => { mounted = false; };
  }, []);

  // Use useMemo and filter out tracks that might have been unliked during session
  const filteredTracks = useMemo(() => {
    // Only show tracks that are STILL liked in Context to provide instant UX
    const actualLiked = likedTracks.filter(t => !likesLoading ? isLiked(t.track_id) : true);
    
    if (!searchQuery.trim()) return actualLiked;
    
    const lowerQuery = searchQuery.toLowerCase();
    return actualLiked.filter((track) => {
      const matchTitle = track.title?.toLowerCase().includes(lowerQuery);
      const matchArtist = track.originator?.toLowerCase().includes(lowerQuery);
      return matchTitle || matchArtist;
    });
  }, [likedTracks, searchQuery, isLiked, likesLoading]);

  const handlePlayTrack = async (track: PlayerTrack) => {
    try {
      await player.playTrack(track);
    } catch (e) {
      console.error('Error playing track from library:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppBar />

      <View>
        <Text style={styles.title}>LIKED SONGS</Text>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={width * 0.05} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search favorite songs..."
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

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={ORANGE} />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track, index) => {
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
              <Ionicons name="heart-dislike-outline" size={width * 0.15} color="#333" />
              <Text style={styles.emptyText}>
                {searchQuery ? "No matching liked tracks found." : "You haven't liked any tracks yet."}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <TabsBar />
    </SafeAreaView>
  );
};

export default LikedSongsScreen;
