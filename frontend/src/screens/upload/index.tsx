import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import styles from './uploadScreen.styles';
import AppBar from '@/src/components/appBar';
import { usePickAudio, useUploadTrack, usePickImage } from '@/src/hooks/useUploadTrack';
import { useAuth } from '@/src/hooks/useAuth';
import ApiService from '@/src/server/apiService';

const { width } = Dimensions.get('window');
const ORANGE = '#ff8000';

const UploadScreen = () => {
  const router = useRouter();
  const [trackName, setTrackName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [selectedChain, setSelectedChain] = useState(0);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('Electronic');
  const [showGenrePicker, setShowGenrePicker] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [genreSearch, setGenreSearch] = useState('');
  const [loadingGenres, setLoadingGenres] = useState(false);

  // Hooks
  const { pickAudio, picking: pickingFile } = usePickAudio();
  const { pickImage, picking: pickingImage } = usePickImage();
  const { uploadTrack, uploading, progress, error: uploadError } = useUploadTrack();
  const { user } = useAuth();

  // Auto-fill artist name from user's artist_name
  useEffect(() => {
    if (user && user.artist_name) {
      setArtistName(user.artist_name);
    }
  }, [user]);

  // Fetch genres on mount
  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    setLoadingGenres(true);
    try {
      const response = await ApiService.getAllGenres();
      if (response.success && response.data) {
        const genreList = response.data.map((g: any) => g.genre);
        setGenres(genreList);
      }
    } catch (error) {
      console.error('Failed to fetch genres:', error);
      // Fallback genres
      setGenres([
        'Electronic',
        'Ambient',
        'House',
        'Techno',
        'Trance',
        'Lo-fi',
        'Synthwave',
        'Drum & Bass',
        'Dubstep',
        'Trap',
        'Hip Hop',
        'Pop',
        'Rock',
        'Jazz',
        'Classical',
      ]);
    } finally {
      setLoadingGenres(false);
    }
  };

  // Filter genres based on search
  const filteredGenres = genres.filter((genre) =>
    genre.toLowerCase().includes(genreSearch.toLowerCase())
  );

  const masteringChains = [
    {
      id: 0,
      name: 'TUBE WARMTH',
      description: 'ANALOG SATURATION',
      icon: '🔊',
    },
    {
      id: 1,
      name: 'PUNCHY DRUMS',
      description: 'TRANSIENT SHAPING',
      icon: '🥁',
    },
    {
      id: 2,
      name: 'STUDIO NEUTRAL',
      description: 'BALANCED EQ',
      icon: '📊',
    },
  ];

  const signalBars = [48, 58, 52, 48, 42, 35, 28, 22, 18, 12, 8];

  // Handle pick audio
  const handlePickAudio = async () => {
    try {
      const file = await pickAudio();
      if (file) {
        setSelectedFile(file);
        console.log('✅ File selected:', file.name);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick audio file');
    }
  };

  // Handle pick image
  const handlePickImage = async () => {
    try {
      const img = await pickImage();
      if (img) {
        setSelectedImage(img);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Handle upload
  const handleUpload = async () => {
    // Validate
    if (!trackName.trim()) {
      Alert.alert('Error', 'Please enter track title');
      return;
    }
    if (!artistName.trim()) {
      Alert.alert('Error', 'Please enter originator/artist name');
      return;
    }
    if (!selectedFile) {
      Alert.alert('Error', 'Please select an audio file');
      return;
    }

    try {
      // Upload with selected genre
      const result = await uploadTrack(
        selectedFile,
        trackName.trim(),
        artistName.trim(),
        selectedGenre
      );

      if (result) {
        Alert.alert('Success', 'Track uploaded successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // Reset form and go back
              setTrackName('');
              setArtistName('');
              setSelectedFile(null);
              setSelectedImage(null);
              setSelectedChain(0);
              setSelectedGenre('Electronic');
              router.back();
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Upload Error', uploadError || 'Failed to upload track');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <AppBar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: width * 0.25 }}
      >
        {/* Tap to Inject Signal Section */}
        <TouchableOpacity
          style={styles.injectSection}
          onPress={handlePickAudio}
          disabled={pickingFile || uploading}
        >
          <View style={styles.injectBox}>
            {pickingFile || uploading ? (
              <ActivityIndicator size="large" color={ORANGE} />
            ) : selectedFile ? (
              <Ionicons name="checkmark-circle" size={width * 0.15} color="#4CAF50" />
            ) : (
              <Ionicons name="radio" size={width * 0.15} color={ORANGE} />
            )}
          </View>
          <Text style={styles.injectText}>
            {selectedFile ? '📁 ' + selectedFile.name : 'TAP TO INJECT SIGNAL'}
          </Text>
          <Text style={styles.injectSubtext}>
            {selectedFile ? 'Audio file selected' : 'READY FOR 96KHZ / 24-BIT INPUT'}
          </Text>
        </TouchableOpacity>

        {/* Track Metadata Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TRACK METADATA</Text>
            <Text style={styles.stepLabel}>STEP 01</Text>
          </View>

          <View style={styles.metadataForm}>
            {/* Signal Label Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SIGNAL LABEL</Text>
              <TextInput
                style={styles.textInput}
                placeholder="ENTER TRACK TITLE"
                placeholderTextColor="#555"
                value={trackName}
                onChangeText={setTrackName}
                editable={!uploading}
              />
            </View>

            {/* Originator Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ORIGINATOR</Text>
              {user?.artist_name && (
                <Text style={{ color: '#666', fontSize: 11, marginBottom: 4 }}>
                  Using your artist name: {user.artist_name}
                </Text>
              )}
              <TextInput
                style={[styles.textInput, user?.artist_name && { backgroundColor: '#0a2a0a' }]}
                placeholder="ARTIST / PRODUCER NAME"
                placeholderTextColor="#555"
                value={artistName}
                onChangeText={setArtistName}
                editable={!uploading}
              />
            </View>

            {/* Cover Image Picker */}
            <View style={[styles.inputGroup, { marginBottom: 0 }]}>
              <View style={styles.imagePickerHeader}>
                <Text style={styles.inputLabel}>COVER IMAGE</Text>
                {selectedImage && (
                  <TouchableOpacity
                    onPress={() => setSelectedImage(null)}
                    disabled={uploading}
                    style={styles.removeImageButton}
                  >
                    <Ionicons name="trash-outline" size={width * 0.045} color="#ff4444" />
                    <Text style={styles.removeImageText}>REMOVE</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                style={styles.imagePicker}
                onPress={handlePickImage}
                disabled={uploading || pickingImage}
              >
                {selectedImage ? (
                  <>
                    <Image
                      source={{ uri: selectedImage.uri }}
                      style={styles.imagePreview}
                    />
                    <View style={styles.imageChangeOverlay}>
                      <Ionicons name="camera-outline" size={width * 0.06} color="#fff" />
                      <Text style={styles.imageChangeText}>TAP TO CHANGE</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.imagePickerPlaceholder}>
                    {pickingImage ? (
                      <ActivityIndicator size="small" color={ORANGE} />
                    ) : (
                      <>
                        <Ionicons name="image-outline" size={width * 0.09} color="#555" />
                        <Text style={styles.imagePickerText}>TAP TO SELECT IMAGE</Text>
                      </>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Mastering Chain Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>MASTERING CHAIN</Text>
            <Text style={styles.stepLabel}>STEP 02</Text>
          </View>

          {/* Chain Selection Cards */}
          <View style={styles.chainGrid}>
            {masteringChains.slice(0, 2).map((chain) => (
              <TouchableOpacity
                key={chain.id}
                style={[
                  styles.chainCard,
                  selectedChain === chain.id && styles.chainCardActive,
                ]}
                onPress={() => setSelectedChain(chain.id)}
                disabled={uploading}
              >
                <Text style={styles.chainIcon}>{chain.icon}</Text>
                <Text
                  style={[
                    styles.chainName,
                    selectedChain === chain.id && { color: ORANGE },
                  ]}
                >
                  {chain.name}
                </Text>
                <Text style={styles.chainDesc}>{chain.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Studio Neutral Item - Now Genre Picker */}
          <TouchableOpacity
            style={[
              styles.chainItem,
              styles.genrePickerButton,
            ]}
            onPress={() => setShowGenrePicker(true)}
            disabled={uploading}
          >
            <View style={styles.chainItemIcon}>
              <Ionicons name="musical-notes" size={width * 0.06} color={ORANGE} />
            </View>
            <View style={styles.chainItemContent}>
              <Text style={styles.chainItemName}>
                GENRE: {selectedGenre.toUpperCase()}
              </Text>
              <Text style={styles.chainItemDesc}>TAP TO CHANGE GENRE</Text>
            </View>
            <Ionicons name="chevron-forward" size={width * 0.05} color="#555" />
          </TouchableOpacity>

          {/* Signal Chain Analysis */}
          <View style={styles.analysisBox}>
            <Text style={styles.analysisLabel}>SIGNAL CHAIN ANALYSIS</Text>
            <View style={styles.analysisBadge}>
              <Text style={styles.analysisBadgeText}>LIVE</Text>
            </View>

            <View style={styles.signalBars}>
              {signalBars.map((height, index) => (
                <View
                  key={index}
                  style={[
                    styles.bar,
                    {
                      height: `${height}%`,
                      backgroundColor: height > 50 ? ORANGE : '#444',
                    },
                  ]}
                />
              ))}
            </View>

            <View style={styles.frequencyLabels}>
              <Text style={styles.freqLabel}>-48dB</Text>
              <Text style={styles.freqLabel}>-18dB</Text>
              <Text style={styles.freqLabel}>0dB</Text>
            </View>
          </View>
        </View>

        {/* Upload Progress Indicator */}
        {uploading && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>UPLOADING: {progress}%</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Error Message */}
        {uploadError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {uploadError}</Text>
          </View>
        )}

        {/* Initiate Mastering Button */}
        <TouchableOpacity
          style={[
            styles.masterButton,
            (uploading || pickingFile) && { opacity: 0.6 },
          ]}
          onPress={handleUpload}
          disabled={uploading || pickingFile}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Ionicons name="flash" size={width * 0.06} color="#000" />
          )}
          <Text style={styles.masterButtonText}>
            {uploading ? 'UPLOADING...' : 'INITIATE MASTERING'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Genre Picker Modal */}
      <Modal
        visible={showGenrePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGenrePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>SELECT GENRE</Text>
              <TouchableOpacity onPress={() => setShowGenrePicker(false)}>
                <Ionicons name="close" size={width * 0.07} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={width * 0.05} color="#555" />
              <TextInput
                style={styles.searchInput}
                placeholder="SEARCH GENRE..."
                placeholderTextColor="#555"
                value={genreSearch}
                onChangeText={setGenreSearch}
                autoCapitalize="none"
              />
              {genreSearch.length > 0 && (
                <TouchableOpacity onPress={() => setGenreSearch('')}>
                  <Ionicons name="close-circle" size={width * 0.05} color="#555" />
                </TouchableOpacity>
              )}
            </View>

            {/* Genre List */}
            {loadingGenres ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={ORANGE} />
                <Text style={styles.loadingText}>Loading genres...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredGenres}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.genreItem,
                      selectedGenre === item && styles.genreItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedGenre(item);
                      setShowGenrePicker(false);
                      setGenreSearch('');
                    }}
                  >
                    <Text
                      style={[
                        styles.genreItemText,
                        selectedGenre === item && styles.genreItemTextSelected,
                      ]}
                    >
                      {item.toUpperCase()}
                    </Text>
                    {selectedGenre === item && (
                      <Ionicons name="checkmark-circle" size={width * 0.06} color={ORANGE} />
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No genres found</Text>
                  </View>
                }
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Custom TabsBar */}
      {/* <TabsBar /> */}
    </SafeAreaView>
  );
};

export default UploadScreen;
