import React from 'react';
import {
  View, Text, Image, TouchableOpacity, Modal,
  StyleSheet, Dimensions, ScrollView, Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useQueue } from '@/src/context/QueueContext';
import { usePlayerQueue } from '@/src/hooks/usePlayerQueue';
import CreatePlaylistModal from './CreatePlaylistModal';
import { usePlaylistActions } from '@/src/hooks/usePlaylists';

const { width } = Dimensions.get('window');
const ORANGE = '#ff8000';
const FALLBACK = 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=200&q=60';

interface QueueModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function QueueModal({ visible, onClose }: QueueModalProps) {
  const queue = useQueue();
  const { playTrackAtIndex } = usePlayerQueue();
  const [showPlaylistModal, setShowPlaylistModal] = React.useState(false);
  const { createPlaylist, addTrackToPlaylist } = usePlaylistActions();

  const handleSaveAsPlaylist = async (name: string, description?: string) => {
    if (queue.queue.length === 0) {
      Alert.alert('Error', 'Queue is empty');
      return;
    }
    try {
      const newPlaylist = await createPlaylist({ name, description });
      
      // Add all tracks to new playlist sequentially
      for (const track of queue.queue) {
        await addTrackToPlaylist(newPlaylist.playlist_id, track.track_id);
      }
      
      Alert.alert('Success', 'Queue saved as playlist successfully!');
      setShowPlaylistModal(false);
    } catch (error) {
      console.error('Save queue as playlist error:', error);
      Alert.alert('Error', 'Failed to save queue as playlist');
    }
  };

  const handlePlayTrack = async (index: number) => {
    await playTrackAtIndex(index);
    onClose();
  };

