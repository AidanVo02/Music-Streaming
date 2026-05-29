import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuthContext } from '@/src/context/AuthContext';
import { PlayerProvider } from '@/src/context/PlayerContext';
import { QueueProvider } from '@/src/context/QueueContext';
import { LikeProvider } from '@/src/context/LikeContext';
import MiniPlayer from '@/src/components/miniPlayer/MiniPlayer';

function RootNavigator() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';
    if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#ff8000" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="artist/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="player/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="playlist/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="artist-application" options={{ headerShown: false }} />
        <Stack.Screen name="liked-songs" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="history" options={{ headerShown: false }} />
      </Stack>

      {/* MiniPlayer floats above TabsBar on all screens */}
      <MiniPlayer />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <QueueProvider>
          <LikeProvider>
            <RootNavigator />
          </LikeProvider>
        </QueueProvider>
      </PlayerProvider>
    </AuthProvider>
  );
}
