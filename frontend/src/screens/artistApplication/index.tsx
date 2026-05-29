import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import styles from './artistApplication.styles';
import AppBar from '@/src/components/appBar';
import { useAuth } from '@/src/hooks/useAuth';
import ApiService from '@/src/server/apiService';

const { width } = Dimensions.get('window');
const ORANGE = '#ff8000';

const ArtistApplicationScreen = () => {
  const router = useRouter();
  const { token, refreshUser } = useAuth();
  const [artistName, setArtistName] = useState('');
  const [bio, setBio] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!artistName.trim()) {
      Alert.alert('Error', 'Please enter your artist name');
      return;
    }
    if (artistName.trim().length < 3) {
      Alert.alert('Error', 'Artist name must be at least 3 characters');
      return;
    }
    if (artistName.trim().length > 50) {
      Alert.alert('Error', 'Artist name must be less than 50 characters');
      return;
    }

    try {
      setSubmitting(true);

      const response = await ApiService.applyForArtist(
        { artist_name: artistName.trim(), bio: bio.trim() || null },
        token || undefined
      );

      if (response.success) {
        // Application is now pending — no role change yet
        Alert.alert(
          '✅ Application Submitted',
          'Your artist application has been submitted successfully. An admin will review it soon. You will be notified once approved.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)/user' as any) }]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to submit application');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppBar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: width * 0.25 }}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <MaterialIcons name="radio" size={width * 0.2} color={ORANGE} />
          <Text style={styles.headerTitle}>BECOME AN ARTIST</Text>
          <Text style={styles.headerSubtitle}>
            Ready to broadcast your own signal? Apply for Artist Role and start uploading your
            tracks.
          </Text>
        </View>

        {/* Application Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>APPLICATION FORM</Text>

          {/* Artist Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ARTIST NAME / STAGE NAME *</Text>
            <Text style={styles.inputHint}>
              This will be displayed as the originator on your tracks
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your artist name"
              placeholderTextColor="#555"
              value={artistName}
              onChangeText={setArtistName}
              editable={!submitting}
              maxLength={50}
              autoCapitalize="words"
            />
            <Text style={styles.charCount}>{artistName.length} / 50</Text>
          </View>

          {/* Bio Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>BIO (OPTIONAL)</Text>
            <Text style={styles.inputHint}>Tell us about your music and style</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Write a short bio about yourself..."
              placeholderTextColor="#555"
              value={bio}
              onChangeText={setBio}
              editable={!submitting}
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{bio.length} / 500</Text>
          </View>

          {/* Requirements Section */}
          <View style={styles.requirementsBox}>
            <Text style={styles.requirementsTitle}>REQUIREMENTS</Text>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={width * 0.05} color="#4CAF50" />
              <Text style={styles.requirementText}>Active account in good standing</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={width * 0.05} color="#4CAF50" />
              <Text style={styles.requirementText}>Unique artist name</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={width * 0.05} color="#4CAF50" />
              <Text style={styles.requirementText}>Agree to content guidelines</Text>
            </View>
          </View>

          {/* Benefits Section */}
          <View style={styles.benefitsBox}>
            <Text style={styles.benefitsTitle}>ARTIST BENEFITS</Text>
            <View style={styles.benefitItem}>
              <Ionicons name="cloud-upload" size={width * 0.05} color={ORANGE} />
              <Text style={styles.benefitText}>Upload unlimited tracks</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="stats-chart" size={width * 0.05} color={ORANGE} />
              <Text style={styles.benefitText}>Access to analytics & insights</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="people" size={width * 0.05} color={ORANGE} />
              <Text style={styles.benefitText}>Build your fanbase</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="trophy" size={width * 0.05} color={ORANGE} />
              <Text style={styles.benefitText}>Verified artist badge</Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Ionicons name="paper-plane" size={width * 0.06} color="#000" />
          )}
          <Text style={styles.submitButtonText}>
            {submitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={submitting}
        >
          <Text style={styles.cancelButtonText}>CANCEL</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArtistApplicationScreen;
