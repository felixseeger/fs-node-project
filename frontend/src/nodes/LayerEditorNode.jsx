import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { NodeResizer, Handle, Position } from '@xyflow/react';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { InfoIcon, ChevronDownIcon, MagicIcon, LinkIcon, PlayIcon, PauseIcon, StopIcon, EyeIcon, LockIcon } from './NodeIcons';
import { NodeCapabilities } from './nodeCapabilities';
import NodeShell from './NodeShell';
import { uploadVfxOutput } from '../utils/firebaseStorage';
import { vfxLtxGenerate, vfxCorridorKeyExtract, pollVfxJobStatus } from '../utils/api';

function LayerItem({ layer, source, isSelected, onSelect, onToggleVisibility, onOpacityChange, onBrightnessChange }) {
  const [opacity, setOpacity] = useState(layer.opacity * 100);
  const [brightness, setBrightness] = useState(layer.brightness * 100);
  
  const handleOpacityChange = (e) => {
    const val = parseInt(e.target.value);
    setOpacity(val);
    onOpacityChange(source, val / 100);
  };

  const handleBrightnessChange = (e) => {
    const val = parseInt(e.target.value);
    setBrightness(val);
    if (onBrightnessChange) {
      onBrightnessChange(source, val / 100); // -1 to 1
    }
  };

  const name = typeof source === 'string' ? source.split('/').pop() : 'Unnamed Layer';

  return (
    <div 
      onClick={() => onSelect(source)}
      style={{
        backgroundColor: isSelected ? '#2a2a2a' : '#222',
        borderRadius: '6px',
        padding: '8px 12px',
        marginBottom: '6px',
        border: isSelected ? '1px solid #3b82f6' : '1px solid #333',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', color: '#eee', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
          {name}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleVisibility(source); }}
            style={{ background: 'none', border: 'none', color: layer.hidden ? '#666' : '#3b82f6', cursor: 'pointer', padding: 0 }}
          >
            <EyeIcon size={14} />
          </button>
          <button style={{ background: 'none', border: 'none', color: '#666', cursor: 'default', padding: 0 }}>
            <LockIcon size={14} />
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: '#999', width: '20px' }}>Op</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={opacity} 
            onChange={handleOpacityChange}
            style={{ flex: 1, height: '4px', accentColor: '#3b82f6' }}
          />
          <span style={{ fontSize: '10px', color: '#999', width: '24px', textAlign: 'right' }}>{opacity}%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: '#999', width: '20px' }}>Br</span>
          <input 
            type="range" 
            min="-100" 
            max="100" 
            value={brightness} 
            onChange={handleBrightnessChange}
            style={{ flex: 1, height: '4px', accentColor: '#10b981' }}
          />
          <span style={{ fontSize: '10px', color: '#999', width: '24px', textAlign: 'right' }}>{brightness > 0 ? '+' : ''}{brightness}</span>
        </div>
      </div>
    </div>
  );
}

