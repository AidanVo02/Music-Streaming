import { useEffect, useCallback, useRef } from 'react';
import { usePlayer } from '@/src/context/PlayerContext';
import { useQueue } from '@/src/context/QueueContext';
import ApiService from '@/src/server/apiService';

/**
 * Hook to integrate Player with Queue
 * - Auto-play next track when current track ends
 * - Smart Radio: Find similar tracks and add to Queue
 * - Previous/Next: Navigate within Queue
 */
export function usePlayerQueue() {
  const player = usePlayer();
  const queue = useQueue();

  // Guard ref to prevent handleTrackEnd from firing multiple times per track end
  const trackEndFiredRef = useRef(false);

  // Reset guard when track changes
  useEffect(() => {
    trackEndFiredRef.current = false;
  }, [player.currentTrack?.track_id]);

  // Auto-play next track when current track ends
  useEffect(() => {
    if (player.isTrackEnded && !trackEndFiredRef.current) {
      trackEndFiredRef.current = true;
      handleTrackEnd();
    }
  }, [player.isTrackEnded]);

  const handleTrackEnd = useCallback(async () => {
    await playNext();
  }, [queue, player]);

  // Smart Next: Queue first, then Smart Radio (add to Queue)
  const playNext = useCallback(async () => {
    console.log('⏭️ Next button pressed');
    console.log('📊 Queue length:', queue.queue.length);
    console.log('� Current index:', queue.currentIndex);
    
    // Try queue first - check if there's a next track
    if (queue.hasNext()) {
      const nextTrack = queue.playNext();
      if (nextTrack) {
        console.log('✅ Playing next from queue:', nextTrack.title);
        await player.playTrack(nextTrack);
        return;
      }
    }

    // No next in queue → Smart Radio mode (find similar track and add to queue)
    if (player.currentTrack) {
      try {
        console.log('🎵 Smart Radio: Finding similar track...');
        const response = await ApiService.request(
          `/api/tracks/${player.currentTrack.track_id}/similar?limit=1`
        );
        
        if (response.success && response.data && response.data.length > 0) {
          const rawTrack = response.data[0];
          console.log('✅ Found similar track:', rawTrack.title);
          
          // Ensure track has all required fields with fallbacks
          const similarTrack = {
            track_id: rawTrack.track_id,
            title: rawTrack.title || 'Unknown Title',
            originator: rawTrack.originator || 'Unknown Artist',
            cover_image_url: rawTrack.cover_image_url || null,
            audio_url: rawTrack.audio_url || rawTrack.file_path,
            file_path: rawTrack.file_path || rawTrack.audio_url,
            duration: rawTrack.duration || 0,
            genre: rawTrack.genre || null,
            artist_id: rawTrack.artist_id || null,
            album_id: rawTrack.album_id || null,
            play_count: rawTrack.play_count || 0,
          };
          
          // Add to queue and play immediately to avoid stale state issues during transition
          const trackToPlay = queue.addToQueueAndPlay(similarTrack);
          console.log('➕ Smart Radio added to queue and playing:', trackToPlay.title);
          await player.playTrack(trackToPlay);
        } else {
          console.log('⚠️ No similar tracks found');
        }
      } catch (error) {
        console.error('❌ Failed to fetch similar track:', error);
      }
    }
  }, [queue, player]);

  // Previous: Navigate back in Queue only
  const playPrevious = useCallback(async () => {
    console.log('⏮️ Previous button pressed');
    console.log('📊 Queue length:', queue.queue.length);
    console.log('� Current index:', queue.currentIndex);
    
    // Try queue - check if there's a previous track
    if (queue.hasPrevious()) {
      const prevTrack = queue.playPrevious();
      if (prevTrack) {
        console.log('✅ Playing previous from queue:', prevTrack.title);
        await player.playTrack(prevTrack);
        return;
      }
    }

    // No previous in queue
    console.log('⚠️ No previous track in queue');
  }, [queue, player]);

  const playTrackAtIndex = useCallback(async (index: number) => {
    const track = queue.playTrackAtIndex(index);
    if (track) {
      await player.playTrack(track);
    }
  }, [queue, player]);

  return {
    playNext,
    playPrevious,
    playTrackAtIndex,
    hasNext: true, // Always true - can always find similar track
    hasPrevious: queue.hasPrevious(), // Only enabled if has previous in queue
  };
}
