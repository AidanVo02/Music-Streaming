import React, { useCallback, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import styles from './userScreen.styles';
import AppBar from '@/src/components/appBar';
import TabsBar from '@/src/components/tabsBar/TabsBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import ApiService from '@/src/server/apiService';
import { usePlayer } from '@/src/context/PlayerContext';
import { usePickImage } from '@/src/hooks/useUploadTrack';

const { width } = Dimensions.get('window');

const UserScreen = () => {
    const ORANGE = '#ff8000';
    const router = useRouter();
    const { user, token, logout, refreshUser, updateProfile } = useAuth();
    const { history } = usePlayer();
    const { pickImage, picking: pickingImage } = usePickImage();

    const [applicationStatus, setApplicationStatus] = useState<'none' | 'pending' | 'rejected'>('none');
    
    // Edit Profile State
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [editDisplayName, setEditDisplayName] = useState('');
    const [editImage, setEditImage] = useState<any>(null);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Refresh user data + check application status every time screen is focused
    useFocusEffect(
      useCallback(() => {
        refreshUser();
        if (user?.role === 'user') {
          checkApplicationStatus();
        }
      }, [user?.role])
    );

    const checkApplicationStatus = async () => {
      try {
        const res = await ApiService.getApplicationStatus(token || undefined);
        if (res?.success && res?.data) {
          const status = res.data.status;
          if (status === 'pending')  setApplicationStatus('pending');
          else if (status === 'rejected') setApplicationStatus('rejected');
          else setApplicationStatus('none');
        } else {
          setApplicationStatus('none');
        }
      } catch {
        setApplicationStatus('none');
      }
    };

    const handleLogout = async () => {
      console.log('🔴 Logout button pressed');
      
      // For web, use window.confirm
      if (typeof window !== 'undefined' && window.confirm) {
        const confirmed = window.confirm('Are you sure you want to logout?');
        if (!confirmed) return;
      } else {
        // For native, use Alert
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'LOGOUT',
            style: 'destructive',
            onPress: async () => {
              await logout();
              router.replace('/(tabs)');
            },
          },
        ]);
        return;
      }

      console.log('🔴 Logging out...');
      await logout();
      console.log('🔴 Redirecting to home...');
      router.replace('/(tabs)');
    };

    const handleOpenEditProfile = () => {
      setEditDisplayName(user?.display_name || user?.username || '');
      setEditImage(null);
      setEditModalVisible(true);
    };

    const handlePickAvatar = async () => {
      try {
        const img = await pickImage();
        if (img) setEditImage(img);
      } catch (error) {
        Alert.alert('Error', 'Failed to pick image');
      }
    };

    const handleSaveProfile = async () => {
      if (!editDisplayName.trim()) {
        Alert.alert('Error', 'Display name cannot be empty');
        return;
      }

      setIsSavingProfile(true);
      try {
        const formData = new FormData();
        formData.append('display_name', editDisplayName.trim());
        
        if (editImage) {
          if (editImage.file) {
            // Web
            formData.append('avatar', editImage.file);
          } else {
            // Mobile
            formData.append('avatar', {
              uri: editImage.uri,
              type: editImage.type,
              name: editImage.name,
            } as any);
          }
        }

        const success = await updateProfile(formData);
        if (success) {
          setEditModalVisible(false);
          Alert.alert('Success', 'Profile updated successfully!');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to update profile');
      } finally {
        setIsSavingProfile(false);
      }
    };

  return (
  <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <AppBar />
    <ScrollView style={styles.profireSpace} contentContainerStyle={{ paddingBottom: width * 0.25 }}>
      

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: user?.profile_pic_url || `https://ui-avatars.com/api/?name=${user?.display_name || user?.username || 'U'}&background=ff8000&color=fff&size=200` }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{(user?.display_name || user?.username || 'UNKNOWN').toUpperCase()}</Text>
        <Text style={styles.userRole}>
          {user?.role === 'artist' ? 'CERTIFIED ARTIST' : user?.role?.toUpperCase() || 'USER'}
        </Text>
        <TouchableOpacity style={styles.editProfileBtn} onPress={handleOpenEditProfile}>
          <Text style={styles.editProfileText}>EDIT PROFILE</Text>
        </TouchableOpacity>
      </View>

      {/* Upload Button - Only for Artist/Admin */}
      {user && (user.role === 'artist' || user.role === 'admin') && (
        <TouchableOpacity 
          style={{
            marginHorizontal: width * 0.05,
            marginVertical: width * 0.04,
            backgroundColor: ORANGE,
            paddingVertical: width * 0.04,
            borderRadius: width * 0.02,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: width * 0.02,
          }}
          onPress={() => router.push('/(tabs)/upload' as any)}
        >
          <Ionicons name="cloud-upload" size={width * 0.06} color="#000" />
          <Text style={{
            fontSize: width * 0.04,
            fontWeight: '700',
            color: '#000',
            letterSpacing: 1.5,
          }}>UPLOAD NEW TRACK</Text>
        </TouchableOpacity>
      )}

      {/* Signal Parameters - Role-based Stats */}
      <View style={styles.parametersSection}>
        {user?.role === 'user' ? (
          <>
            {/* USER ROLE STATS */}
            <View style={styles.parameterCard}>
              <Text style={styles.parameterLabel}>Listening Time</Text>
              <Text style={styles.parameterValue}>
                {parseFloat(String(user?.listening_time_hours ?? 0)).toFixed(1)} hrs
              </Text>
            </View>
            <View style={styles.parameterCard}>
              <Text style={styles.parameterLabel}>Liked Songs</Text>
              <Text style={styles.parameterValue}>
                {(user?.liked_songs_count ?? 0) >= 1000 
                  ? `${((user?.liked_songs_count ?? 0) / 1000).toFixed(1)}K` 
                  : (user?.liked_songs_count ?? 0)} items
              </Text>
            </View>
            <View style={styles.parameterCard}>
              <Text style={styles.parameterLabel}>Discovery Streak</Text>
              <Text style={styles.parameterValue}>
                {user?.discovery_streak_days || '0'} days
              </Text>
            </View>
            <View style={styles.parameterCard}>
              <Text style={styles.parameterLabel}>Membership Status</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.parameterValue}>
                  {user?.membership_tier?.toUpperCase() || 'FREE'}
                </Text>
              </View>
              {user?.membership_tier === 'free' && (
                <TouchableOpacity>
                  <Text style={{ color: ORANGE, fontWeight: 'bold' }}>GO PREMIUM</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        ) : (
          <>
            {/* ARTIST/ADMIN ROLE STATS */}
            <View style={styles.parameterCard}>
              <Text style={styles.parameterLabel}>Published Tracks</Text>
              <Text style={styles.parameterValue}>
                {user?.published_tracks_count || '0'} tracks
              </Text>
            </View>
            <View style={styles.parameterCard}>
              <Text style={styles.parameterLabel}>Total Plays</Text>
              <Text style={styles.parameterValue}>
                {(user?.total_plays_count ?? 0) >= 1000 
                  ? `${((user?.total_plays_count ?? 0) / 1000).toFixed(1)}K` 
                  : (user?.total_plays_count ?? 0)}
              </Text>
            </View>
            <View style={styles.parameterCard}>
              <Text style={styles.parameterLabel}>Storage Used</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={styles.storageBar}>
                  <View style={[
                    styles.storageFill, 
                    { width: `${Math.min((parseFloat(String(user?.storage_used_gb ?? 0)) / parseFloat(String(user?.storage_limit_gb ?? 5))) * 100, 100)}%` }
                  ]} />
                </View>
                <Text style={styles.parameterLabel}>
                  {parseFloat(String(user?.storage_used_gb ?? 0)).toFixed(1)} / {parseFloat(String(user?.storage_limit_gb ?? 5)).toFixed(0)} GB
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={{ color: ORANGE, fontWeight: 'bold' }}>GO PREMIUM</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Become an Artist CTA - Only for USER role */}
      {user?.role === 'user' && (
        <>
          {/* PENDING state */}
          {applicationStatus === 'pending' && (
            <View style={{
              marginHorizontal: width * 0.05,
              marginVertical: width * 0.04,
              backgroundColor: '#1a1400',
              borderWidth: 2,
              borderColor: '#f39c12',
              borderRadius: width * 0.025,
              padding: width * 0.04,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: width * 0.03 }}>
                <Ionicons name="time-outline" size={width * 0.1} color="#f39c12" />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#f39c12', fontWeight: '700', fontSize: width * 0.04, letterSpacing: 1 }}>
                    APPLICATION PENDING
                  </Text>
                  <Text style={{ color: '#aaa', fontSize: width * 0.032, marginTop: 4 }}>
                    Your artist application is under review. We{"'"}ll notify you once approved.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* REJECTED state */}
          {applicationStatus === 'rejected' && (
            <TouchableOpacity
              style={{
                marginHorizontal: width * 0.05,
                marginVertical: width * 0.04,
                backgroundColor: '#1a0a0a',
                borderWidth: 2,
                borderColor: '#ff4444',
                borderRadius: width * 0.025,
                padding: width * 0.04,
              }}
              onPress={() => router.push('/artist-application' as any)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: width * 0.03 }}>
                <Ionicons name="close-circle-outline" size={width * 0.1} color="#ff4444" />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#ff4444', fontWeight: '700', fontSize: width * 0.04, letterSpacing: 1 }}>
                    APPLICATION REJECTED
                  </Text>
                  <Text style={{ color: '#aaa', fontSize: width * 0.032, marginTop: 4 }}>
                    Your previous application was rejected. Tap to apply again.
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={width * 0.06} color="#ff4444" />
              </View>
            </TouchableOpacity>
          )}

          {/* DEFAULT: no application yet */}
          {applicationStatus === 'none' && (
            <TouchableOpacity
              style={{
                marginHorizontal: width * 0.05,
                marginVertical: width * 0.04,
                backgroundColor: '#1a1a1a',
                borderWidth: 2,
                borderColor: ORANGE,
                borderRadius: width * 0.025,
                padding: width * 0.04,
              }}
              onPress={() => router.push('/artist-application' as any)}
            >
              <View style={styles.becomeArtistContent}>
                <MaterialIcons name="radio" size={width * 0.12} color={ORANGE} />
                <View style={styles.becomeArtistText}>
                  <Text style={styles.becomeArtistTitle}>READY TO BROADCAST?</Text>
                  <Text style={styles.becomeArtistSubtitle}>Apply for Artist Role</Text>
                </View>
                <Ionicons name="arrow-forward" size={width * 0.06} color={ORANGE} />
              </View>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Role-based Content Section */}
      <View style={styles.signalClustersSection}>
        {user?.role === 'user' ? (
          <>
            {/* USER ROLE: Personal Library */}
            <Text style={styles.logoText}>PERSONAL LIBRARY</Text>
            
            <View style={styles.clusterCard}>
              <MaterialIcons name="playlist-play" size={width * 0.13} color={ORANGE} style={styles.clusterIcon} />
              <View style={styles.clusterDetails}>
                <Text style={styles.clusterTitle}>MY PLAYLISTS</Text>
                <Text style={styles.clusterSubtitle}>
                  {user?.playlists_count || '0'} PLAYLISTS - {user?.liked_songs_count || '0'} TRACKS
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={width * 0.06} color="#666" />
            </View>

            <View style={styles.clusterCard}>
              <MaterialIcons name="people" size={width * 0.13} color={ORANGE} style={styles.clusterIcon} />
              <View style={styles.clusterDetails}>
                <Text style={styles.clusterTitle}>FOLLOWED ARTISTS</Text>
                <Text style={styles.clusterSubtitle}>
                  {user?.followed_artists_count || '0'} ARTISTS
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={width * 0.06} color="#666" />
            </View>

            <TouchableOpacity 
              style={styles.clusterCard}
              onPress={() => router.push('/history' as any)}
            >
              <MaterialIcons name="history" size={width * 0.13} color={ORANGE} style={styles.clusterIcon} />
              <View style={styles.clusterDetails}>
                <Text style={styles.clusterTitle}>LISTENING HISTORY</Text>
                <Text style={styles.clusterSubtitle}>{history.length} TRACKS</Text>
              </View>
              <Ionicons name="chevron-forward" size={width * 0.06} color="#666" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* ARTIST/ADMIN ROLE: Artist Studio */}
            <Text style={styles.logoText}>ARTIST STUDIO</Text>
            
            <View style={styles.clusterCard}>
              <MaterialIcons name="library-music" size={width * 0.13} color={ORANGE} style={styles.clusterIcon} />
              <View style={styles.clusterDetails}>
                <Text style={styles.clusterTitle}>MY PUBLISHED TRACKS</Text>
                <Text style={styles.clusterSubtitle}>
                  {user?.published_tracks_count || '0'} TRACKS - {
                    (user?.total_plays_count ?? 0) >= 1000 
                      ? `${((user?.total_plays_count ?? 0) / 1000).toFixed(1)}K` 
                      : (user?.total_plays_count ?? 0)
                  } PLAYS
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={width * 0.06} color="#666" />
            </View>

            <View style={styles.clusterCard}>
              <MaterialIcons name="bar-chart" size={width * 0.13} color={ORANGE} style={styles.clusterIcon} />
              <View style={styles.clusterDetails}>
                <Text style={styles.clusterTitle}>ANALYTICS & INSIGHTS</Text>
                <Text style={styles.clusterSubtitle}>VIEW PERFORMANCE DATA</Text>
              </View>
              <Ionicons name="chevron-forward" size={width * 0.06} color="#666" />
            </View>

            <View style={styles.clusterCard}>
              <MaterialIcons name="folder" size={width * 0.13} color={ORANGE} style={styles.clusterIcon} />
              <View style={styles.clusterDetails}>
                <Text style={styles.clusterTitle}>DRAFT SESSIONS</Text>
                <Text style={styles.clusterSubtitle}>5 UNRELEASED TRACKS</Text>
              </View>
              <Ionicons name="chevron-forward" size={width * 0.06} color="#666" />
            </View>
          </>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={{
          marginHorizontal: width * 0.05,
          marginTop: width * 0.04,
          marginBottom: width * 0.02,
          backgroundColor: '#1a1a1a',
          borderWidth: 1,
          borderColor: '#ff4444',
          paddingVertical: width * 0.04,
          borderRadius: width * 0.02,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: width * 0.02,
        }}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={width * 0.055} color="#ff4444" />
        <Text style={{ fontSize: width * 0.038, fontWeight: '700', color: '#ff4444', letterSpacing: 1.5 }}>
          LOGOUT
        </Text>
      </TouchableOpacity>

    </ScrollView>

    {/* Edit Profile Modal */}
    <Modal
      visible={isEditModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => !isSavingProfile && setEditModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>EDIT PROFILE</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)} disabled={isSavingProfile}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.editAvatarContainer} onPress={handlePickAvatar} disabled={isSavingProfile || pickingImage}>
            <Image
              source={{ uri: editImage?.uri || user?.profile_pic_url || `https://ui-avatars.com/api/?name=${user?.display_name || user?.username || 'U'}&background=ff8000&color=fff&size=200` }}
              style={styles.editAvatarImg}
            />
            <View style={styles.editAvatarOverlay}>
              {pickingImage ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Ionicons name="camera" size={16} color="#000" />
              )}
            </View>
          </TouchableOpacity>

          <Text style={styles.inputLabel}>DISPLAY NAME</Text>
          <TextInput
            style={styles.textInput}
            value={editDisplayName}
            onChangeText={setEditDisplayName}
            placeholder="Enter display name"
            placeholderTextColor="#666"
            editable={!isSavingProfile}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={() => setEditModalVisible(false)}
              disabled={isSavingProfile}
            >
              <Text style={styles.cancelBtnText}>CANCEL</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.saveBtn, isSavingProfile && { opacity: 0.7 }]} 
              onPress={handleSaveProfile}
              disabled={isSavingProfile}
            >
              {isSavingProfile && <ActivityIndicator size="small" color="#000" />}
              <Text style={styles.saveBtnText}>{isSavingProfile ? 'SAVING...' : 'SAVE CHANGES'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    {/* Custom TabsBar */}
    <TabsBar />
  </SafeAreaView>
  );
};

export default UserScreen;