  const handleRemoveTrack = (index: number) => {
    if (index === queue.currentIndex) {
      Alert.alert('Cannot Remove', 'Cannot remove currently playing track');
      return;
    }
    
    Alert.alert(
      'Remove Track',
      'Remove this track from queue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => queue.removeFromQueue(index),
        },
      ]
    );
  };

  const handleClearQueue = () => {
    Alert.alert(
      'Clear Queue',
      'Remove all tracks from queue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            queue.clearQueue();
            onClose();
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

  return (
    <>
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
              <Text style={styles.title}>QUEUE</Text>
              <Text style={styles.subtitle}>
                {queue.queue.length} {queue.queue.length === 1 ? 'track' : 'tracks'}
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: width * 0.02 }}>
              {queue.queue.length > 0 && (
                <TouchableOpacity onPress={() => setShowPlaylistModal(true)} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>SAVE AS PLAYLIST</Text>
                </TouchableOpacity>
              )}
              {queue.queue.length > 1 && (
                <TouchableOpacity onPress={handleClearQueue} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>CLEAR</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={28} color="#aaa" />
            </TouchableOpacity>
          </View>

          {/* Queue List */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {queue.queue.length > 0 ? (
              queue.queue.map((track, index) => {
                const isCurrent = index === queue.currentIndex;
                const isPast = index < queue.currentIndex;
                
                return (
                  <TouchableOpacity
                    key={`${track.track_id}-${index}`}
                    style={[
                      styles.trackItem,
                      isCurrent && styles.trackItemCurrent,
                      isPast && styles.trackItemPast,
                    ]}
                    onPress={() => handlePlayTrack(index)}
                    disabled={isCurrent}
                  >
                    {/* Position */}
                    <View style={styles.positionContainer}>
                      {isCurrent ? (
                        <Ionicons name="play" size={20} color={ORANGE} />
                      ) : (
                        <Text style={[styles.position, isPast && styles.positionPast]}>
                          {index + 1}
                        </Text>
                      )}
                    </View>

                    {/* Cover */}
                    <Image
                      source={{ uri: track.cover_image_url || FALLBACK }}
                      style={[styles.cover, isPast && styles.coverPast]}
                    />

                    {/* Info */}
                    <View style={styles.info}>
                      <Text
                        style={[
                          styles.trackTitle,
                          isCurrent && styles.trackTitleCurrent,
                          isPast && styles.trackTitlePast,
                        ]}
                        numberOfLines={1}
                      >
                        {track.title}
                      </Text>
                      <Text
                        style={[styles.trackArtist, isPast && styles.trackArtistPast]}
                        numberOfLines={1}
                      >
                        {track.originator || 'Unknown Artist'}
                      </Text>
                    </View>

                    {/* Duration */}
                    <Text style={[styles.duration, isPast && styles.durationPast]}>
                      {formatDuration(track.duration)}
                    </Text>

                    {/* Remove button */}
                    {!isCurrent && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveTrack(index)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="close-circle" size={24} color="#666" />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="musical-notes-outline" size={48} color="#555" />
                <Text style={styles.emptyText}>Queue is empty</Text>
              </View>
            )}
          </ScrollView>

          {/* Footer Info */}
          {queue.queue.length > 0 && (
            <View style={styles.footer}>
              <View style={styles.footerItem}>
                <Ionicons
                  name="shuffle"
                  size={16}
                  color={queue.shuffle ? ORANGE : '#666'}
                />
                <Text style={[styles.footerText, queue.shuffle && styles.footerTextActive]}>
                  Shuffle {queue.shuffle ? 'On' : 'Off'}
                </Text>
              </View>
              
              <View style={styles.footerDivider} />
              
              <View style={styles.footerItem}>
                <Ionicons
                  name={queue.repeat === 'one' ? 'repeat-outline' : 'repeat'}
                  size={16}
                  color={queue.repeat !== 'off' ? ORANGE : '#666'}
                />
                <Text style={[styles.footerText, queue.repeat !== 'off' && styles.footerTextActive]}>
                  Repeat {queue.repeat === 'off' ? 'Off' : queue.repeat === 'one' ? 'One' : 'All'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
    <CreatePlaylistModal
      visible={showPlaylistModal}
      onClose={() => setShowPlaylistModal(false)}
      onCreate={handleSaveAsPlaylist}
    />
    </>
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
    maxHeight: '85%',
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
    fontSize: width * 0.05,
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
  saveButton: {
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.02,
    backgroundColor: 'rgba(255, 128, 0, 0.1)',
    borderRadius: width * 0.015,
    borderWidth: 1,
    borderColor: '#ff8000',
  },
  saveButtonText: {
    color: '#ff8000',
    fontSize: width * 0.03,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  clearButton: {
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.02,
    backgroundColor: '#0d0d0d',
    borderRadius: width * 0.015,
    borderWidth: 1,
    borderColor: '#333',
  },
  clearButtonText: {
    color: '#ff4444',
    fontSize: width * 0.03,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  list: {
    maxHeight: width * 1.5,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.03,
    gap: width * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  trackItemCurrent: {
    backgroundColor: 'rgba(255, 128, 0, 0.1)',
  },
  trackItemPast: {
    opacity: 0.5,
  },
  positionContainer: {
    width: width * 0.08,
    alignItems: 'center',
  },
  position: {
    fontSize: width * 0.035,
    color: '#666',
    fontWeight: '700',
  },
  positionPast: {
    color: '#444',
  },
  cover: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.015,
    backgroundColor: '#333',
  },
  coverPast: {
    opacity: 0.6,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  trackTitle: {
    fontSize: width * 0.038,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  trackTitleCurrent: {
    color: ORANGE,
  },
  trackTitlePast: {
    color: '#888',
  },
  trackArtist: {
    fontSize: width * 0.032,
    color: '#888',
    fontWeight: '600',
  },
  trackArtistPast: {
    color: '#555',
  },
  duration: {
    fontSize: width * 0.032,
    color: '#666',
    fontWeight: '600',
    marginRight: width * 0.02,
  },
  durationPast: {
    color: '#444',
  },
  removeButton: {
    padding: width * 0.01,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: width * 0.2,
    gap: width * 0.03,
  },
  emptyText: {
    fontSize: width * 0.04,
    color: '#555',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
    paddingTop: width * 0.04,
    gap: width * 0.04,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  footerText: {
    fontSize: width * 0.03,
    color: '#666',
    fontWeight: '600',
  },
  footerTextActive: {
    color: ORANGE,
  },
  footerDivider: {
    width: 1,
    height: width * 0.04,
    backgroundColor: '#333',
  },
});
