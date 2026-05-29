import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet,
  Dimensions, ActivityIndicator, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMyPlaylists, usePlaylistActions } from '@/src/hooks/usePlaylists';

const { width } = Dimensions.get('window');
const ORANGE = '#ff8000';

interface AddToPlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  trackId: number;
  trackTitle?: string;
}

export default function AddToPlaylistModal({
  visible,
  onClose,
  trackId,
  trackTitle,
}: AddToPlaylistModalProps) {
  const { playlists, loading, refetch } = useMyPlaylists();
  const { addTrackToPlaylist } = usePlaylistActions();
  const [addingToId, setAddingToId] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      refetch();
    }
  }, [visible]);

  const handleAddToPlaylist = async (playlistId: number, playlistName: string) => {
    try {
      setAddingToId(playlistId);
      await addTrackToPlaylist(playlistId, trackId);
      Alert.alert('Success', `Added to "${playlistName}"`);
      onClose();
    } catch (error: any) {
      if (error.message?.includes('already')) {
        Alert.alert('Info', 'Track already in this playlist');
      } else {
        Alert.alert('Error', 'Failed to add track to playlist');
      }
    } finally {
      setAddingToId(null);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>ADD TO PLAYLIST</Text>
              {trackTitle && (
                <Text style={styles.subtitle} numberOfLines={1}>
                  {trackTitle}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={28} color="#aaa" />
            </TouchableOpacity>
          </View>

          {/* Playlists List */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={ORANGE} />
              </View>
            ) : playlists.length > 0 ? (
              playlists.map((playlist) => (
                <TouchableOpacity
                  key={playlist.playlist_id}
                  style={styles.playlistItem}
                  onPress={() => handleAddToPlaylist(playlist.playlist_id, playlist.name)}
                  disabled={addingToId === playlist.playlist_id}
                >
                  <View style={styles.playlistIcon}>
                    <Ionicons name="musical-notes" size={24} color={ORANGE} />
                  </View>
                  <View style={styles.playlistInfo}>
                    <Text style={styles.playlistName} numberOfLines={1}>
                      {playlist.name}
                    </Text>
                    <Text style={styles.playlistMeta}>
                      {playlist.track_count} {playlist.track_count === 1 ? 'track' : 'tracks'}
                      {!playlist.is_public && ' • Private'}
                    </Text>
                  </View>
                  {addingToId === playlist.playlist_id ? (
                    <ActivityIndicator size="small" color={ORANGE} />
                  ) : (
                    <Ionicons name="add-circle-outline" size={28} color="#666" />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="musical-notes-outline" size={48} color="#555" />
                <Text style={styles.emptyText}>No playlists yet</Text>
                <Text style={styles.emptyHint}>Create a playlist in Library</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: width * 0.05,
    borderTopRightRadius: width * 0.05,
    maxHeight: '80%',
    paddingBottom: width * 0.05,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    gap: width * 0.03,
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: width * 0.032,
    color: '#888',
    marginTop: 4,
    fontWeight: '600',
  },
  list: {
    maxHeight: width * 1.2,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: width * 0.15,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04,
    gap: width * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  playlistIcon: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.02,
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistInfo: {
    flex: 1,
    gap: 3,
  },
  playlistName: {
    fontSize: width * 0.04,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  playlistMeta: {
    fontSize: width * 0.03,
    color: '#666',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: width * 0.15,
    gap: width * 0.03,
  },
  emptyText: {
    fontSize: width * 0.04,
    color: '#888',
    fontWeight: '700',
  },
  emptyHint: {
    fontSize: width * 0.032,
    color: '#555',
    fontWeight: '600',
  },
});