function LayerEditorMenu({ 
  width, height, isLinked, isPlaying, useProxy, onTogglePlay, onStop, onToggleProxy, 
  layers, onToggleVisibility, onOpacityChange, onBrightnessChange, onExport, isExporting,
  onAddAIBackground, onAIGreenScreenKey, vfxLoading, vfxProgress, selectedLayer, onSelectLayer
}) {
  const styles = {
    panelContainer: {
      position: 'absolute',
      top: '64px',
      right: '20px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#E0E0E0',
      width: '260px',
      zIndex: 1000,
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
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
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    borderedRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid #333333',
      paddingTop: '10px',
      marginTop: '10px',
    },
    titleText: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#E0E0E0',
    },
    labelText: {
      fontSize: '11px',
      color: '#999',
    },
    valueText: {
      fontSize: '12px',
      color: '#E0E0E0',
    },
    iconGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    hash: {
      color: '#999',
      marginRight: '6px',
      fontSize: '12px',
      fontWeight: '600',
    },
    leftTitleGroup: {
        display: 'flex',
        alignItems: 'center',
    },
    controls: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      marginTop: '12px',
      padding: '8px',
      backgroundColor: '#222',
      borderRadius: '6px'
    },
    controlBtn: {
      background: 'none',
      border: 'none',
      color: '#ccc',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      padding: '4px'
    },
    exportBtn: {
      width: '100%',
      marginTop: '12px',
      padding: '8px',
      backgroundColor: isExporting ? '#1d4ed8' : '#3b82f6',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: isExporting ? 'not-allowed' : 'pointer'
    },
    aiBtn: {
      width: '100%',
      padding: '8px',
      backgroundColor: '#222',
      color: '#eee',
      border: '1px solid #333',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease'
    }
  };

  return (
    <div style={styles.panelContainer}>
      <div style={styles.wrapper}>
        <div style={styles.sectionHeader}>
          <span style={styles.titleText}>Layer Editor</span>
          <InfoIcon style={{ color: '#999' }} />
        </div>

        <div style={styles.sectionBody}>
          <div style={styles.row}>
            <div style={styles.leftTitleGroup}>
              <span style={styles.hash}>#</span>
              <span style={styles.titleText}>AI Tools</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            <button 
              style={styles.aiBtn} 
              onClick={onAddAIBackground}
              disabled={vfxLoading}
            >
              <MagicIcon size={14} style={{ marginRight: '8px', color: '#3b82f6' }} />
              Add AI Background
            </button>
            <button 
              style={{ ...styles.aiBtn, opacity: selectedLayer ? 1 : 0.5 }} 
              onClick={onAIGreenScreenKey}
              disabled={vfxLoading || !selectedLayer}
            >
              <MagicIcon size={14} style={{ marginRight: '8px', color: '#10b981' }} />
              AI Green Screen Key
            </button>
          </div>

          {vfxLoading && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '10px', color: '#3b82f6', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Processing AI...</span>
                <span>{vfxProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '4px', backgroundColor: '#333', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${vfxProgress}%`, height: '100%', backgroundColor: '#3b82f6', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          )}
        </div>

        <div style={styles.sectionBody}>
          <div style={styles.row}>
            <div style={styles.leftTitleGroup}>
              <span style={styles.hash}>#</span>
              <span style={styles.titleText}>Playback</span>
            </div>
          </div>
          
          <div style={styles.controls}>
            <button style={styles.controlBtn} onClick={onTogglePlay} title={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
            </button>
            <button style={styles.controlBtn} onClick={onStop} title="Stop">
              <StopIcon size={20} />
            </button>
          </div>

          <div style={{ ...styles.row, marginTop: '16px' }}>
            <div style={styles.leftTitleGroup}>
              <span style={styles.hash}>#</span>
              <span style={styles.titleText}>Layers</span>
            </div>
            <span style={{ fontSize: '10px', color: '#666' }}>{layers.length} total</span>
          </div>
          
          <div style={{ marginTop: '12px', maxHeight: '200px', overflowY: 'auto' }}>
            {layers.map(({ source, layer }) => (
              <LayerItem 
                key={source} 
                source={source} 
                layer={layer} 
                isSelected={selectedLayer === source}
                onSelect={onSelectLayer}
                onToggleVisibility={onToggleVisibility}
                onOpacityChange={onOpacityChange}
                onBrightnessChange={onBrightnessChange}
              />
            ))}
            {layers.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#444', fontSize: '11px' }}>
                No active layers
              </div>
            )}
          </div>

          <button style={styles.exportBtn} onClick={onExport} disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export Video'}
          </button>
        </div>

        <div style={styles.sectionBody}>
          <div style={styles.row}>
            <div style={styles.leftTitleGroup}>
              <span style={styles.hash}>#</span>
              <span style={styles.titleText}>Frame</span>
            </div>
            <ChevronDownIcon style={{ color: '#999' }} />
          </div>

          <div style={styles.borderedRow}>
            <span style={styles.titleText}>Proxy Mode (Low-Res)</span>
            <input 
              type="checkbox" 
              checked={useProxy} 
              onChange={(e) => onToggleProxy(e.target.checked)} 
              style={{ accentColor: '#3b82f6' }}
            />
          </div>

          <div style={styles.borderedRow}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={styles.labelText}>W</span>
              <span style={styles.valueText}>{width}</span>
            </div>
            <LinkIcon style={{ color: isLinked ? '#E0E0E0' : '#666' }} />
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={styles.labelText}>H</span>
              <span style={styles.valueText}>{height}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LayerEditorNode({ id, data, selected }) {
  const { resolve, update } = useNodeConnections(id, data);
  const capabilities = [NodeCapabilities.VIDEO_EDIT, NodeCapabilities.OUTPUT_VIDEO];
  const [dimensions, setDimensions] = useState({ width: 1024, height: 1024 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  const [activeLayers, setActiveLayers] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [vfxLoading, setVfxLoading] = useState(false);
  const [vfxProgress, setVfxProgress] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState(null);
  
  const canvasRef = useRef(null);
  const workerRef = useRef(null);
  const layersMapRef = useRef(new Map());
  const recordCompleteRef = useRef(null);

  useEffect(() => {
    recordCompleteRef.current = handleRecordComplete;
  }, [handleRecordComplete]);

  const rawIncomingImages = resolve.image('image-in') || [];
  const rawIncomingVideos = resolve.video('video-in') || [];
  
  const incomingImagesStr = JSON.stringify(rawIncomingImages);
  const incomingVideosStr = JSON.stringify(rawIncomingVideos);

  const incomingImages = useMemo(() => JSON.parse(incomingImagesStr), [incomingImagesStr]);
  const incomingVideos = useMemo(() => JSON.parse(incomingVideosStr), [incomingVideosStr]);

  const handleRecordComplete = useCallback(async (blob) => {
    try {
      const url = await uploadVfxOutput(blob, 'webm');
      update({ outputVideo: url });
    } catch (err) {
      console.error('Failed to upload VFX output:', err);
    } finally {
      setIsExporting(false);
    }
  }, [update]);

  const handleAddAIBackground = useCallback(async () => {
    setVfxLoading(true);
    setVfxProgress(0);
    try {
      const { jobId } = await vfxLtxGenerate({ 
        prompt: "cinematic abstract background, 4k, high detail",
        width: dimensions.width,
        height: dimensions.height
      });
      
      const result = await pollVfxJobStatus(jobId, 120, 3000, (progress) => {
        setVfxProgress(progress);
      });

      if (result.status === 'completed' && result.url) {
        // Add to worker
        const layerMeta = {
          source: result.url,
          type: 'video',
          opacity: 1,
          brightness: 0,
          hidden: false,
          isAI: true
        };
        workerRef.current.postMessage({ type: 'ADD_LAYER', payload: { layer: layerMeta } });
        layersMapRef.current.set(result.url, layerMeta);
        setActiveLayers(Array.from(layersMapRef.current.entries()).map(([source, layer]) => ({ source, layer })));
      }
    } catch (err) {
      console.error('AI Background generation failed:', err);
    } finally {
      setVfxLoading(false);
      setVfxProgress(0);
    }
  }, [dimensions]);

  const handleAIGreenScreenKey = useCallback(async () => {
    if (!selectedLayer) return;
    
    setVfxLoading(true);
    setVfxProgress(0);
    try {
      const { jobId } = await vfxCorridorKeyExtract({ 
        source: selectedLayer
      });
      
      const result = await pollVfxJobStatus(jobId, 120, 3000, (progress) => {
        setVfxProgress(progress);
      });

      if (result.status === 'completed' && result.url) {
        // Update existing layer with matte or add as new layer? 
        // Usually CorridorKey returns a matte or a keyed video.
        // For now, let's add it as a new layer.
        const layerMeta = {
          source: result.url,
          type: 'video',
          opacity: 1,
          brightness: 0,
          hidden: false,
          isAI: true
        };
        workerRef.current.postMessage({ type: 'ADD_LAYER', payload: { layer: layerMeta } });
        layersMapRef.current.set(result.url, layerMeta);
        setActiveLayers(Array.from(layersMapRef.current.entries()).map(([source, layer]) => ({ source, layer })));
      }
    } catch (err) {
      console.error('AI Green Screen Key failed:', err);
    } finally {
      setVfxLoading(false);
      setVfxProgress(0);
    }
  }, [selectedLayer]);

  useEffect(() => {
    if (canvasRef.current && !workerRef.current) {
      workerRef.current = new Worker(new URL('../workers/etro.worker.ts', import.meta.url), { type: 'module' });
      
      const offscreen = canvasRef.current.transferControlToOffscreen();
      workerRef.current.postMessage({ type: 'INIT', payload: { canvas: offscreen } }, [offscreen]);
      
      workerRef.current.onmessage = (e) => {
        if (e.data.type === 'RECORD_COMPLETE') {
          recordCompleteRef.current(e.data.payload.blob);
        } else if (e.data.type === 'RECORD_ERROR') {
          console.error('Worker record error:', e.data.payload.error);
          setIsExporting(false);
        }
      };
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!workerRef.current) return;

    const currentMediaSet = new Set([...incomingImages, ...incomingVideos]);
    let changed = false;

    for (const [source, layer] of layersMapRef.current.entries()) {
      if (!currentMediaSet.has(source) && !layer.isAI) {
        workerRef.current.postMessage({ type: 'REMOVE_LAYER', payload: { source } });
        layersMapRef.current.delete(source);
        changed = true;
      }
    }

    const addMediaLayer = (source, type) => {
      if (!layersMapRef.current.has(source)) {
        const layerMeta = {
          source,
          type,
          opacity: 1,
          brightness: 0,
          hidden: false
        };
        workerRef.current.postMessage({ type: 'ADD_LAYER', payload: { layer: layerMeta } });
        layersMapRef.current.set(source, layerMeta);
        changed = true;
      }
    };

    incomingVideos.forEach((vid) => addMediaLayer(vid, 'video'));
    incomingImages.forEach((img) => addMediaLayer(img, 'image'));

    if (changed || activeLayers.length !== layersMapRef.current.size) {
      setActiveLayers(Array.from(layersMapRef.current.entries()).map(([source, layer]) => ({ source, layer })));
    }
  }, [incomingImages, incomingVideos, activeLayers.length]);

  useEffect(() => {
    if (workerRef.current) {
      const scale = useProxy ? 0.5 : 1;
      workerRef.current.postMessage({ 
        type: 'UPDATE_DIMENSIONS', 
        payload: { 
          width: dimensions.width * scale, 
          height: dimensions.height * scale 
        } 
      });
    }
  }, [dimensions, useProxy]);

  const togglePlay = useCallback(() => {
    if (!workerRef.current) return;
    if (isPlaying) {
      workerRef.current.postMessage({ type: 'PAUSE' });
    } else {
      workerRef.current.postMessage({ type: 'PLAY' });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const stopPlayback = useCallback(() => {
    if (!workerRef.current) return;
    workerRef.current.postMessage({ type: 'STOP' });
    setIsPlaying(false);
  }, []);

  const handleToggleVisibility = useCallback((source) => {
    const layer = layersMapRef.current.get(source);
    if (layer && workerRef.current) {
      layer.hidden = !layer.hidden;
      workerRef.current.postMessage({ type: 'UPDATE_LAYER', payload: { source, layer } });
      setActiveLayers([...Array.from(layersMapRef.current.entries()).map(([s, l]) => ({ source: s, layer: l }))]);
    }
  }, []);

  const handleOpacityChange = useCallback((source, opacity) => {
    const layer = layersMapRef.current.get(source);
    if (layer && workerRef.current) {
      layer.opacity = opacity;
      workerRef.current.postMessage({ type: 'UPDATE_LAYER', payload: { source, layer } });
    }
  }, []);

  const handleBrightnessChange = useCallback((source, brightness) => {
    const layer = layersMapRef.current.get(source);
    if (layer && workerRef.current) {
      layer.brightness = brightness;
      workerRef.current.postMessage({ type: 'UPDATE_LAYER', payload: { source, layer } });
    }
  }, []);

  const handleExport = async () => {
    if (!workerRef.current) return;
    
    workerRef.current.postMessage({ type: 'STOP' });
    setIsPlaying(false);
    setIsExporting(true);

    if (useProxy) {
      try {
        const response = await fetch('/api/vfx/render', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            layers: activeLayers.map(l => l.source),
            dimensions,
            duration: 5
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          console.log('Server-side render job started:', data.jobId);
          update({ outputVideo: data.url });
          setIsExporting(false);
          return;
        }
      } catch (err) {
        console.error('Server-side export failed, falling back to local worker:', err);
      }
    }

    workerRef.current.postMessage({ type: 'RECORD', payload: { duration: 5 } });
  };

  const hasMedia = incomingImages.length > 0 || incomingVideos.length > 0;

  return (
    <NodeShell
      id={id}
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
        onResize={(e, params) => setDimensions({ width: Math.round(params.width), height: Math.round(params.height) })}
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
        
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: hasMedia ? 0 : 0.1,
          backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          pointerEvents: 'none'
        }} />

        <canvas 
          ref={canvasRef}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain'
          }} 
        />

        {!hasMedia && (
          <span style={{ position: 'absolute', color: '#555', fontSize: 14, fontWeight: 500, zIndex: 100 }}>
            Canvas {dimensions.width}x{dimensions.height}
          </span>
        )}
      </div>

      {selected && createPortal(
        <LayerEditorMenu 
          width={dimensions.width} 
          height={dimensions.height} 
          isLinked={true} 
          isPlaying={isPlaying}
          useProxy={useProxy}
          onTogglePlay={togglePlay}
          onStop={stopPlayback}
          onToggleProxy={setUseProxy}
          layers={activeLayers}
          onToggleVisibility={handleToggleVisibility}
          onOpacityChange={handleOpacityChange}
          onBrightnessChange={handleBrightnessChange}
          onExport={handleExport}
          isExporting={isExporting}
          onAddAIBackground={handleAddAIBackground}
          onAIGreenScreenKey={handleAIGreenScreenKey}
          vfxLoading={vfxLoading}
          vfxProgress={vfxProgress}
          selectedLayer={selectedLayer}
          onSelectLayer={setSelectedLayer}
        />,
        document.body
      )}
    </NodeShell>
  );
}
