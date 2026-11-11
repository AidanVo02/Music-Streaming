import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  Dimensions, Animated, StyleSheet, Modal,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname, useSegments } from 'expo-router';
import { usePlayer } from '@/src/context/PlayerContext';
import AddToPlaylistModal from '@/src/components/AddToPlaylistModal';
import THEME from '@/src/constants/theme';

const { width } = Dimensions.get('window');
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
      const inPathname = pathname.includes(screen);
      const inSegments = segments.some(seg => seg.includes(screen));
      return inPathname || inSegments;
    });

  useEffect(() => {
    Animated.spring(slideY, {
      toValue: shouldHide ? 120 : 0,
      useNativeDriver: true,
      tension: 90,
      friction: 12,
    }).start();
  }, [shouldHide]);

  if (shouldHide || !currentTrack) return null;

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
      <Animated.View style={[styles.capsuleWrapper, { transform: [{ translateY: slideY }] }]}>
        {/* Top Hairline Progress Bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
        </View>

        <TouchableOpacity
          style={styles.inner}
          activeOpacity={0.88}
          onPress={() => router.push(`/player/${currentTrack.track_id}` as any)}
          onLongPress={handleLongPress}
          delayLongPress={500}
        >
          {/* Cover Art */}
          <Image
            source={{ uri: currentTrack.cover_image_url || FALLBACK }}
            style={styles.cover}
          />

          {/* Track Info */}
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.sub} numberOfLines={1}>
              {isLoading
                ? 'LOADING...'
                : currentTrack.originator
                ? `${currentTrack.originator} • ${isPlaying ? 'PLAYING' : 'PAUSED'}`
                : isPlaying
                ? 'PLAYING'
                : 'PAUSED'}
            </Text>
          </View>

          {/* Quick Play/Pause Circular Button */}
          <TouchableOpacity
            style={styles.playBtn}
            onPress={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.8}
          >
            <View style={styles.playBtnInner}>
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={18}
                color={THEME.colors.textPrimary}
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
              <Ionicons name="expand-outline" size={20} color={THEME.colors.textPrimary} />
              <Text style={styles.menuItemText}>Open Player</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleAddToPlaylist}>
              <MaterialIcons name="playlist-add" size={22} color={THEME.colors.textPrimary} />
              <Text style={styles.menuItemText}>Add to Playlist</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemCancel]}
              onPress={() => setShowMenu(false)}
            >
              <Text style={styles.menuItemCancelText}>Dismiss</Text>
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
  capsuleWrapper: {
    position: 'absolute',
    bottom: 74, // Floating cleanly above bottom tabs
    left: 12,
    right: 12,
    backgroundColor: THEME.colors.surfaceCard,
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.borderHighlight,
    overflow: 'hidden',
    ...THEME.shadows.floating,
  },
  progressTrack: {
    height: 2,
    backgroundColor: THEME.colors.surfaceSubtle,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: THEME.radii.sm,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  sub: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  playBtn: {
    padding: 2,
  },
  playBtnInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surfaceHover,
    borderWidth: 1,
    borderColor: THEME.colors.borderHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Context Menu Modal
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
    paddingBottom: 90,
  },
  menuContainer: {
    backgroundColor: THEME.colors.surfaceCard,
    marginHorizontal: 16,
    borderRadius: THEME.radii.lg,
    borderWidth: 1,
    borderColor: THEME.colors.borderHighlight,
    overflow: 'hidden',
    ...THEME.shadows.floating,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  menuCover: {
    width: 46,
    height: 46,
    borderRadius: THEME.radii.sm,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  menuInfo: {
    flex: 1,
    gap: 3,
  },
  menuTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  menuArtist: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
  },
  menuDivider: {
    height: 1,
    backgroundColor: THEME.colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuItemText: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  menuItemCancel: {
    justifyContent: 'center',
    paddingVertical: 14,
  },
  menuItemCancelText: {
    color: THEME.colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
