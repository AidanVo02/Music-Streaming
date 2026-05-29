import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLikes } from '@/src/context/LikeContext';
import { useAuthContext } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

interface LikeButtonProps {
  trackId: number | string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
  likedColor?: string;
}

export default function LikeButton({ 
  trackId, 
  size = 24, 
  style, 
  color = '#aaa', 
  likedColor = '#ff8000' 
}: LikeButtonProps) {
  const { isLiked, toggleLike, loading } = useLikes();
  const { user } = useAuthContext();
  const router = useRouter();

  const handlePress = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to like tracks.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/login' as any) }
      ]);
      return;
    }
    
    await toggleLike(trackId);
  };

  if (loading) {
     return (
       <TouchableOpacity style={style} disabled>
         <ActivityIndicator size="small" color={color} />
       </TouchableOpacity>
     );
  }

  const liked = isLiked(trackId);

  return (
    <TouchableOpacity onPress={handlePress} style={style} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Ionicons 
        name={liked ? "heart" : "heart-outline"} 
        size={size} 
        color={liked ? likedColor : color} 
      />
    </TouchableOpacity>
  );
}
