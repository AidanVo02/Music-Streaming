import React, { useState } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  ActivityIndicator, Alert, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AppBar from '@/src/components/appBar';
import TabsBar from '@/src/components/tabsBar/TabsBar';
import { usePlaylistDetail, usePlaylistActions } from '@/src/hooks/usePlaylists';
import { usePlayer } from '@/src/context/PlayerContext';
import { useAuthContext } from '@/src/context/AuthContext';
import styles from './playlistDetail.styles';

const { width } = Dimensions.get('window');
const ORANGE = '#ff8000';
const FALLBACK = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80';

export default function PlaylistDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuthContext();
  const { playlist, loading, error, refetch } = usePlaylistDetail(id as string);
  const { removeTrackFromPlaylist } = usePlaylistActions();
  const player = usePlayer();
  const [removingTrackId, setRemovingTrackId] = useState<number | null>(null);

  const isOwner = user && playlist && user.user_id === playlist.user_id;

  const handlePlayTrack = (track: any) => {
    player.playTrack({
      track_id: track.track_id,
      title: track.title,
      originator: track.artist_name,
      cover_image_url: track.cover_image_url,
      audio_url: track.audio_url,
      duration: track.duration,
      genre: track.genre,
    });
  };

  const handleRemoveTrack = async (trackId: number) => {
    if (!playlist) return;

    Alert.alert(
      'Remove Track',
      'Remove this track from playlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setRemovingTrackId(trackId);
              await removeTrackFromPlaylist(playlist.playlist_id, trackId);
              await refetch();
            } catch (err) {
              Alert.alert('Error', 'Failed to remove track');
            } finally {
              setRemovingTrackId(null);
            }
          },
        },
      ]
    );
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins} min`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <AppBar />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={ORANGE} />
        </View>
        <TabsBar />
      </SafeAreaView>
    );
  }

  if (error || !playlist) {
    return (
      <SafeAreaView style={styles.container}>
        <AppBar />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Playlist not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>RETRY</Text>
          </TouchableOpacity>
        </View>
        <TabsBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppBar />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: playlist.cover_image_url || FALLBACK }}
            style={styles.coverImage}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.playlistName}>{playlist.name}</Text>
            {playlist.description && (
              <Text style={styles.description}>{playlist.description}</Text>
            )}
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>
                {playlist.track_count} {playlist.track_count === 1 ? 'track' : 'tracks'}
              </Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>
                {formatTotalDuration(playlist.total_duration)}
              </Text>
              {!playlist.is_public && (
                <>
                  <Text style={styles.metaDot}>•</Text>
                  <Ionicons name="lock-closed" size={14} color="#888" />
                  <Text style={styles.metaText}>Private</Text>
                </>
              )}
            </View>
            <Text style={styles.creatorText}>
              by {playlist.display_name || playlist.username}
            </Text>
          </View>
        </View>

        {/* Actions */}
        {isOwner && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push(`/playlist/${id}/edit` as any)}
            >
              <MaterialIcons name="edit" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tracks */}
        <View style={styles.tracksSection}>
          <Text style={styles.sectionTitle}>TRACKS</Text>
          {playlist.tracks && playlist.tracks.length > 0 ? (
            playlist.tracks.map((track, index) => (
              <View key={track.track_id} style={styles.trackItem}>
                <TouchableOpacity
                  style={styles.trackMain}
                  onPress={() => handlePlayTrack(track)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.trackPosition}>{index + 1}</Text>
                  <Image
                    source={{ uri: track.cover_image_url || FALLBACK }}
                    style={styles.trackCover}
                  />
                  <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle} numberOfLines={1}>
                      {track.title}
                    </Text>
                    <Text style={styles.trackArtist} numberOfLines={1}>
                      {track.artist_name || 'Unknown Artist'}
                    </Text>
                  </View>
                  <Text style={styles.trackDuration}>
                    {formatDuration(track.duration)}
                  </Text>
                </TouchableOpacity>

                {isOwner && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveTrack(track.track_id)}
                    disabled={removingTrackId === track.track_id}
                  >
                    {removingTrackId === track.track_id ? (
                      <ActivityIndicator size="small" color="#ff4444" />
                    ) : (
                      <Ionicons name="close-circle" size={24} color="#ff4444" />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="musical-notes-outline" size={48} color="#555" />
              <Text style={styles.emptyText}>No tracks in this playlist</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TabsBar />
    </SafeAreaView>
  );
}
