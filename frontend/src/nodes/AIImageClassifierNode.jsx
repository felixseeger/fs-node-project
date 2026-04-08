import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { imageClassifierGenerate } from '../utils/api';
import { compressImageBase64 } from '../utils/imageUtils';
import ImageUploadBox from './ImageUploadBox';

export default function AIImageClassifierNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);

  const update = useCallback(
    (patch) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback((handleId) => {
    return data.getConnectionInfo?.(id, handleId) || null;
  }, [id, data]);

  const imageConnection = getConnInfo('image-in');
  const hasImageConnection = data.hasConnection?.(id, 'image-in');

  const handleAnalyze = useCallback(async () => {
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];

    if (!images?.length) {
      if (data.onAnalyzeComplete) data.onAnalyzeComplete(id);
      return;
    }

    setIsLoading(true);
    update({ outputText: null, isLoading: true });

    try {
      const compressedImage = await compressImageBase64(images[0]);
      const params = {
        image: compressedImage,
      };

      const result = await imageClassifierGenerate(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        if (data.onAnalyzeComplete) data.onAnalyzeComplete(id);
        return;
      }

      if (result.data && Array.isArray(result.data)) {
        let outputText = 'Classification Results:\n';
        result.data.forEach(item => {
           outputText += `- ${item.class_name}: ${(item.probability * 100).toFixed(2)}%\n`;
        });
        update({
          outputText,
          rawResult: result.data,
          isLoading: false,
          outputError: null,
        });
      } else {
        update({ isLoading: false, outputError: 'Invalid format received from API.' });
      }
    } catch (err) {
      console.error('Image classifier error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
      if (data.onAnalyzeComplete) data.onAnalyzeComplete(id);
    }
  }, [id, data, update]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerAnalyze && data.triggerAnalyze !== lastTrigger.current) {
      lastTrigger.current = data.triggerAnalyze;
      handleAnalyze();
    }
  }, [data.triggerAnalyze, handleAnalyze]);

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

  const ACCENT = '#f59e0b'; // Amber for AI analysis/prompting

  // ── Render ──

  return (
    <NodeShell data={data} label={data.label || 'AI Image Classifier'} dotColor={ACCENT} selected={selected}>

      {/* ── Text Output Handle (top) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        marginBottom: 4,
      }}>
        <span style={{ fontSize: 10, color: '#999', marginRight: 4 }}>text</span>
        <Handle type="source" position={Position.Right} id="text-out" style={{
          width: 10, height: 10, borderRadius: '50%',
          background: getHandleColor('text-out'), border: 'none',
          position: 'relative', right: -12, transform: 'none',
        }} />
      </div>

      {/* ── 1. Image Input (Required) ── */}
      {sectionHeader('Input Image (Required)', 'image-in', 'target', getHandleColor('image-in'),
        hasImageConnection ? linkedBadges('image-in') : null
      )}
      {hasImageConnection ? connectionInfoBox(imageConnection) : (
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Upload image"
          minHeight={60}
        />
      )}

      {/* ── 2. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Classification Result</span>
        </div>
      </div>
      <div style={{
        background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
        minHeight: 120, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 12,
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, border: '3px solid #3a3a3a',
              borderTop: `3px solid ${ACCENT}`, borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <span style={{ fontSize: 10, color: '#999' }}>Classifying image...</span>
          </div>
        ) : data.outputText ? (
          <div style={{ fontSize: 12, color: '#fff', whiteSpace: 'pre-wrap', wordBreak: 'break-word', width: '100%' }}>
            {data.outputText}
          </div>
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', textAlign: 'center', wordBreak: 'break-word' }}>{data.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', textAlign: 'center' }}>Classification result will appear here</span>
        )}
      </div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </NodeShell>
  );
}