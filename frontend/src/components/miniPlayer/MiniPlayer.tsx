import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  Dimensions, Animated, StyleSheet, Modal,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname, useSegments } from 'expo-router';
import { usePlayer } from '@/src/context/PlayerContext';
import AddToPlaylistModal from '@/src/components/AddToPlaylistModal';

const { width } = Dimensions.get('window');
const ORANGE = '#ff8000';
const FALLBACK = 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=200&q=60';

// Screens where MiniPlayer should NOT appear
const HIDDEN_ON = ['artist-application', 'upload', 'player'];

export default function MiniPlayer() {
  const { currentTrack, isPlaying, isLoading, position, duration, togglePlay } = usePlayer();
  const router   = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const [showMenu, setShowMenu] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  // Slide-up animation
  const slideY = useRef(new Animated.Value(100)).current;

  // Check if current screen should hide MiniPlayer
  const shouldHide =
    !currentTrack ||
    HIDDEN_ON.some(screen => {
      // Check both pathname and segments
      const inPathname = pathname.includes(screen);
      const inSegments = segments.some(seg => seg.includes(screen));
      return inPathname || inSegments;
    });

  useEffect(() => {
    Animated.spring(slideY, {
      toValue: shouldHide ? 100 : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [shouldHide]);

  // Return null when should hide (better than animation)
  if (shouldHide) return null;
  
  // Safety check - should not happen but just in case
  if (!currentTrack) return null;

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;

  const handleLongPress = () => {
    setShowMenu(true);
  };

  const handleGoToPlayer = () => {
    setShowMenu(false);
    router.push(`/player/${currentTrack.track_id}` as any);
  };

  const handleAddToPlaylist = () => {
    setShowMenu(false);
    setShowPlaylistModal(true);
  };

  return (
    <>
      <Animated.View style={[styles.container, { transform: [{ translateY: slideY }] }]}>
        {/* Progress bar at top */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
        </View>

        <TouchableOpacity
          style={styles.inner}
          activeOpacity={0.85}
          onPress={() => router.push(`/player/${currentTrack.track_id}` as any)}
          onLongPress={handleLongPress}
          delayLongPress={500}
        >
          {/* Cover */}
          <Image
            source={{ uri: currentTrack.cover_image_url || FALLBACK }}
            style={styles.cover}
          />

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.sub} numberOfLines={1}>
              {isLoading ? 'LOADING...' : isPlaying ? 'NOW MASTERING' : 'PAUSED'}
            </Text>
          </View>

          {/* Play/Pause button */}
          <TouchableOpacity
            style={styles.playBtn}
            onPress={(e) => { e.stopPropagation(); togglePlay(); }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <View style={styles.playBtnInner}>
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={width * 0.065}
                color="#fff"
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>

      {/* Context Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Image
                source={{ uri: currentTrack.cover_image_url || FALLBACK }}
                style={styles.menuCover}
              />
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle} numberOfLines={1}>
                  {currentTrack.title}
                </Text>
                <Text style={styles.menuArtist} numberOfLines={1}>
                  {currentTrack.originator || 'Unknown Artist'}
                </Text>
              </View>
            </View>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleGoToPlayer}>
              <Ionicons name="expand" size={24} color="#fff" />
              <Text style={styles.menuItemText}>Go to Player</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleAddToPlaylist}>
              <MaterialIcons name="playlist-add" size={24} color="#fff" />
              <Text style={styles.menuItemText}>Add to Playlist</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="share-outline" size={24} color="#fff" />
              <Text style={styles.menuItemText}>Share</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemCancel]}
              onPress={() => setShowMenu(false)}
            >
              <Text style={styles.menuItemCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add to Playlist Modal */}
      <AddToPlaylistModal
        visible={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        trackId={currentTrack.track_id}
        trackTitle={currentTrack.title}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: width * 0.18, // Đặt phía trên TabsBar (TabsBar height = width * 0.18)
    left: 0,
    right: 0,
    backgroundColor: 'rgba(28, 28, 28, 0.85)', // Thêm alpha 0.85 để trong suốt một chút
    borderTopLeftRadius: width * 0.04,
    borderTopRightRadius: width * 0.04,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 20,
    overflow: 'hidden',
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#2a2a2a',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ORANGE,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.03,
    gap: width * 0.03,
  },
  cover: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: width * 0.02,
    backgroundColor: '#333',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sub: {
    color: ORANGE,
    fontSize: width * 0.028,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  playBtn: {
    padding: width * 0.01,
  },
  playBtnInner: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.02,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Context Menu Styles
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
    paddingBottom: width * 0.18 + width * 0.05, // TabsBar height + spacing
  },
  menuContainer: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: width * 0.04,
    borderRadius: width * 0.04,
    overflow: 'hidden',
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04,
    gap: width * 0.03,
    backgroundColor: '#222',
  },
  menuCover: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.015,
    backgroundColor: '#333',
  },
  menuInfo: {
    flex: 1,
    gap: 4,
  },
  menuTitle: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  menuArtist: {
    color: '#888',
    fontSize: width * 0.032,
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04,
    gap: width * 0.04,
  },
  menuItemText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  menuItemCancel: {
    justifyContent: 'center',
    paddingVertical: width * 0.035,
  },
  menuItemCancelText: {
    color: '#888',
    fontSize: width * 0.04,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
