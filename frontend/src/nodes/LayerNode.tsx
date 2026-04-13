import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Player, PlayerRef } from '@remotion/player';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import NodeShell from './NodeShell';
import { NodeCapabilities } from './nodeCapabilities';
import { VideoComposition } from '../remotion/VideoComposition';
import { RemotionLayer } from '../types/remotion';
import { LayerTimeline, TimelineLayer } from '../components/LayerTimeline';

export default function LayerNode({ id, data, selected }: any) {
  const { resolve } = useNodeConnections(id, data);
  const capabilities = [NodeCapabilities.VIDEO_EDIT, NodeCapabilities.OUTPUT_VIDEO];
  const [dimensions, setDimensions] = useState({ width: 512, height: 512 });
  const [currentFrame, setCurrentFrame] = useState(0);
  const playerRef = useRef<PlayerRef>(null);

  const rawIncomingImages = resolve.image('image-in') || [];
  const rawIncomingVideos = resolve.video('video-in') || [];
  const rawIncomingAudio = resolve.audio('audio-in') || [];

  const incomingImages = Array.isArray(rawIncomingImages) ? rawIncomingImages : [rawIncomingImages].filter(Boolean);
  const incomingVideos = Array.isArray(rawIncomingVideos) ? rawIncomingVideos : [rawIncomingVideos].filter(Boolean);
  const incomingAudio = Array.isArray(rawIncomingAudio) ? rawIncomingAudio : [rawIncomingAudio].filter(Boolean);

  const durationInFrames = 150; // Default 5 seconds at 30fps
  const fps = 30;

  const layers: RemotionLayer[] = useMemo(() => {
    const newLayers: RemotionLayer[] = [];
    let zIndex = 0;

    incomingVideos.forEach((src, i) => {
      newLayers.push({
        id: `video-${i}`,
        src,
        type: 'video',
        from: 0,
        durationInFrames,
        zIndex: zIndex++
      });
    });

    incomingImages.forEach((src, i) => {
      newLayers.push({
        id: `image-${i}`,
        src,
        type: 'image',
        from: 0,
        durationInFrames,
        zIndex: zIndex++
      });
    });

    incomingAudio.forEach((src, i) => {
      newLayers.push({
        id: `audio-${i}`,
        src,
        type: 'audio',
        from: 0,
        durationInFrames,
        zIndex: zIndex++
      });
    });

    return newLayers;
  }, [incomingImages, incomingVideos, incomingAudio, durationInFrames]);

  const timelineLayers: TimelineLayer[] = useMemo(() => {
    return layers.map(l => ({
      id: l.id,
      name: `${l.type} layer`,
      from: l.from,
      durationInFrames: l.durationInFrames,
      color: l.type === 'video' ? '#14b8a6' : l.type === 'image' ? '#ec4899' : '#a855f7'
    }));
  }, [layers]);

  const handleSeek = (frame: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(frame);
      setCurrentFrame(frame);
    }
  };

  useEffect(() => {
    if (!playerRef.current) return;
    
    const { current } = playerRef;
    const onFrameUpdate = (e: any) => {
      setCurrentFrame(e.detail.frame);
    };

    current.addEventListener('frameupdate', onFrameUpdate);
    return () => {
      current.removeEventListener('frameupdate', onFrameUpdate);
    };
  }, []);

  return (
    <NodeShell
      label="Remotion Layer Node"
      selected={selected}
      capabilities={capabilities}
      dotColor={getHandleColor('video')}
    >
      <NodeResizer 
        color="#3b82f6" 
        isVisible={selected} 
        minWidth={256} 
        minHeight={256}
        keepAspectRatio={true}
        onResize={(e, params) => setDimensions({ width: Math.round(params.width), height: Math.round(params.height) })}
      />
      
      <div style={{ 
        width: dimensions.width, 
        height: dimensions.height + (selected ? 160 : 0), 
        backgroundColor: '#0a0a0a', 
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        margin: '0 -12px -12px -12px',
        transition: 'height 0.2s ease'
      }}>
        <Handle type="target" position={Position.Left} id="image-in" style={{ top: '30%', width: 14, height: 14, background: getHandleColor('image'), border: '2px solid #1a1a1a', left: -8, zIndex: 100 }} />
        <Handle type="target" position={Position.Left} id="video-in" style={{ top: '50%', width: 14, height: 14, background: getHandleColor('video'), border: '2px solid #1a1a1a', left: -8, zIndex: 100 }} />
        <Handle type="target" position={Position.Left} id="audio-in" style={{ top: '70%', width: 14, height: 14, background: getHandleColor('audio'), border: '2px solid #1a1a1a', left: -8, zIndex: 100 }} />
        
        <Handle type="source" position={Position.Right} id="video-out" style={{ top: '50%', width: 14, height: 14, background: getHandleColor('video'), border: '2px solid #1a1a1a', right: -8, zIndex: 100 }} />

        <div style={{ width: dimensions.width, height: dimensions.height, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <Player
            ref={playerRef}
            component={VideoComposition}
            inputProps={{ layers }}
            durationInFrames={durationInFrames}
            compositionWidth={dimensions.width}
            compositionHeight={dimensions.height}
            fps={fps}
            style={{ width: '100%', height: '100%' }}
            controls
            autoPlay={false}
            loop
          />
        </div>

        {selected && (
          <div style={{ padding: '8px', borderTop: '1px solid #333', backgroundColor: '#111', flex: 1, overflow: 'hidden' }}>
            <LayerTimeline 
              layers={timelineLayers}
              durationInFrames={durationInFrames}
              currentFrame={currentFrame}
              onSeek={handleSeek}
            />
          </div>
        )}
      </div>
    </NodeShell>
  );
}
