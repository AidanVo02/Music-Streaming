import { useLocalSearchParams } from 'expo-router';
import PlayerScreen from '@/src/screens/player';

export default function PlayerPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PlayerScreen trackId={id} />;
}
