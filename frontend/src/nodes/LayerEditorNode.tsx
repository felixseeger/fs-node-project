import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NodeResizer, Handle, Position } from '@xyflow/react';
import { Player } from '@remotion/player';
import etro from 'etro';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { InfoIcon } from './NodeIcons';
import { NodeCapabilities } from './nodeCapabilities';
import NodeShell from './NodeShell';
import { TimelineProvider, useTimeline } from '../contexts/TimelineContext';
import { LayerStack, Timeline, Button } from 'blue-ether';
import { LayerItem } from '../components/LayerItem';
import { LayerTimeline } from '../components/LayerTimeline';
import { VideoComposition } from '../remotion/VideoComposition';
import { surface, border, radius, text, ui } from './nodeTokens';
import { RemotionLayer, Keyframe } from '../types/remotion';

function LayerEditorNodeInner({ id, data, selected }: any) {
  const { resolve, update } = useNodeConnections(id, data);
  const capabilities = [NodeCapabilities.VIDEO_EDIT, NodeCapabilities.OUTPUT_VIDEO];
  const [dimensions, setDimensions] = useState({ width: 512, height: 512 });
  const [isExporting, setIsExporting] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  
  const { 
    tracks, addTrack, addClipToTrack, removeClipFromTrack, updateClipInTrack, setTracks,
    currentTime, setCurrentTime 
  } = useTimeline();
  const layers = tracks.flatMap(t => t.clips);

  const playerRef = useRef<any>(null);
  const movieRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRegistryRef = useRef<Map<string, any>>(new Map());
  const isSyncingRef = useRef(false);

  const rawIncomingImages = resolve.image('image-in') || [];
  const rawIncomingVideos = resolve.video('video-in') || [];
  const rawIncomingAudio = resolve.audio('audio-in') || [];

  const incomingImages = Array.isArray(rawIncomingImages) ? rawIncomingImages : [rawIncomingImages].filter(Boolean);
  const incomingVideos = Array.isArray(rawIncomingVideos) ? rawIncomingVideos : [rawIncomingVideos].filter(Boolean);
  const incomingAudio = Array.isArray(rawIncomingAudio) ? rawIncomingAudio : [rawIncomingAudio].filter(Boolean);

  const processedUrlsRef = useRef<Set<string>>(new Set());

  // --- Bidirectional Sync: Node Data <-> TimelineContext ---
  
  // Sync OUT: TimelineContext changes -> React Flow node.data
  useEffect(() => {
    if (isSyncingRef.current) return;
    
    // Only update if tracks actually changed in structure or properties, avoid infinite loops
    const currentDataTracks = JSON.stringify(data.tracks || []);
    const newTracks = JSON.stringify(tracks);
    
    if (currentDataTracks !== newTracks) {
      isSyncingRef.current = true;
      update({ tracks });
      // Reset sync flag on next tick
      setTimeout(() => { isSyncingRef.current = false; }, 0);
    }
  }, [tracks, update, data.tracks]);

  // Sync IN: React Flow node.data changes (e.g. from Chat) -> TimelineContext
  useEffect(() => {
    if (isSyncingRef.current || !data.tracks || !Array.isArray(data.tracks)) return;
    
    const currentContextTracks = JSON.stringify(tracks);
    const newDataTracks = JSON.stringify(data.tracks);
    
    if (currentContextTracks !== newDataTracks) {
      isSyncingRef.current = true;
      setTracks(data.tracks);
      
      // Update processed URLs to prevent re-adding them
      const dataLayers = data.tracks.flatMap((t: any) => t.clips || []);
      dataLayers.forEach((l: any) => {
        if (l.src) processedUrlsRef.current.add(l.src);
      });
      
      setTimeout(() => { isSyncingRef.current = false; }, 0);
    }
  }, [data.tracks, setTracks, tracks]);

  // Helper for adding layer
  const addLayer = (layerData: Omit<RemotionLayer, 'id'>) => {
    let track = tracks.find(t => t.type === layerData.type);
    let targetTrackId = track?.id;
    if (!track) {
      targetTrackId = addTrack({
        type: layerData.type as 'image' | 'video' | 'audio' | 'text',
        name: layerData.type.charAt(0).toUpperCase() + layerData.type.slice(1) + ' Track',
        clips: []
      });
    }
    const newId = crypto.randomUUID();
    addClipToTrack(targetTrackId!, { ...layerData, id: newId } as RemotionLayer);
    return newId;
  };

  const removeLayer = (clipId: string) => {
    tracks.forEach(t => {
      if (t.clips.some(c => c.id === clipId)) {
        removeClipFromTrack(t.id, clipId);
      }
    });
  };

  const updateLayer = (clipId: string, updates: Partial<RemotionLayer>) => {
    tracks.forEach(t => {
      if (t.clips.some(c => c.id === clipId)) {
        updateClipInTrack(t.id, clipId, updates);
      }
    });
  };

  // Initialize etro.Movie
  useEffect(() => {
    if (canvasRef.current && !movieRef.current) {
      movieRef.current = new etro.Movie({
        canvas: canvasRef.current,
        background: new etro.Color(0, 0, 0, 1)
      });
      console.log('etro.Movie initialized');
    }
  }, []);

  // Update canvas dimensions when they change
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = dimensions.width;
      canvasRef.current.height = dimensions.height;
    }
  }, [dimensions]);

  // Synchronize state layers with etro.Movie layers
  useEffect(() => {
    if (!movieRef.current) return;

    // Remove etro layers that are no longer in state
    const stateLayerIds = new Set(layers.map(l => l.id));
    for (const [id, etroLayer] of layerRegistryRef.current.entries()) {
      if (!stateLayerIds.has(id)) {
        movieRef.current.removeLayer(etroLayer);
        layerRegistryRef.current.delete(id);
      }
    }

    // Add or update etro layers
    layers.forEach(layerData => {
      let etroLayer = layerRegistryRef.current.get(layerData.id);

      if (!etroLayer && layerData.src) {
        // Create new etro layer
        if (layerData.type === 'image') {
          const img = new Image();
          img.src = layerData.src;
          etroLayer = new etro.layer.Image({
            startTime: layerData.from / 30,
            duration: layerData.durationInFrames / 30,
            source: img,
            x: 0,
            y: 0,
            width: dimensions.width,
            height: dimensions.height
          });
        } else if (layerData.type === 'video') {
          const video = document.createElement('video');
          video.src = layerData.src;
          video.crossOrigin = "anonymous";
          etroLayer = new etro.layer.Video({
            startTime: layerData.from / 30,
            duration: layerData.durationInFrames / 30,
            source: video,
            x: 0,
            y: 0,
            width: dimensions.width,
            height: dimensions.height
          });
        } else if (layerData.type === 'audio') {
          const audio = document.createElement('audio');
          audio.src = layerData.src;
          audio.crossOrigin = "anonymous";
          etroLayer = new etro.layer.Audio({
            startTime: layerData.from / 30,
            duration: layerData.durationInFrames / 30,
            source: audio
          });
        }
        
        if (etroLayer) {
          movieRef.current.addLayer(etroLayer);
          layerRegistryRef.current.set(layerData.id, etroLayer);
        }
      } else if (etroLayer) {
        // Update existing layer properties
        etroLayer.startTime = layerData.from / 30;
        etroLayer.duration = layerData.durationInFrames / 30;

        // Property binding (TASK-022 & TASK-039)
        const applyProperty = (propName: string, value: any, keyframes?: Keyframe[]) => {
          if (keyframes && keyframes.length > 0) {
            // Apply etro KeyFrame
            const sortedKf = [...keyframes].sort((a, b) => a.time - b.time);
            
            // Adjust for scale
            let multiplier = 1;
            if (propName === 'width') multiplier = dimensions.width;
            if (propName === 'height') multiplier = dimensions.height;
            
            const etroKfs = sortedKf.map(kf => [kf.time / 30, kf.value * multiplier]);
            (etroLayer as any)[propName] = new etro.KeyFrame(...etroKfs);
          } else if (value !== undefined) {
            // Apply static value
            let multiplier = 1;
            if (propName === 'width') multiplier = dimensions.width;
            if (propName === 'height') multiplier = dimensions.height;
            
            (etroLayer as any)[propName] = value * multiplier;
          }
        };

        applyProperty('opacity', layerData.opacity, layerData.keyframes?.opacity);
        applyProperty('x', layerData.x, layerData.keyframes?.x);
        applyProperty('y', layerData.y, layerData.keyframes?.y);
        
        // Scale affects width and height
        if (layerData.keyframes?.scale && layerData.keyframes.scale.length > 0) {
           applyProperty('width', layerData.scale, layerData.keyframes.scale);
           applyProperty('height', layerData.scale, layerData.keyframes.scale);
        } else if (layerData.scale !== undefined) {
           applyProperty('width', layerData.scale);
           applyProperty('height', layerData.scale);
        }
      }
    });
  }, [layers, dimensions]);

  // Process incoming media in batches to avoid race conditions
  // When multiple files arrive simultaneously, we batch them by type
  // and add them to a single track instead of creating redundant tracks
  useEffect(() => {
    // Batch process images
    const newImages = incomingImages.filter((url: string) => !processedUrlsRef.current.has(url));
    if (newImages.length > 0) {
      // Find or create the image track ONCE
      let track = tracks.find(t => t.type === 'image');
      let targetTrackId = track?.id;
      if (!track) {
        targetTrackId = addTrack({
          type: 'image',
          name: 'Image Track',
          clips: []
        });
      }
      // Add all new images to the same track
      newImages.forEach((url: string) => {
        const newId = crypto.randomUUID();
        addClipToTrack(targetTrackId!, {
          src: url,
          type: 'image',
          from: 0,
          durationInFrames: 120,
          zIndex: layers.length,
          status: 'completed',
          progress: 100,
          jobType: 'none',
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          id: newId
        } as RemotionLayer);
        processedUrlsRef.current.add(url);
      });
    }

    // Batch process videos
    const newVideos = incomingVideos.filter((url: string) => !processedUrlsRef.current.has(url));
    if (newVideos.length > 0) {
      let track = tracks.find(t => t.type === 'video');
      let targetTrackId = track?.id;
      if (!track) {
        targetTrackId = addTrack({
          type: 'video',
          name: 'Video Track',
          clips: []
        });
      }
      newVideos.forEach((url: string) => {
        const newId = crypto.randomUUID();
        addClipToTrack(targetTrackId!, {
          src: url,
          type: 'video',
          from: 0,
          durationInFrames: 120,
          zIndex: layers.length,
          status: 'completed',
          progress: 100,
          jobType: 'none',
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          id: newId
        } as RemotionLayer);
        processedUrlsRef.current.add(url);
      });
    }

    // Batch process audio
    const newAudio = incomingAudio.filter((url: string) => !processedUrlsRef.current.has(url));
    if (newAudio.length > 0) {
      let track = tracks.find(t => t.type === 'audio');
      let targetTrackId = track?.id;
      if (!track) {
        targetTrackId = addTrack({
          type: 'audio',
          name: 'Audio Track',
          clips: []
        });
      }
      newAudio.forEach((url: string) => {
        const newId = crypto.randomUUID();
        addClipToTrack(targetTrackId!, {
          src: url,
          type: 'audio',
          from: 0,
          durationInFrames: 300,
          zIndex: 0,
          status: 'completed',
          progress: 100,
          jobType: 'none',
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          id: newId
        } as RemotionLayer);
        processedUrlsRef.current.add(url);
      });
    }
  }, [incomingImages, incomingVideos, incomingAudio]);

  useEffect(() => {
    if (!playerRef.current) return;
    
    const interval = setInterval(() => {
      if (playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentFrame());
      }
    }, 1000 / 30);
    
    return () => clearInterval(interval);
  }, []);

  const handleAddLayer = (type: 'image' | 'video' | 'audio' | 'text') => {
    addLayer({
      src: '',
      type,
      from: 0,
      durationInFrames: type === 'audio' ? 300 : 120,
      zIndex: type === 'audio' ? 0 : layers.length,
      status: 'idle',
      progress: 0,
      jobType: 'none',
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/vfx/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          layers,
          dimensions,
          durationInFrames: 120,
          fps: 30
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.jobId) {
        // Start polling for job status
        pollExportStatus(result.jobId);
      }
    } catch (err) {
      console.error('Export failed:', err);
      setIsExporting(false);
    }
  };

  const pollExportStatus = async (jobId: string) => {
    try {
      const response = await fetch(`/api/vfx/job/${jobId}/status`);
      const data = await response.json();

      if (data.status === 'completed' && data.resultUrl) {
        update({ outputVideo: data.resultUrl });
        setIsExporting(false);
      } else if (data.status === 'failed') {
        console.error('Export job failed:', data.error);
        setIsExporting(false);
      } else {
        // Poll again after 2 seconds
        setTimeout(() => pollExportStatus(jobId), 2000);
      }
    } catch (err) {
      console.error('Polling failed:', err);
      setIsExporting(false);
    }
  };

  const handleEtroExport = async () => {
    if (!movieRef.current) return;
    setIsExporting(true);
    try {
      // client-side record using etro-js
      const blob = await movieRef.current.record({
        frameRate: 30,
        type: 'video/webm'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `composition-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
    } catch (err) {
      console.error('Etro export failed:', err);
      setIsExporting(false);
    }
  };

  const handlePlay = () => {
    if (movieRef.current) movieRef.current.play();
    if (playerRef.current) playerRef.current.play();
  };

  const handlePause = () => {
    if (movieRef.current) movieRef.current.pause();
    if (playerRef.current) playerRef.current.pause();
  };

  const nodeStyles = {
    panelContainer: {
      position: 'absolute' as const,
      top: '16px',
      right: '352px',
      fontFamily: 'DM Sans, system-ui, sans-serif',
      color: text.primary,
      width: '320px',
      zIndex: 1400,
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    sectionHeader: {
      backgroundColor: surface.sunken,
      borderRadius: `${radius.md}px`,
      padding: '10px 14px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: `1px solid ${border.default}`,
    },
    sectionBody: {
      backgroundColor: surface.deep,
      borderRadius: `${radius.md}px`,
      padding: '12px 14px',
      border: `1px solid ${border.default}`,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    titleText: {
      fontSize: '12px',
      fontWeight: 600,
      color: text.primary,
    },
    btn: {
      padding: '8px 12px',
      backgroundColor: ui.link,
      color: '#fff',
      border: 'none',
      borderRadius: `${radius.sm}px`,
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
      width: '100%'
    }
  };

  return (
    <NodeShell
      label="Layer Editor"
      selected={selected}
      capabilities={capabilities}
      dotColor={getHandleColor('video')}
    >
      <NodeResizer 
        color={ui.link} 
        isVisible={selected} 
        minWidth={256} 
        minHeight={256}
        keepAspectRatio={true}
        onResize={(_, params) => setDimensions({ width: Math.round(params.width), height: Math.round(params.height) })}
      />
      <div style={{ 
        width: dimensions.width, 
        height: dimensions.height, 
        backgroundColor: surface.canvas, 
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        margin: '0 -12px -12px -12px'
      }}>
        <Handle type="target" position={Position.Left} id="image-in" style={{ top: '30%', width: 14, height: 14, background: getHandleColor('image'), border: `2px solid ${surface.canvas}`, left: -8, zIndex: 100 }} />
        <Handle type="target" position={Position.Left} id="video-in" style={{ top: '50%', width: 14, height: 14, background: getHandleColor('video'), border: `2px solid ${surface.canvas}`, left: -8, zIndex: 100 }} />
        <Handle type="target" position={Position.Left} id="audio-in" style={{ top: '70%', width: 14, height: 14, background: getHandleColor('audio'), border: `2px solid ${surface.canvas}`, left: -8, zIndex: 100 }} />
        
        <Handle type="source" position={Position.Right} id="image-out" style={{ top: '30%', width: 14, height: 14, background: getHandleColor('image'), border: `2px solid ${surface.canvas}`, right: -8, zIndex: 100 }} />
        <Handle type="source" position={Position.Right} id="video-out" style={{ top: '50%', width: 14, height: 14, background: getHandleColor('video'), border: `2px solid ${surface.canvas}`, right: -8, zIndex: 100 }} />
        <Handle type="source" position={Position.Right} id="audio-out" style={{ top: '70%', width: 14, height: 14, background: getHandleColor('audio'), border: `2px solid ${surface.canvas}`, right: -8, zIndex: 100 }} />
        
        <Player
          ref={playerRef}
          component={VideoComposition}
          inputProps={{ layers }}
          durationInFrames={120}
          compositionWidth={dimensions.width}
          compositionHeight={dimensions.height}
          fps={30}
          style={{
            width: '100%',
            height: '100%',
          }}
          controls
          autoPlay
          loop
          acknowledgeRemotionLicense={true}
        />

        {/* etro-js Canvas Target */}
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'block'
          }}
        />
      </div>

      {selected && createPortal(
        <div style={nodeStyles.panelContainer} onPointerDown={(e) => e.stopPropagation()}>
          <div style={nodeStyles.wrapper}>
            <div style={nodeStyles.sectionHeader}>
              <span style={nodeStyles.titleText}>Layer Editor</span>
              <InfoIcon style={{ color: text.muted }} />
            </div>

            <div style={nodeStyles.sectionBody}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={nodeStyles.titleText}>Timeline</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <Button 
                    variant="secondary"
                    onClick={handlePlay}
                    style={{ padding: '2px 8px', fontSize: '10px' }}
                  >
                    Play
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={handlePause}
                    style={{ padding: '2px 8px', fontSize: '10px' }}
                  >
                    Pause
                  </Button>
                </div>
              </div>
              <Timeline 
                value={currentTime} 
                max={120} 
                onChange={(f) => {
                  setCurrentTime(f);
                  if (playerRef.current) {
                    playerRef.current.seekTo(f);
                  }
                  if (movieRef.current) {
                    movieRef.current.seek(f / 30);
                  }
                }} 
                style={{ marginBottom: '8px' }}
              />
              <LayerTimeline 
                tracks={tracks} 
                durationInFrames={120} 
                currentFrame={currentTime}
                onSeek={(f) => {
                  setCurrentTime(f);
                  if (playerRef.current) {
                    playerRef.current.seekTo(f);
                  }
                  if (movieRef.current) {
                    movieRef.current.seek(f / 30);
                  }
                }}
              />
            </div>

            <div style={nodeStyles.sectionBody}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={nodeStyles.titleText}>Layers ({layers.length})</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <Button 
                    variant="secondary"
                    onClick={() => handleAddLayer('video')}
                    style={{ color: '#14b8a6', borderColor: '#14b8a6', padding: '4px 6px', fontSize: '10px' }}
                  >
                    + Video
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => handleAddLayer('image')}
                    style={{ color: '#ec4899', borderColor: '#ec4899', padding: '4px 6px', fontSize: '10px' }}
                  >
                    + Image
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => handleAddLayer('audio')}
                    style={{ color: '#a855f7', borderColor: '#a855f7', padding: '4px 6px', fontSize: '10px' }}
                  >
                    + Audio
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => handleAddLayer('text')}
                    style={{ color: '#f97316', borderColor: '#f97316', padding: '4px 6px', fontSize: '10px' }}
                  >
                    + Text
                  </Button>
                </div>
              </div>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {layers.length > 0 ? (
                  <>
                    <LayerStack
                      layers={layers.map(l => ({
                        id: l.id,
                        name: `${l.type} Layer`,
                        opacity: Math.round((l.opacity ?? 1) * 100),
                        visible: true,
                        locked: false,
                      }))}
                      selectedId={selectedLayerId}
                      onSelect={setSelectedLayerId}
                      onLayerChange={(id, updates) => {
                        const nodeUpdates: Partial<RemotionLayer> = {};
                        if (updates.opacity !== undefined) {
                          nodeUpdates.opacity = updates.opacity / 100;
                        }
                        updateLayer(id, nodeUpdates);
                      }}
                      onReorder={() => {}}
                    />
                    {selectedLayerId && layers.find(l => l.id === selectedLayerId) && (
                      <LayerItem 
                        layer={layers.find(l => l.id === selectedLayerId)!} 
                        onUpdate={updateLayer} 
                        onDelete={(id) => {
                          removeLayer(id);
                          if (id === selectedLayerId) setSelectedLayerId(null);
                        }} 
                      />
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: text.muted, fontSize: '12px', padding: '16px' }}>
                    No layers added yet.
                  </div>
                )}
              </div>
            </div>

            <div style={nodeStyles.sectionBody}>
              <Button 
                variant="primary"
                style={{ width: '100%', cursor: isExporting ? 'not-allowed' : 'pointer' }} 
                onClick={handleEtroExport} 
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : 'Export Video (Client)'}
              </Button>
              <Button 
                variant="secondary"
                style={{ width: '100%', marginTop: '8px', cursor: isExporting ? 'not-allowed' : 'pointer' }} 
                onClick={handleExport} 
                disabled={isExporting}
              >
                {isExporting ? 'Processing...' : 'Render on Server'}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </NodeShell>
  );
}

export default function LayerEditorNode(props: any) {
  return (
    <TimelineProvider>
      <LayerEditorNodeInner {...props} />
    </TimelineProvider>
  );
}
