import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { NodeResizer, Handle, Position } from '@xyflow/react';
import etro from 'etro';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { InfoIcon, ChevronDownIcon, MagicIcon, LinkIcon, PlayIcon, PauseIcon, StopIcon, EyeIcon, LockIcon } from './NodeIcons';
import { NodeCapabilities } from './nodeCapabilities';
import NodeShell from './NodeShell';

function LayerItem({ layer, source, onToggleVisibility, onOpacityChange, onBrightnessChange }) {
  const [opacity, setOpacity] = useState(layer.opacity * 100);
  const [brightness, setBrightness] = useState(0);
  
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
    <div style={{
      backgroundColor: '#222',
      borderRadius: '6px',
      padding: '8px 12px',
      marginBottom: '6px',
      border: '1px solid #333'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', color: '#eee', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
          {name}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => onToggleVisibility(source)}
            style={{ background: 'none', border: 'none', color: layer.hidden ? '#666' : '#3b82f6', cursor: 'pointer', padding: 0 }}
          >
            <EyeIcon size={14} />
          </button>
          <button style={{ background: 'none', border: 'none', color: '#666', cursor: 'default', padding: 0 }}>
            <LockIcon size={14} />
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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

function LayerEditorMenu({ width, height, isLinked, isPlaying, useProxy, onTogglePlay, onStop, onToggleProxy, layers, onToggleVisibility, onOpacityChange, onBrightnessChange, onExport }) {
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
      backgroundColor: '#3b82f6',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer'
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

          <button style={styles.exportBtn} onClick={onExport}>
            Export Video
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
  const canvasRef = useRef(null);
  const movieRef = useRef(null);
  const layersMapRef = useRef(new Map());

  const rawIncomingImages = resolve.image('image-in') || [];
  const rawIncomingVideos = resolve.video('video-in') || [];
  
  const incomingImagesStr = JSON.stringify(rawIncomingImages);
  const incomingVideosStr = JSON.stringify(rawIncomingVideos);

  const incomingImages = useMemo(() => rawIncomingImages, [incomingImagesStr, rawIncomingImages]);
  const incomingVideos = useMemo(() => rawIncomingVideos, [incomingVideosStr, rawIncomingVideos]);

  useEffect(() => {
    if (canvasRef.current && !movieRef.current) {
      movieRef.current = new etro.Movie({
        canvas: canvasRef.current,
        background: etro.color.fromHex('#0a0a0a')
      });
      // Note on Web Workers: etro.Movie relies on DOM elements (HTMLVideoElement, HTMLImageElement)
      // for its layers, which cannot be transferred to a Web Worker. Therefore, OffscreenCanvas
      // cannot be fully utilized for offloading the entire rendering pipeline in etro-js.
      // We use Proxy Mode (low-res) to mitigate main-thread performance issues.
    }
  }, []);

  useEffect(() => {
    if (!movieRef.current) return;

    const movie = movieRef.current;
    const currentMediaSet = new Set([...incomingImages, ...incomingVideos]);
    let changed = false;

    for (const [source, layer] of layersMapRef.current.entries()) {
      if (!currentMediaSet.has(source)) {
        movie.removeLayer(layer);
        layersMapRef.current.delete(source);
        changed = true;
      }
    }

    incomingVideos.forEach((vid) => {
      if (!layersMapRef.current.has(vid)) {
        const layer = new etro.layer.Video({
          source: vid,
          startTime: 0,
          duration: 3600,
          objectFit: 'contain'
        });
        const brightnessEffect = new etro.effect.Brightness({ brightness: 0 });
        layer.addEffect(brightnessEffect);
        layer._brightnessEffect = brightnessEffect;
        
        movie.addLayer(layer);
        layersMapRef.current.set(vid, layer);
        changed = true;
      }
    });

    incomingImages.forEach((img) => {
      if (!layersMapRef.current.has(img)) {
        const layer = new etro.layer.Image({
          source: img,
          startTime: 0,
          duration: 3600,
          objectFit: 'contain'
        });
        const brightnessEffect = new etro.effect.Brightness({ brightness: 0 });
        layer.addEffect(brightnessEffect);
        layer._brightnessEffect = brightnessEffect;

        movie.addLayer(layer);
        layersMapRef.current.set(img, layer);
        changed = true;
      }
    });

    if (changed || activeLayers.length !== layersMapRef.current.size) {
      setActiveLayers(Array.from(layersMapRef.current.entries()).map(([source, layer]) => ({ source, layer })));
      movie.refresh();
    }
  }, [incomingImages, incomingVideos, activeLayers.length]);

  useEffect(() => {
    if (movieRef.current) {
      const scale = useProxy ? 0.5 : 1;
      movieRef.current.width = dimensions.width * scale;
      movieRef.current.height = dimensions.height * scale;
      movieRef.current.refresh();
    }
  }, [dimensions, useProxy]);

  const togglePlay = useCallback(() => {
    if (!movieRef.current) return;
    if (isPlaying) {
      movieRef.current.pause();
    } else {
      movieRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const stopPlayback = useCallback(() => {
    if (!movieRef.current) return;
    movieRef.current.stop();
    setIsPlaying(false);
  }, []);

  const handleToggleVisibility = useCallback((source) => {
    const layer = layersMapRef.current.get(source);
    if (layer) {
      layer.hidden = !layer.hidden;
      movieRef.current.refresh();
      setActiveLayers([...Array.from(layersMapRef.current.entries()).map(([s, l]) => ({ source: s, layer: l }))]);
    }
  }, []);

  const handleOpacityChange = useCallback((source, opacity) => {
    const layer = layersMapRef.current.get(source);
    if (layer) {
      layer.opacity = opacity;
      movieRef.current.refresh();
    }
  }, []);

  const handleBrightnessChange = useCallback((source, brightness) => {
    const layer = layersMapRef.current.get(source);
    if (layer && layer._brightnessEffect) {
      layer._brightnessEffect.brightness = brightness;
      movieRef.current.refresh();
    }
  }, []);

  const handleExport = async () => {
    if (!movieRef.current) return;
    movieRef.current.stop();
    setIsPlaying(false);

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
          return;
        }
      } catch (err) {
        console.error('Server-side export failed, falling back to local:', err);
      }
    }

    try {
      const originalWidth = movieRef.current.width;
      const originalHeight = movieRef.current.height;
      
      if (useProxy) {
        movieRef.current.width = dimensions.width;
        movieRef.current.height = dimensions.height;
        movieRef.current.refresh();
      }

      const blob = await movieRef.current.record({
        duration: 5,
        type: 'video/webm'
      });
      
      if (useProxy) {
        movieRef.current.width = originalWidth;
        movieRef.current.height = originalHeight;
        movieRef.current.refresh();
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `composition-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);

      update({ outputVideo: url });
    } catch (err) {
      console.error('Export failed:', err);
    }
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
        />,
        document.body
      )}
    </NodeShell>
  );
}
