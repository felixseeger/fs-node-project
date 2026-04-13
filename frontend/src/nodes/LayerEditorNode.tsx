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
import { surface, border, radius, font, text, ui, CATEGORY_COLORS, sp } from './nodeTokens';

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
  const rawIncomingAudio = resolve.audio('audio-in') || [];

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
    
    rawIncomingAudio.forEach((url: string) => {
      if (!processedUrlsRef.current.has(url)) {
        addLayer({
          src: url,
          type: 'audio',
          from: 0,
          durationInFrames: 300,
          zIndex: 0,
          status: 'completed',
          progress: 100,
          jobType: 'none'
        });
        processedUrlsRef.current.add(url);
      }
    });
  }, [rawIncomingImages, rawIncomingVideos, rawIncomingAudio, addLayer, layers.length]);

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

  const timelineLayers = layers.map(l => ({
    id: l.id,
    name: l.type + ' ' + l.id.substring(0, 4),
    from: l.from,
    durationInFrames: l.durationInFrames,
    type: l.type,
    src: l.src,
    color: l.type === 'video' ? '#14b8a6' : l.type === 'image' ? '#ec4899' : l.type === 'audio' ? '#a855f7' : '#3b82f6'
  }));

  const nodeStyles = {
    panelContainer: {
      position: 'absolute' as const,
      top: '64px',
      right: '20px',
      fontFamily: 'DM Sans, system-ui, sans-serif',
      color: text.primary,
      width: '320px',
      zIndex: 1000,
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
              <span style={nodeStyles.titleText}>Timeline</span>
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

            <div style={nodeStyles.sectionBody}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={nodeStyles.titleText}>Layers ({layers.length})</span>
                <button 
                  onClick={handleAddLayer}
                  style={{
                    background: 'transparent',
                    color: ui.link,
                    border: `1px solid ${ui.link}`,
                    borderRadius: `${radius.sm}px`,
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
                  <div style={{ textAlign: 'center', color: text.muted, fontSize: '12px', padding: '16px' }}>
                    No layers added yet.
                  </div>
                )}
              </div>
            </div>

            <div style={nodeStyles.sectionBody}>
              <button 
                style={{ ...nodeStyles.btn, backgroundColor: isExporting ? surface.base : ui.link, cursor: isExporting ? 'not-allowed' : 'pointer' }} 
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
