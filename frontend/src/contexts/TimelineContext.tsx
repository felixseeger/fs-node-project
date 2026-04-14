import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { RemotionLayer } from '../types/remotion';

export interface Track {
  id: string;
  type: 'video' | 'audio' | 'image' | 'text';
  name: string;
  clips: RemotionLayer[];
}

interface TimelineState {
  currentTime: number;
  durationInFrames: number;
  fps: number;
  zoomLevel: number;
  tracks: Track[];
}

interface TimelineContextType extends TimelineState {
  setCurrentTime: (time: number) => void;
  setDurationInFrames: (duration: number) => void;
  setFps: (fps: number) => void;
  setZoomLevel: (zoom: number) => void;
  setTracks: (tracks: Track[] | ((prev: Track[]) => Track[])) => void;
  addTrack: (track: Omit<Track, 'id'>) => string;
  removeTrack: (id: string) => void;
  addClipToTrack: (trackId: string, clip: RemotionLayer) => void;
  removeClipFromTrack: (trackId: string, clipId: string) => void;
  updateClipInTrack: (trackId: string, clipId: string, updates: Partial<RemotionLayer>) => void;
  splitClip: (trackId: string, clipId: string, splitFrame: number) => void;
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const TimelineProvider = ({ children }: { children: ReactNode }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [durationInFrames, setDurationInFrames] = useState(120);
  const [fps, setFps] = useState(30);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [tracks, setTracks] = useState<Track[]>([]);

  const addTrack = useCallback((track: Omit<Track, 'id'>) => {
    const id = crypto.randomUUID();
    setTracks(prev => [...prev, { ...track, id }]);
    return id;
  }, []);

  const removeTrack = useCallback((id: string) => {
    setTracks(prev => prev.filter(t => t.id !== id));
  }, []);

  const addClipToTrack = useCallback((trackId: string, clip: RemotionLayer) => {
    setTracks(prev => prev.map(t => 
      t.id === trackId ? { ...t, clips: [...t.clips, clip] } : t
    ));
  }, []);

  const removeClipFromTrack = useCallback((trackId: string, clipId: string) => {
    setTracks(prev => prev.map(t => 
      t.id === trackId ? { ...t, clips: t.clips.filter(c => c.id !== clipId) } : t
    ));
  }, []);

  const updateClipInTrack = useCallback((trackId: string, clipId: string, updates: Partial<RemotionLayer>) => {
    setTracks(prev => prev.map(t => 
      t.id === trackId ? { 
        ...t, 
        clips: t.clips.map(c => c.id === clipId ? { ...c, ...updates } : c) 
      } : t
    ));
  }, []);

  const splitClip = useCallback((trackId: string, clipId: string, splitFrame: number) => {
    setTracks(prev => prev.map(t => {
      if (t.id !== trackId) return t;
      const clipIndex = t.clips.findIndex(c => c.id === clipId);
      if (clipIndex === -1) return t;
      
      const originalClip = t.clips[clipIndex];
      
      // Ensure splitFrame is within the clip's boundaries
      if (splitFrame <= originalClip.from || splitFrame >= originalClip.from + originalClip.durationInFrames) {
        return t;
      }
      
      const firstDuration = splitFrame - originalClip.from;
      const secondDuration = originalClip.durationInFrames - firstDuration;
      
      const newClips = [...t.clips];
      
      // Update first part
      newClips[clipIndex] = {
        ...originalClip,
        durationInFrames: firstDuration
      };
      
      // Add second part
      const secondPart = {
        ...originalClip,
        id: crypto.randomUUID(),
        from: splitFrame,
        durationInFrames: secondDuration
      };
      
      newClips.splice(clipIndex + 1, 0, secondPart);
      
      return { ...t, clips: newClips };
    }));
  }, []);

  return (
    <TimelineContext.Provider value={{
      currentTime, setCurrentTime,
      durationInFrames, setDurationInFrames,
      fps, setFps,
      zoomLevel, setZoomLevel,
      tracks, setTracks,
      addTrack, removeTrack,
      addClipToTrack, removeClipFromTrack, updateClipInTrack, splitClip
    }}>
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
};
