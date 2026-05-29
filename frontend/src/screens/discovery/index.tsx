import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AppBar from '@/src/components/appBar';
import TabsBar from '@/src/components/tabsBar/TabsBar';
import styles from './DiscoveryScreen.styles';
import { useDiscovery, useGenreTracks } from '@/src/hooks/useDiscovery';
import { useGlobalSearch } from '@/src/hooks/useGlobalSearch';
import { usePlayer } from '@/src/context/PlayerContext';
import { useQueue } from '@/src/context/QueueContext';

const { width } = Dimensions.get('window');
const ORANGE = '#ff8000';

const DiscoveryScreen = () => {
  const router = useRouter();
  const { topTracks, genres, loading: defaultLoading, error: defaultError } = useDiscovery();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { tracks: genreTracks, loading: genreLoading } = useGenreTracks(selectedGenre || '', 10);
  
  const { results, loading: searchLoading, search, clearSearch } = useGlobalSearch();
  const { playTrack } = usePlayer();
  const { addToQueueAndPlay } = useQueue();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        search(searchQuery);
      } else {
        setIsSearching(false);
        clearSearch();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, search, clearSearch]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    clearSearch();
  };

  const handlePlayTrack = (track: any) => {
    const playerTrack = {
      track_id: track.track_id,
      title: track.title,
      cover_image_url: track.cover_image_url,
      audio_url: track.audio_url || track.file_path,
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

  const formatPlayCount = (count?: number) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const displayTracks = selectedGenre ? genreTracks : topTracks;
  const isDefaultLoading = selectedGenre ? genreLoading : defaultLoading;

  return (
    <SafeAreaView style={styles.container}>
      <AppBar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: width * 0.25 }}
      >
        <Text style={styles.title}>DISCOVERY</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#aaa" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tracks, artists, playlists..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        {isSearching ? (
          /* ========================================================= */
          /* SEARCH RESULTS VIEW                                       */
          /* ========================================================= */
          searchLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={ORANGE} />
            </View>
          ) : (
            <>
              {/* Tracks Search Results */}
              {results.tracks.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.sectionTitle}>TRACKS</Text>
                  {results.tracks.map((track) => (
                    <TouchableOpacity
                      key={`search-track-${track.track_id}`}
                      style={styles.trackCard}
                      onPress={() => handlePlayTrack(track)}
                    >
                      <Image
                        source={{ uri: track.cover_image_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80' }}
                        style={styles.trackCover}
                      />
                      <View style={styles.trackInfo}>
                        <Text style={styles.trackTitle} numberOfLines={1}>
                          {track.title}
                        </Text>
                        <Text style={styles.trackMeta}>
                          {track.originator || track.genre || 'Unknown'}
                        </Text>
                      </View>
                      <Ionicons name="play-circle-outline" size={width * 0.08} color={ORANGE} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Artists Search Results */}
              {results.artists.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.sectionTitle}>ARTISTS</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                    {results.artists.map((artist) => (
                      <TouchableOpacity
                        key={`search-artist-${artist.id || artist.artist_id}`}
                        style={styles.artistSearchCard}
                        onPress={() => navigateToArtist(artist.artist_id || artist.id)}
                      >
                        <Image
                          source={{ uri: artist.image_url || 'https://via.placeholder.com/150' }}
                          style={styles.artistSearchImg}
                        />
                        <Text style={styles.artistSearchName} numberOfLines={2}>
                          {artist.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Playlists Search Results */}
              {results.playlists.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.sectionTitle}>PLAYLISTS</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                    {results.playlists.map((playlist) => (
                      <TouchableOpacity
                        key={`search-playlist-${playlist.playlist_id}`}
                        style={styles.playlistSearchCard}
                        onPress={() => navigateToPlaylist(playlist.playlist_id)}
                      >
                        <Image
                          source={{ uri: playlist.cover_image_url || 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80' }}
                          style={styles.playlistSearchImg}
                        />
                        <Text style={styles.playlistSearchTitle} numberOfLines={1}>
                          {playlist.name}
                        </Text>
                        <Text style={styles.playlistSearchSub}>{playlist.track_count || 0} tracks</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* No Results Fallback */}
              {results.tracks.length === 0 && results.artists.length === 0 && results.playlists.length === 0 && (
                <View style={styles.centered}>
                  <Ionicons name="search-outline" size={width * 0.12} color="#333" />
                  <Text style={styles.emptyText}>
                    No results found for {`"${searchQuery}"`}
                  </Text>
                </View>
              )}
            </>
          )
        ) : (
          /* ========================================================= */
          /* DEFAULT DISCOVERY VIEW                                    */
          /* ========================================================= */
          <>
            {/* Genre Filter */}
            <Text style={styles.sectionTitle}>GENRES</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.genreChipsWrap}
            >
              <TouchableOpacity
                style={[styles.genreChip, !selectedGenre && styles.genreChipActive]}
                onPress={() => setSelectedGenre(null)}
              >
                <Text
                  style={[
                    styles.genreChipText,
                    !selectedGenre && styles.genreChipTextActive,
                  ]}
                >
                  ALL
                </Text>
              </TouchableOpacity>

              {genres.map((g) => (
                <TouchableOpacity
                  key={g.genre}
                  style={[
                    styles.genreChip,
                    selectedGenre === g.genre && styles.genreChipActive,
                  ]}
                  onPress={() => setSelectedGenre(g.genre)}
                >
                  <Text
                    style={[
                      styles.genreChipText,
                      selectedGenre === g.genre && styles.genreChipTextActive,
                    ]}
                  >
                    {g.genre?.toUpperCase()} ({g.track_count})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Top Tracks */}
            <Text style={styles.sectionTitle}>
              {selectedGenre
                ? `TOP ${selectedGenre.toUpperCase()} TRACKS`
                : 'TRENDING NOW'}
            </Text>

            {isDefaultLoading ? (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color={ORANGE} />
              </View>
            ) : defaultError ? (
              <View style={styles.centered}>
                <Text style={{ color: '#aaa', fontSize: width * 0.04 }}>{defaultError}</Text>
              </View>
            ) : displayTracks.length === 0 ? (
              <View style={styles.centered}>
                <Ionicons name="musical-notes-outline" size={width * 0.12} color="#333" />
                <Text style={styles.emptyText}>No tracks found</Text>
              </View>
            ) : (
              displayTracks.map((track, index) => (
                <TouchableOpacity
                  key={track.track_id}
                  style={styles.trackCard}
                  onPress={() => handlePlayTrack(track)}
                >
                  <Image
                    source={{
                      uri:
                        track.cover_image_url ||
                        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80',
                    }}
                    style={styles.trackCover}
                  />
                  <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle} numberOfLines={1}>
                      {track.title}
                    </Text>
                    <Text style={styles.trackMeta}>
                      {track.genre || 'Unknown'} • {Math.floor((track.duration || 0) / 60)}:
                      {String((track.duration || 0) % 60).padStart(2, '0')}
                    </Text>
                  </View>
                  <View style={styles.playCountBadge}>
                    <Ionicons name="play" size={width * 0.035} color={ORANGE} />
                    <Text style={styles.playCountText}>
                      {formatPlayCount(track.play_count)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </>
        )}
      </ScrollView>

      <TabsBar />
    </SafeAreaView>
  );
};

export default DiscoveryScreen;
