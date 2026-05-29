import { useLocalSearchParams } from 'expo-router';
import ArtistDetailScreen from '@/src/screens/artistDetail';

export default function ArtistDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ArtistDetailScreen artistId={id} />;
}
