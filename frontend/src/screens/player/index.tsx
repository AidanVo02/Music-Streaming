import React, { useEffect, useRef, useState, memo, useCallback } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  Dimensions, ScrollView, ActivityIndicator,
  StatusBar, Animated, Easing,
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AppBar from '@/src/components/appBar';
import TabsBar from '@/src/components/tabsBar/TabsBar';
import AddToPlaylistModal from '@/src/components/AddToPlaylistModal';
import QueueModal from '@/src/components/QueueModal';
import { useTrackDetail } from '@/src/hooks/useTrackDetail';
import { usePlayer } from '@/src/context/PlayerContext';
import { useQueue } from '@/src/context/QueueContext';
import { usePlayerQueue } from '@/src/hooks/usePlayerQueue';
import { useWaveform } from '@/src/hooks/useWaveform';
import ApiService from '@/src/server/apiService';
import styles from './PlayerScreen.styles';
import { useLikes } from '@/src/context/LikeContext';

const ORANGE = '#ff8000';
const { width } = Dimensions.get('window');
const FALLBACK = 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80';

// ─── ANIMATION 1: Glow Pulse cho nút Play ────────────────────────────────────
function usePlayGlow(isPlaying: boolean) {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const loopRef  = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isPlaying) {
      loopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );
      loopRef.current.start();
    } else {
      loopRef.current?.stop();
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    return () => loopRef.current?.stop();
  }, [isPlaying]);

  // Interpolate shadow radius and opacity
  const shadowRadius  = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 28] });
  const shadowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.95] });

  return { shadowRadius, shadowOpacity };
}

// ─── ANIMATION 2: Marquee — chạy khi title chạm tới badge ───────────────────
const MARQUEE_SPEED = 40; // px/s
const MARQUEE_PAUSE = 2000; // ms

