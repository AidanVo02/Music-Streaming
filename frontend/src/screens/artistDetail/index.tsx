import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import styles from './ArtistDetailScreen.styles';
import { useArtistDetail } from '@/src/hooks/useArtistDetail';
import { usePlayer } from '@/src/context/PlayerContext';

const { width } = Dimensions.get('window');
const ORANGE = '#ff8000';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80';

function formatDuration(seconds?: number): string {
  if (!seconds) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface ArtistDetailScreenProps {
  artistId: number | string;
}

const ArtistDetailScreen = ({ artistId }: ArtistDetailScreenProps) => {
  const router = useRouter();
  const player = usePlayer();
  const { artist, tracks, loading, error, refetch } = useArtistDetail(artistId);
  const [followed, setFollowed] = useState(false);
  

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={ORANGE} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !artist) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || 'Artist not found'}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
            <Text style={styles.retryText}>RETRY</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totalPlays = tracks.reduce((sum, t) => sum + (t.play_count || 0), 0);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: width * 0.1 }}
      >
        {/* Hero Image */}
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: artist.image_url || FALLBACK_IMAGE }}
            style={styles.heroImg}
          />
          <View style={styles.heroOverlay} />

          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={width * 0.055} color="#fff" />
          </TouchableOpacity>

          {/* Artist name overlay */}
          <View style={styles.heroContent}>
            <Text style={styles.artistLabel}>ARTIST</Text>
            <Text style={styles.artistName}>{artist.name?.toUpperCase()}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{tracks.length}</Text>
            <Text style={styles.statLabel}>TRACKS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {totalPlays > 999 ? `${(totalPlays / 1000).toFixed(1)}K` : totalPlays}
            </Text>
            <Text style={styles.statLabel}>PLAYS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {followed ? 'YES' : 'NO'}
            </Text>
            <Text style={styles.statLabel}>FOLLOWING</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.playAllBtn}>
            <MaterialIcons name="play-arrow" size={width * 0.055} color="#111" />
            <Text style={styles.playAllText}>PLAY ALL</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shuffleBtn}>
            <Ionicons name="shuffle" size={width * 0.05} color="#fff" />
            <Text style={styles.shuffleText}>SHUFFLE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.followBtn, followed && { backgroundColor: ORANGE }]}
            onPress={() => setFollowed(f => !f)}
          >
            <Ionicons
              name={followed ? 'heart' : 'heart-outline'}
              size={width * 0.055}
              color={followed ? '#111' : '#fff'}
            />
          </TouchableOpacity>
        </View>

        {/* Bio */}
        {artist.bio ? (
          <View style={styles.bioWrap}>
            <Text style={styles.bioLabel}>ABOUT</Text>
            <Text style={styles.bioText}>{artist.bio}</Text>
          </View>
        ) : null}

        {/* Tracks */}
        <Text style={styles.sectionTitle}>DISCOGRAPHY</Text>

        {tracks.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: width * 0.08 }}>
            <Ionicons name="musical-notes-outline" size={width * 0.12} color="#333" />
            <Text style={{ color: '#555', marginTop: 10, fontSize: width * 0.038 }}>
              No tracks available
            </Text>
          </View>
        ) : (
          tracks.map((track, index) => (
            <TouchableOpacity
              key={track.track_id}
              style={styles.trackRow}
              activeOpacity={0.7}
              onPress={() => router.push(`/player/${track.track_id}`)}
            >
              <Text style={styles.trackIndex}>{String(index + 1).padStart(2, '0')}</Text>
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                <Text style={styles.trackMeta}>
                  {track.play_count ? `${track.play_count} plays` : 'No plays yet'}
                </Text>
              </View>
              <Text style={styles.trackDuration}>{formatDuration(track.duration)}</Text>
              <TouchableOpacity style={styles.trackMoreBtn}>
                <Ionicons name="ellipsis-vertical" size={width * 0.045} color="#555" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArtistDetailScreen;
