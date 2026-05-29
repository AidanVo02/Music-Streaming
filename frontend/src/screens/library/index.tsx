
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AppBar from '@/src/components/appBar';
import TabsBar from '@/src/components/tabsBar/TabsBar';
import CreatePlaylistModal from '@/src/components/CreatePlaylistModal';
import styles from './LibraryScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useArtists } from '@/src/hooks/useArtists';
import { useMyPlaylists, usePlaylistActions } from '@/src/hooks/usePlaylists';
import { useRouter } from 'expo-router';
import { useLikes } from '@/src/context/LikeContext';

const { width } = Dimensions.get('window');

const ORANGE = '#ff8000';
const tabs = ['PLAYLISTS', 'ARTISTS', 'ALBUMS'];

const LibraryScreen = () => {
  const [tab, setTab] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { artists, loading: artistsLoading, error: artistsError, refetch: refetchArtists } = useArtists();
  const { playlists, loading: playlistsLoading, error: playlistsError, refetch: refetchPlaylists } = useMyPlaylists();
  const { createPlaylist } = usePlaylistActions();
  const router = useRouter();
  const { likedTrackIds } = useLikes();

  const handleCreatePlaylist = async (name: string, description?: string) => {
    try {
      const newPlaylist = await createPlaylist({ name, description });
      await refetchPlaylists();
      router.push(`/playlist/${newPlaylist.playlist_id}` as any);
    } catch (err) {
      Alert.alert('Error', 'Failed to create playlist');
      throw err;
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins} min`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <AppBar />

      <ScrollView contentContainerStyle={{ paddingBottom: width * 0.25 }}>
        {/* Title */}
        <Text style={styles.title}>LIBRARY</Text>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {tabs.map((t, i) => (
            <TouchableOpacity key={t} onPress={() => setTab(i)} style={styles.tabBtn}>
              <Text style={[styles.tabText, tab === i && { color: ORANGE }]}> {t} </Text>
              {tab === i && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Big Card */}
        <TouchableOpacity
          style={styles.bigCard}
          onPress={() => router.push('/liked-songs' as any)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80' }} style={styles.bigCardImg} />
          <View style={styles.bigCardOverlay} />
          <View style={styles.bigCardContent}>
            <Text style={styles.collectionLabel}>COLLECTION</Text>
            <Text style={styles.bigCardTitle}>LIKED SONGS</Text>
            <Text style={styles.bigCardDesc}>{likedTrackIds.size} Records</Text>
          </View>
          <View style={styles.bigCardPlayBtn}>
            <MaterialIcons name="favorite" size={28} color={ORANGE} />
          </View>
        </TouchableOpacity>

        {/* Recent Studio Records */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: width * 0.05, marginBottom: width * 0.03 }}>
          <Text style={styles.sectionTitle}>
            {tab === 0 ? 'MY PLAYLISTS' : tab === 1 ? 'ALL ARTISTS' : 'RECENT STUDIO RECORDS'}
          </Text>
          {tab === 0 && (
            <TouchableOpacity onPress={() => setShowCreateModal(true)}>
              <Ionicons name="add-circle" size={width * 0.08} color={ORANGE} />
            </TouchableOpacity>
          )}
        </View>

        {/* Show Playlists when PLAYLISTS tab is selected */}
        {tab === 0 ? (
          <>
            {playlistsLoading ? (
              <View style={{ alignItems: 'center', marginVertical: width * 0.1 }}>
                <ActivityIndicator size="large" color={ORANGE} />
              </View>
            ) : playlistsError ? (
              <View style={{ alignItems: 'center', marginVertical: width * 0.1 }}>
                <Text style={{ color: '#aaa', fontSize: width * 0.04 }}>Error loading playlists</Text>
                <TouchableOpacity onPress={refetchPlaylists} style={{ marginTop: width * 0.05 }}>
                  <Text style={{ color: ORANGE, fontWeight: 'bold' }}>RETRY</Text>
                </TouchableOpacity>
              </View>
            ) : playlists.length > 0 ? (
              <FlatList
                data={playlists}
                keyExtractor={(item) => item.playlist_id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.recordRow}
                    activeOpacity={0.75}
                    onPress={() => router.push(`/playlist/${item.playlist_id}` as any)}
                  >
                    <Image
                      source={{ uri: item.cover_image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80' }}
                      style={styles.recordImg}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.recordTitle}>{item.name}</Text>
                      <Text style={styles.recordSub}>
                        {item.track_count} {item.track_count === 1 ? 'track' : 'tracks'}
                        {item.total_duration > 0 && ` • ${formatDuration(item.total_duration)}`}
                      </Text>
                    </View>
                    {!item.is_public && (
                      <Ionicons name="lock-closed" size={width * 0.045} color="#666" style={{ marginRight: width * 0.02 }} />
                    )}
                    <Ionicons name="arrow-forward" size={width * 0.05} color="#aaa" />
                  </TouchableOpacity>
                )}
                style={{ marginBottom: 0 }}
                scrollEnabled={false}
              />
            ) : (
              <View style={{ alignItems: 'center', marginVertical: width * 0.1 }}>
                <Ionicons name="musical-notes-outline" size={width * 0.15} color="#555" />
                <Text style={{ color: '#aaa', fontSize: width * 0.04, marginTop: width * 0.03 }}>No playlists yet</Text>
                <TouchableOpacity onPress={() => setShowCreateModal(true)} style={{ marginTop: width * 0.05, backgroundColor: ORANGE, paddingHorizontal: width * 0.08, paddingVertical: width * 0.03, borderRadius: width * 0.02 }}>
                  <Text style={{ color: '#000', fontWeight: 'bold', fontSize: width * 0.035 }}>CREATE PLAYLIST</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : tab === 1 ? (
          /* Show Artists when ARTISTS tab is selected */
          <>
            {artistsLoading ? (
              <View style={{ alignItems: 'center', marginVertical: width * 0.1 }}>
                <ActivityIndicator size="large" color={ORANGE} />
              </View>
            ) : artistsError ? (
              <View style={{ alignItems: 'center', marginVertical: width * 0.1 }}>
                <Text style={{ color: '#aaa', fontSize: width * 0.04 }}>Error loading artists</Text>
                <TouchableOpacity onPress={refetchArtists} style={{ marginTop: width * 0.05 }}>
                  <Text style={{ color: ORANGE, fontWeight: 'bold' }}>RETRY</Text>
                </TouchableOpacity>
              </View>
            ) : artists.length > 0 ? (
              <FlatList
                data={artists}
                keyExtractor={(item, index) => {
                  console.log('🔍 Artist item:', item);
                  return item?.id ? item.id.toString() : `artist-${index}`;
                }}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={styles.recordRow}
                    activeOpacity={0.75}
                    onPress={() => router.push(`/artist/${item.artist_id ?? item.id}`)}
                  >
                    <Image
                      source={{ uri: item.image_url || 'https://via.placeholder.com/50' }}
                      style={styles.recordImg}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.recordTitle}>{item.name}</Text>
                      <Text style={styles.recordSub}>{item.bio || 'Artist'}</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={width * 0.05} color="#aaa" />
                  </TouchableOpacity>
                )}
                style={{ marginBottom: 0 }}
                scrollEnabled={false}
              />
            ) : (
              <View style={{ alignItems: 'center', marginVertical: width * 0.1 }}>
                <Text style={{ color: '#aaa', fontSize: width * 0.04 }}>No artists found</Text>
              </View>
            )}
          </>
        ) : (
          /* Show default records for other tabs */
          <FlatList
            data={[
              {
                id: '1',
                title: 'Midnight Oscillations',
                artist: 'VECTOR THEORY',
                year: '2024',
                type: '24-BIT',
                img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
              },
              {
                id: '2',
                title: 'Analog Drift Vol. 4',
                artist: 'SILICON DREAM',
                year: '2023',
                type: '48KHZ',
                img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
              },
            ]}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.recordRow}>
                <Image source={{ uri: item.img }} style={styles.recordImg} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.recordTitle}>{item.title}</Text>
                  <Text style={styles.recordSub}>{item.artist} • {item.year}</Text>
                </View>
                <Text style={styles.recordType}>{item.type}</Text>
              </View>
            )}
            style={{ marginBottom: 0 }}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      {/* Custom TabsBar */}
      <TabsBar />

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreatePlaylist}
      />
    </SafeAreaView >
  );
};

export default LibraryScreen;