function MarqueeTitle({ title, maxWidth }: { title: string; maxWidth: number }) {
  const textWidth   = useRef(0);
  const maxWidthRef = useRef(maxWidth);
  const translateX  = useRef(new Animated.Value(0)).current;
  const animRef     = useRef<Animated.CompositeAnimation | null>(null);
  const [needsMarquee, setNeedsMarquee] = useState(false);

  // Keep ref in sync so evaluate() always has latest value
  useEffect(() => { maxWidthRef.current = maxWidth; }, [maxWidth]);

  const runMarquee = useCallback((overflow: number) => {
    animRef.current?.stop();
    translateX.setValue(0);
    const duration = (overflow / MARQUEE_SPEED) * 1000;
    animRef.current = Animated.loop(
      Animated.sequence([
        Animated.delay(MARQUEE_PAUSE),
        Animated.timing(translateX, {
          toValue: -overflow,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(MARQUEE_PAUSE),
        Animated.timing(translateX, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    animRef.current.start();
  }, [translateX]);

  const evaluate = useCallback((tw: number, mw: number) => {
    if (tw <= 0 || mw <= 0) return;
    const overflow = tw - mw;
    if (overflow > 2) {
      setNeedsMarquee(true);
      runMarquee(overflow);
    } else {
      setNeedsMarquee(false);
      animRef.current?.stop();
      translateX.setValue(0);
    }
  }, [runMarquee, translateX]);

  // Measure text width via invisible text
  const onMeasureLayout = useCallback((e: any) => {
    const lines = e.nativeEvent.lines as { width: number }[];
    const tw = lines.reduce((m, l) => Math.max(m, l.width), 0);
    textWidth.current = tw;
    evaluate(tw, maxWidthRef.current);
  }, [evaluate]);

  // Re-evaluate when badge width is finally measured
  useEffect(() => {
    if (maxWidth > 0 && textWidth.current > 0) {
      evaluate(textWidth.current, maxWidth);
    }
  }, [maxWidth, evaluate]);

  // Reset on track change
  useEffect(() => {
    animRef.current?.stop();
    translateX.setValue(0);
    setNeedsMarquee(false);
    textWidth.current = 0;
  }, [title]);

  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      {/* Invisible measuring text — always present, zero height */}
      <Text
        style={[styles.coverTitle, { position: 'absolute', opacity: 0, top: -9999 }]}
        numberOfLines={1}
        onTextLayout={onMeasureLayout}
      >
        {title}
      </Text>

      {/* Visible text — static or animated */}
      {needsMarquee ? (
        <Animated.Text
          style={[styles.coverTitle, { transform: [{ translateX }] }]}
          numberOfLines={1}
        >
          {title}{'     '}{title}
        </Animated.Text>
      ) : (
        <Text style={styles.coverTitle} numberOfLines={1}>
          {title}
        </Text>
      )}
    </View>
  );
}

// ── Smooth progress bar — only this re-renders every frame ──────────────────
const SmoothProgress = memo(function SmoothProgress({
  position, duration, peaks, onSeek,
}: {
  position: number;
  duration: number;
  peaks: number[];
  onSeek: (ms: number) => void;
}) {
  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
  const barWidth = width - width * 0.08;

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  const handleSeekPress = useCallback((e: any) => {
    const ratio = Math.max(0, Math.min(e.nativeEvent.locationX / barWidth, 1));
    onSeek(ratio * duration);
  }, [barWidth, duration, onSeek]);

  return (
    <View style={styles.bottomWrap}>
      {/* Waveform bars */}
      <TouchableOpacity activeOpacity={0.9} onPress={handleSeekPress}>
        <View style={styles.waveformRow}>
          {peaks.map((h, i) => {
            const active = (i / peaks.length) <= progress;
            return (
              <View
                key={i}
                style={[
                  styles.waveBar,
                  {
                    height: h * width * 0.1,
                    backgroundColor: active ? ORANGE : '#2a2a2a',
                  },
                ]}
              />
            );
          })}
        </View>
      </TouchableOpacity>

      {/* Progress bar */}
      <TouchableOpacity activeOpacity={0.9} onPress={handleSeekPress}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
        </View>
      </TouchableOpacity>

      {/* Timestamps */}
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{fmt(position)}</Text>
        <Text style={styles.timeText}>{fmt(duration)}</Text>
      </View>
    </View>
  );
});

SmoothProgress.displayName = 'SmoothProgress';

interface Props { trackId?: string | number; }

export default function PlayerScreen({ trackId }: Props) {
  const router = useRouter();
  const { track: initialTrack, loading, error } = useTrackDetail(trackId || '');
  const player = usePlayer();
  const queue = useQueue();
  const { playNext, playPrevious, hasNext, hasPrevious } = usePlayerQueue();
  const { isLiked, toggleLike } = useLikes();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showQueueModal, setShowQueueModal] = useState(false);
  const playCountedRef = useRef(false);
  const [badgeWidth, setBadgeWidth] = useState(0);

  // Use currentTrack from player context (updates when Next/Previous is pressed)
  const track = player.currentTrack || initialTrack;
  const { peaks: waveformPeaks } = useWaveform(track?.track_id);

  // When initial track loads from URL, add to queue and play
  useEffect(() => {
    if (initialTrack && player.currentTrack?.track_id !== initialTrack.track_id) {
      const trackData = {
        track_id:        initialTrack.track_id,
        title:           initialTrack.title,
        originator:      initialTrack.originator,
        cover_image_url: initialTrack.cover_image_url,
        audio_url:       initialTrack.audio_url,
        file_path:       initialTrack.file_path,
        duration:        initialTrack.duration,
        genre:           initialTrack.genre,
      };
      
      // Check if track already exists in queue
      const existsInQueue = queue.queue.some(t => t.track_id === trackData.track_id);
      
      if (existsInQueue) {
        // Track already in queue, just jump to it
        const index = queue.queue.findIndex(t => t.track_id === trackData.track_id);
        console.log(`🎯 Track already in queue at index ${index}, jumping to it`);
        const trackToPlay = queue.playTrackAtIndex(index);
        if (trackToPlay) {
          player.playTrack(trackToPlay);
        }
      } else {
        // Add to end of queue and play
        const trackToPlay = queue.addToQueueAndPlay(trackData);
        player.playTrack(trackToPlay);
      }
    }
  }, [initialTrack?.track_id]);

  // Increment play count once per track
  useEffect(() => {
    if (player.isPlaying && track?.track_id && !playCountedRef.current) {
      playCountedRef.current = true;
      ApiService.request(`/api/tracks/${track.track_id}/play`, { method: 'POST' }).catch(() => {});
    }
    
    // Reset when track changes
    return () => {
      playCountedRef.current = false;
    };
  }, [player.isPlaying, track?.track_id]);

  // Alias for cleaner JSX
  const audio = {
    isPlaying: player.isPlaying,
    isLoading: player.isLoading,
    isLoaded:  !player.isLoading && !!player.currentTrack,
    position:  player.position,
    duration:  player.duration,
    togglePlay: player.togglePlay,
    seekTo:    player.seekTo,
    seekBy:    async (delta: number) => {
      const next = Math.max(0, Math.min(player.position + delta, player.duration));
      await player.seekTo(next);
    },
    error: null as string | null,
  };

  // Animation hooks
  const { shadowRadius, shadowOpacity } = usePlayGlow(audio.isPlaying);

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <AppBar />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={ORANGE} />
        </View>
        <TabsBar />
      </SafeAreaView>
    );
  }

  // ── ERROR ────────────────────────────────────────────────────────────────
  if (error || !track) {
    return (
      <SafeAreaView style={styles.container}>
        <AppBar />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <Text style={{ color: '#aaa', fontSize: 15 }}>{error || 'Track not found'}</Text>
          <TouchableOpacity
            style={{ backgroundColor: ORANGE, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
            onPress={() => router.back()}
          >
            <Text style={{ color: '#000', fontWeight: 'bold' }}>GO BACK</Text>
          </TouchableOpacity>
        </View>
        <TabsBar />
      </SafeAreaView>
    );
  }

  // ── MAIN ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <AppBar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: width * 0.05 }}
      >
        {/* ── COVER ART ── */}
        <View style={styles.coverWrap}>
          <Image
            source={{ uri: track.cover_image_url || FALLBACK }}
            style={styles.coverImg}
          />

          {/* Gradient overlay for title readability */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: width * 0.35 }}
          />

          {/* Track title + badge in same row — Marquee triggers when title hits badge */}
          <View style={styles.coverTitleWrap}>
            <MarqueeTitle
              title={track.title?.toUpperCase() ?? ''}
              maxWidth={width - width * 0.1 - badgeWidth - width * 0.04}
            />
            <View
              style={styles.qualityBadge}
              onLayout={(e) => setBadgeWidth(e.nativeEvent.layout.width)}
            >
              <MaterialCommunityIcons name="microphone-variant" size={width * 0.04} color={ORANGE} />
              <Text style={styles.qualityText} numberOfLines={1}>{track.originator?.toUpperCase() || 'UNKNOWN ARTIST'}</Text>
            </View>
          </View>
        </View>

        {/* ── NOW PLAYING LABEL ── */}
        <Text style={styles.nowPlayingLabel}>NOW PLAYING</Text>

        {/* ── CONTROLS PANEL ── */}
        <View style={styles.controlsPanel}>
          {/* Main controls row */}
          <View style={styles.controlsRow}>
            {/* Shuffle */}
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={queue.toggleShuffle}
            >
              <Ionicons
                name="shuffle"
                size={width * 0.065}
                color={queue.shuffle ? ORANGE : '#555'}
              />
            </TouchableOpacity>

            {/* Prev */}
            <TouchableOpacity 
              style={styles.controlBtn} 
              disabled={!hasPrevious}
              onPress={playPrevious}
            >
              <Ionicons
                name="play-skip-back"
                size={width * 0.075}
                color={hasPrevious ? '#fff' : '#444'}
              />
            </TouchableOpacity>

            {/* Play / Pause — big orange square button with Glow Pulse */}
            <Animated.View style={[
              styles.playBtnGlow,
              {
                shadowRadius,
                shadowOpacity,
                elevation: audio.isPlaying ? 16 : 8,
              },
            ]}>
              <TouchableOpacity
                style={[styles.playBtn, !audio.isLoaded && { opacity: 0.5 }]}
                onPress={audio.togglePlay}
                disabled={!audio.isLoaded}
              >
                {audio.isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons
                    name={audio.isPlaying ? 'pause' : 'play'}
                    size={width * 0.1}
                    color="#fff"
                  />
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Next */}
            <TouchableOpacity 
              style={styles.controlBtn} 
              disabled={!hasNext}
              onPress={playNext}
            >
              <Ionicons
                name="play-skip-forward"
                size={width * 0.075}
                color={hasNext ? '#fff' : '#444'}
              />
            </TouchableOpacity>

            {/* Repeat */}
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={queue.toggleRepeat}
            >
              <Ionicons
                name={queue.repeat === 'one' ? 'repeat-outline' : 'repeat'}
                size={width * 0.065}
                color={queue.repeat !== 'off' ? ORANGE : '#555'}
              />
              {queue.repeat === 'one' && (
                <View style={{ position: 'absolute', top: -2, right: -2, backgroundColor: ORANGE, borderRadius: 8, width: 14, height: 14, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#000', fontSize: 10, fontWeight: 'bold' }}>1</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Bottom actions row */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <MaterialIcons name="share" size={width * 0.06} color="#666" />
              <Text style={styles.actionLabel}>SHARE</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => setShowQueueModal(true)}
            >
              <MaterialIcons name="queue-music" size={width * 0.06} color="#666" />
              <Text style={styles.actionLabel}>QUEUE</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => setShowPlaylistModal(true)}
            >
              <MaterialIcons name="playlist-add" size={width * 0.06} color="#666" />
              <Text style={styles.actionLabel}>PLAYLIST</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={() => track?.track_id && toggleLike(track.track_id)}>
              <Ionicons
                name={track?.track_id && isLiked(track.track_id) ? 'heart' : 'heart-outline'}
                size={width * 0.06}
                color={track?.track_id && isLiked(track.track_id) ? ORANGE : '#666'}
              />
              <Text style={[styles.actionLabel, Boolean(track?.track_id) && isLiked(track.track_id) && styles.actionLabelActive]}>
                {track?.track_id && isLiked(track.track_id) ? 'LIKED' : 'LIKE'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── WAVEFORM + PROGRESS ── */}
        <SmoothProgress
          position={audio.position}
          duration={audio.duration || (track.duration ?? 0) * 1000}
          peaks={waveformPeaks}
          onSeek={audio.seekTo}
        />

        {/* Error / no audio */}
        {audio.error && (
          <Text style={{ color: '#ff4444', textAlign: 'center', fontSize: 11, marginHorizontal: 16, marginTop: 4 }}>
            ⚠ {audio.error}
          </Text>
        )}
        {!track.audio_url && !track.file_path && (
          <Text style={{ color: '#555', textAlign: 'center', fontSize: 11, marginTop: 8 }}>
            No audio file available
          </Text>
        )}
      </ScrollView>

      <TabsBar />

      {/* Add to Playlist Modal */}
      {track && (
        <AddToPlaylistModal
          visible={showPlaylistModal}
          onClose={() => setShowPlaylistModal(false)}
          trackId={track.track_id}
          trackTitle={track.title}
        />
      )}

      {/* Queue Modal */}
      <QueueModal
        visible={showQueueModal}
        onClose={() => setShowQueueModal(false)}
      />
    </SafeAreaView>
  );
}
