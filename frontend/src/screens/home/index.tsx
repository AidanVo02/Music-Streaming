import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './homeScreen.styles';
import AppBar from '../../components/appBar';
import TabsBar from '@/src/components/tabsBar/TabsBar';

import { useDiscovery } from '@/src/hooks/useDiscovery';
import { useArtists } from '@/src/hooks/useArtists';
import { usePublicPlaylists } from '@/src/hooks/usePlaylists';
import { usePlayer } from '@/src/context/PlayerContext';
import { useQueue } from '@/src/context/QueueContext';

const { width } = Dimensions.get('window');
const ORANGE = '#ff8000';

export default function HomeScreen() {
  const { topTracks, loading: tracksLoading } = useDiscovery();
  const { artists, loading: artistsLoading } = useArtists();
  const { playlists, loading: playlistsLoading } = usePublicPlaylists(10);
  const { playTrack } = usePlayer();
  const { addToQueueAndPlay } = useQueue();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handlePlayTrack = (track: any) => {
    const playerTrack = {
      track_id: track.track_id,
      title: track.title,
      cover_image_url: track.cover_image_url,
      audio_url: track.audio_url,
    };
    
    const trackToPlay = addToQueueAndPlay(playerTrack);
    playTrack(trackToPlay);
  };

  const navigateToArtist = (artistId: number) => {
    router.push(`/artist/${artistId}` as any);
  };

  const navigateToPlaylist = (playlistId: number) => {
    router.push(`/playlist/${playlistId}` as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppBar />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: width * 0.25 }}>
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>{greeting}</Text>
        </View>

        {/* Hero Banner (Featured / New Release) */}
        {topTracks.length > 0 && (
          <TouchableOpacity 
            style={styles.banner} 
            activeOpacity={0.9}
            onPress={() => handlePlayTrack(topTracks[0])}
          >
            <Image 
              source={{ uri: topTracks[0].cover_image_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80' }} 
              style={styles.bannerImg} 
            />
            <View style={styles.bannerOverlay} />
            <View style={styles.bannerContent}>
              <Text style={styles.featuredLabel}>NEW RELEASE</Text>
              <Text style={styles.bannerTitle} numberOfLines={2}>{topTracks[0].title}</Text>
              <Text style={styles.bannerDesc}>Trending now</Text>
              <View style={styles.listenBtn}>
                <Text style={styles.listenBtnText}>Listen Now</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Trending Tracks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Tracks</Text>
          </View>
          {tracksLoading ? (
            <ActivityIndicator color={ORANGE} style={{ padding: 20 }} />
          ) : topTracks.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContentContainer}>
              {topTracks.map((track) => (
                <TouchableOpacity 
                  key={`track-${track.track_id}`} 
                  style={styles.trackCard}
                  onPress={() => handlePlayTrack(track)}
                >
                  <Image 
                    source={{ uri: track.cover_image_url || 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' }} 
                    style={styles.trackImg} 
                  />
                  <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                  <Text style={styles.trackSub} numberOfLines={1}>{track.genre || 'Various'}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
             <Text style={styles.emptyText}>No tracks available right now.</Text>
          )}
        </View>

        {/* Top Artists */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Artists</Text>
          </View>
          {artistsLoading ? (
            <ActivityIndicator color={ORANGE} style={{ padding: 20 }} />
          ) : artists.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContentContainer}>
              {artists.map((artist) => (
                <TouchableOpacity 
                  key={`artist-${artist.artist_id || artist.id}`} 
                  style={styles.artistCard}
                  onPress={() => navigateToArtist(artist.artist_id || artist.id)}
                >
                  <Image 
                    source={{ uri: artist.image_url || 'https://via.placeholder.com/150' }} 
                    style={styles.artistImg} 
                  />
                  <Text style={styles.artistName} numberOfLines={2}>{artist.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>No artists available right now.</Text>
          )}
        </View>

        {/* Featured Playlists */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Playlists</Text>
          </View>
          {playlistsLoading ? (
            <ActivityIndicator color={ORANGE} style={{ padding: 20 }} />
          ) : playlists.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContentContainer}>
              {playlists.map((playlist) => (
                <TouchableOpacity 
                  key={`playlist-${playlist.playlist_id}`} 
                  style={styles.playlistCard}
                  onPress={() => navigateToPlaylist(playlist.playlist_id)}
                >
                  <Image 
                    source={{ uri: playlist.cover_image_url || 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80' }} 
                    style={styles.playlistImg} 
                  />
                  <Text style={styles.playlistTitle} numberOfLines={1}>{playlist.name}</Text>
                  <Text style={styles.playlistSub}>{playlist.track_count} tracks</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>No playlists available right now.</Text>
          )}
        </View>
        
        <View style={{ height: 20 }} />
      </ScrollView>

      <TabsBar />
    </SafeAreaView>
  );
}
