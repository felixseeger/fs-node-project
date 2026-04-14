import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import { useNodeConnections } from './shared';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { NodeCapabilities } from './nodeCapabilities';
import { removeBackground } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';


export default function RemoveBackgroundNode({ id, data, selected }) {
  const { onDisconnectNode } = useNodeConnections();
  const { isActive, start, complete, fail } = useNodeProgress(id, data);

  const update = useCallback(
    (patch) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback((handleId) => {
    return data.getConnectionInfo?.(id, handleId) || null;
  }, [id, data]);

  const imageConnection = getConnInfo('image-in');
  const hasImageConnection = data.hasConnection?.(id, 'image-in');

  const handleRemove = useCallback(async () => {
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];
    if (!images?.length) return;

    start();
    update({ outputImage: null, isLoading: true });

    try {
      let imageUrl = images[0];

      // If base64 data URL, use it directly; otherwise it's already a URL
      if (imageUrl.startsWith('data:')) {
        // Data URLs can be passed directly for local backend proxy
        // The backend will forward to Freepik API
      }

      const result = await removeBackground({ image_url: imageUrl });

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail();
        return;
      }

      // Synchronous response — results come back immediately
      const outputUrl = result.high_resolution || result.preview || result.url || null;
      const base = (data.label || 'Remove Background').toLowerCase().replace(/\s+/g, '-');
      const now = Date.now();
      
      update({
        outputImage: outputUrl,
        outputHighRes: result.high_resolution || null,
        outputPreview: result.preview || null,
        outputUrl: result.url || null,
        originalUrl: result.original || null,
        outputHighResFilename: `${base}-highres-${now}.png`,
        outputPreviewFilename: `${base}-preview-${now}.png`,
        isLoading: false,
        outputError: null,
      });
      complete();
    } catch (err) {
      console.error('Remove background error:', err);
      update({ isLoading: false, outputError: err.message });
      fail();
    }
  }, [id, data, update, start, complete, fail]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleRemove();
    }
  }, [data.triggerGenerate, handleRemove]);

  // ── Helpers ──

  const sectionHeader = (label, handleId, handleType, color, extra) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 6, marginTop: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Handle type={handleType} position={handleType === 'target' ? Position.Left : Position.Right}
          id={handleId} style={{
            width: 10, height: 10, borderRadius: '50%', background: color, border: 'none',
            position: 'relative', left: handleType === 'target' ? -12 : 'auto',
            right: handleType === 'source' ? -12 : 'auto', transform: 'none',
          }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>{label}</span>
      </div>
      {extra && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{extra}</div>}
    </div>
  );

  const linkedBadges = (onUnlinkHandle) => (
    <>
      <span style={{ fontSize: 9, color: '#3b82f6', padding: '2px 6px', background: 'rgba(59,130,246,0.1)', borderRadius: 4 }}>linked</span>
      <button onClick={() => data.onUnlink?.(id, onUnlinkHandle)} style={{
        fontSize: 9, color: '#ef4444', padding: '2px 6px', background: 'rgba(239,68,68,0.15)', borderRadius: 4,
        border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
      }}>unlink</button>
    </>
  );

  const connectionInfoBox = (connInfo) => (
    <div style={{
      background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
      borderRadius: 6, padding: '6px 10px', marginBottom: 4,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: '#93b4f5' }}>
        {connInfo ? `Linked from ${connInfo.nodeLabel} → ${connInfo.handle}` : 'Linked from upstream node'}
      </span>
    </div>
  );

  // Checkerboard background to show transparency
  const checkerboardStyle = {
    backgroundImage: `
      linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
      linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
      linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)
    `,
    backgroundSize: '12px 12px',
    backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
    backgroundColor: '#111',
  };

  // ── Render ──

  return (
    <NodeShell data={data}
      label={data.label || 'Remove Background'}
      dotColor="#06b6d4"
      selected={selected}
      onGenerate={handleRemove}
      isGenerating={isActive}
      downloadUrl={data.outputHighRes || undefined} onDisconnect={onDisconnectNode}
      capabilities={[NodeCapabilities.IMAGE_REMOVE_BACKGROUND, NodeCapabilities.OUTPUT_IMAGE]}
    >

      {/* ── Image Output Handle (top, aligned with image-in) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        marginBottom: 4,
      }}>
        <span style={{ fontSize: 10, color: '#999', marginRight: 4 }}>image</span>
        <Handle type="source" position={Position.Right} id="output" style={{
          width: 10, height: 10, borderRadius: '50%',
          background: getHandleColor('output'), border: 'none',
          position: 'relative', right: -12, transform: 'none',
        }} />
      </div>

      {/* ── 1. Image ── */}
      {sectionHeader('Image', 'image-in', 'target', getHandleColor('image-in'),
        hasImageConnection ? linkedBadges('image-in') : null
      )}
      {hasImageConnection ? connectionInfoBox(imageConnection) : (
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Click or drag to upload image"
        />
      )}

      {/* ── 2. Info badge ── */}
      <div style={{
        background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)',
        borderRadius: 8, padding: '8px 12px', marginTop: 10,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
          <path d="M12 8v4M12 16h.01" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 10, color: '#67e8f9', lineHeight: 1.4 }}>
          Synchronous — results return instantly, no polling needed
        </span>
      </div>

      {/* ── 3. Progress ── */}
      <NodeProgress isActive={isActive} />

      {/* ── 4. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ec4899', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Cutout Output</span>
        </div>
      </div>
      <div style={{
        borderRadius: 6, border: '1px solid #3a3a3a',
        minHeight: 80, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        ...checkerboardStyle,
      }}>
        {isActive ? (
          <div style={{
            width: 28, height: 28, border: '3px solid #3a3a3a',
            borderTop: '3px solid #06b6d4', borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            background: '#111',
          }} />
        ) : data.outputImage ? (
          <img src={data.outputImage} alt="cutout" style={{ width: '100%', display: 'block', borderRadius: 6 }} />
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', padding: 12, textAlign: 'center', background: '#111' }}>
            {data.outputError}
          </span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', padding: 16, textAlign: 'center', background: '#111' }}>
            Transparent PNG cutout will appear here
          </span>
        )}
      </div>

      {/* ── Download links (if available) ── */}
      {data.outputHighRes && !isActive && (
        <div style={{
          display: 'flex', gap: 6, marginTop: 6,
        }}>
          {data.outputHighRes && (
            <a 
              href={data.outputHighRes} 
              download={data.outputHighResFilename || 'cutout-highres.png'}
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                fontSize: 9, color: '#06b6d4', textDecoration: 'none',
                padding: '3px 8px', background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.25)', borderRadius: 4,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2, verticalAlign: 'middle' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              High Res
            </a>
          )}
          {data.outputPreview && (
            <a 
              href={data.outputPreview} 
              download={data.outputPreviewFilename || 'cutout-preview.png'}
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                fontSize: 9, color: '#06b6d4', textDecoration: 'none',
                padding: '3px 8px', background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.25)', borderRadius: 4,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2, verticalAlign: 'middle' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Preview
            </a>
          )}
        </div>
      )}

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </NodeShell>
  );
}
