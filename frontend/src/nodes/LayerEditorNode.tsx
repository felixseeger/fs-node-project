import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NodeResizer, Handle, Position } from '@xyflow/react';
import { Player } from '@remotion/player';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { InfoIcon } from './NodeIcons';
import { NodeCapabilities } from './nodeCapabilities';
import NodeShell from './NodeShell';
import { useLayerManager } from '../hooks/useLayerManager';
import { LayerItem } from '../components/LayerItem';
import { LayerTimeline } from '../components/LayerTimeline';
import { VideoComposition } from '../remotion/VideoComposition';

export default function LayerEditorNode({ id, data, selected }: any) {
  const { resolve, update } = useNodeConnections(id, data);
  const capabilities = [NodeCapabilities.VIDEO_EDIT, NodeCapabilities.OUTPUT_VIDEO];
  const [dimensions, setDimensions] = useState({ width: 512, height: 512 });
  const [isExporting, setIsExporting] = useState(false);
  
  const { layers, addLayer, removeLayer, updateLayer } = useLayerManager([]);
  const playerRef = useRef<any>(null);
  const [currentFrame, setCurrentFrame] = useState(0);

  const rawIncomingImages = resolve.image('image-in') || [];
  const rawIncomingVideos = resolve.video('video-in') || [];

  const processedUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    rawIncomingImages.forEach((url: string) => {
      if (!processedUrlsRef.current.has(url)) {
        addLayer({
          src: url,
          type: 'image',
          from: 0,
          durationInFrames: 120,
          zIndex: layers.length,
          status: 'completed',
          progress: 100,
          jobType: 'none'
        });
        processedUrlsRef.current.add(url);
      }
    });

    rawIncomingVideos.forEach((url: string) => {
      if (!processedUrlsRef.current.has(url)) {
        addLayer({
          src: url,
          type: 'video',
          from: 0,
          durationInFrames: 120,
          zIndex: layers.length,
          status: 'completed',
          progress: 100,
          jobType: 'none'
        });
        processedUrlsRef.current.add(url);
      }
    });
  }, [rawIncomingImages, rawIncomingVideos, addLayer, layers.length]);

  useEffect(() => {
    if (!playerRef.current) return;
    
    const interval = setInterval(() => {
      if (playerRef.current) {
        setCurrentFrame(playerRef.current.getCurrentFrame());
      }
    }, 1000 / 30);
    
    return () => clearInterval(interval);
  }, []);

  const handleAddLayer = () => {
    addLayer({
      src: '',
      type: 'video',
      from: 0,
      durationInFrames: 120,
      zIndex: layers.length,
      status: 'idle',
      progress: 0,
      jobType: 'ltx'
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/render-video', {
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
      if (result.success && result.url) {
        update({ outputVideo: result.url });
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const timelineLayers = layers.map(l => ({
    id: l.id,
    name: l.type + ' ' + l.id.substring(0, 4),
    from: l.from,
    durationInFrames: l.durationInFrames,
    color: l.type === 'video' ? '#14b8a6' : l.type === 'image' ? '#ec4899' : '#3b82f6'
  }));

  const styles = {
    panelContainer: {
      position: 'absolute' as const,
      top: '64px',
      right: '20px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#E0E0E0',
      width: '320px',
      zIndex: 1000,
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    sectionHeader: {
      backgroundColor: '#2a2a2a',
      borderRadius: '8px',
      padding: '10px 14px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid #3a3a3a',
    },
    sectionBody: {
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      padding: '12px 14px',
      border: '1px solid #3a3a3a',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    titleText: {
      fontSize: '12px',
      fontWeight: 600,
      color: '#E0E0E0',
    },
    btn: {
      padding: '8px 12px',
      backgroundColor: '#3b82f6',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
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
        color="#3b82f6" 
        isVisible={selected} 
        minWidth={256} 
        minHeight={256}
        keepAspectRatio={true}
        onResize={(_, params) => setDimensions({ width: Math.round(params.width), height: Math.round(params.height) })}
      />
      <div style={{ 
        width: dimensions.width, 
        height: dimensions.height, 
        backgroundColor: '#0a0a0a', 
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        margin: '0 -12px -12px -12px'
      }}>
        <Handle type="target" position={Position.Left} id="image-in" style={{ top: '40%', width: 14, height: 14, background: getHandleColor('image'), border: '2px solid #1a1a1a', left: -8, zIndex: 100 }} />
        <Handle type="target" position={Position.Left} id="video-in" style={{ top: '60%', width: 14, height: 14, background: getHandleColor('video'), border: '2px solid #1a1a1a', left: -8, zIndex: 100 }} />
        
        <Handle type="source" position={Position.Right} id="image-out" style={{ top: '40%', width: 14, height: 14, background: getHandleColor('image'), border: '2px solid #1a1a1a', right: -8, zIndex: 100 }} />
        <Handle type="source" position={Position.Right} id="video-out" style={{ top: '60%', width: 14, height: 14, background: getHandleColor('video'), border: '2px solid #1a1a1a', right: -8, zIndex: 100 }} />
        
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
        />
      </div>

      {selected && createPortal(
        <div style={styles.panelContainer} onPointerDown={(e) => e.stopPropagation()}>
          <div style={styles.wrapper}>
            <div style={styles.sectionHeader}>
              <span style={styles.titleText}>Layer Editor</span>
              <InfoIcon style={{ color: '#999' }} />
            </div>

            <div style={styles.sectionBody}>
              <span style={styles.titleText}>Timeline</span>
              <LayerTimeline 
                layers={timelineLayers} 
                durationInFrames={120} 
                currentFrame={currentFrame}
                onSeek={(f) => {
                  setCurrentFrame(f);
                  if (playerRef.current) {
                    playerRef.current.seekTo(f);
                  }
                }}
              />
            </div>

            <div style={styles.sectionBody}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={styles.titleText}>Layers ({layers.length})</span>
                <button 
                  onClick={handleAddLayer}
                  style={{
                    background: 'transparent',
                    color: '#3b82f6',
                    border: '1px solid #3b82f6',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Layer
                </button>
              </div>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {layers.map(l => (
                  <LayerItem 
                    key={l.id} 
                    layer={l} 
                    onUpdate={updateLayer} 
                    onDelete={removeLayer} 
                  />
                ))}
                {layers.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#666', fontSize: '12px', padding: '16px' }}>
                    No layers added yet.
                  </div>
                )}
              </div>
            </div>

            <div style={styles.sectionBody}>
              <button 
                style={{ ...styles.btn, backgroundColor: isExporting ? '#1d4ed8' : '#3b82f6', cursor: isExporting ? 'not-allowed' : 'pointer' }} 
                onClick={handleExport} 
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : 'Export Video'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </NodeShell>
  );
}
