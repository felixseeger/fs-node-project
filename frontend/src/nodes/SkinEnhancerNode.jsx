import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { skinEnhancer, pollSkinEnhancerStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';

const MODES = [
  { value: 'creative', label: 'Creative', desc: 'Artistic stylized' },
  { value: 'faithful', label: 'Faithful', desc: 'Natural preservation' },
  { value: 'flexible', label: 'Flexible', desc: 'Targeted optimization' },
];

const OPTIMIZED_FOR = [
  { value: 'enhance_skin', label: 'Enhance Skin' },
  { value: 'improve_lighting', label: 'Improve Lighting' },
  { value: 'enhance_everything', label: 'Enhance Everything' },
  { value: 'transform_to_real', label: 'Transform to Real' },
  { value: 'no_make_up', label: 'No Makeup' },
];

export default function SkinEnhancerNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);

  const localMode = data.localMode || 'faithful';
  const localSharpen = data.localSharpen ?? 0;
  const localSmartGrain = data.localSmartGrain ?? 2;
  const localSkinDetail = data.localSkinDetail ?? 80;
  const localOptimizedFor = data.localOptimizedFor || 'enhance_skin';

  const update = useCallback(
    (patch) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback((handleId) => {
    return data.getConnectionInfo?.(id, handleId) || null;
  }, [id, data]);

  const imageConnection = getConnInfo('image-in');
  const hasImageConnection = data.hasConnection?.(id, 'image-in');

  const handleEnhance = useCallback(async () => {
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];
    if (!images?.length) return;

    setIsLoading(true);
    update({ outputImage: null, isLoading: true });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) imageBase64 = imageBase64.split(',')[1];

      const params = { image: imageBase64 };
      if (localSharpen !== 0) params.sharpen = localSharpen;
      if (localSmartGrain !== 2) params.smart_grain = localSmartGrain;
      if (localMode === 'faithful' && localSkinDetail !== 80) params.skin_detail = localSkinDetail;
      if (localMode === 'flexible' && localOptimizedFor !== 'enhance_skin') params.optimized_for = localOptimizedFor;

      const result = await skinEnhancer(localMode, params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      if (result.data?.task_id) {
        const status = await pollSkinEnhancerStatus(result.data.task_id);
        const generated = status.data?.generated || [];
        update({
          outputImage: generated[0] || null,
          outputImages: generated,
          isLoading: false,
          outputError: null,
        });
      } else if (result.data?.generated?.length) {
        update({
          outputImage: result.data.generated[0],
          outputImages: result.data.generated,
          isLoading: false,
          outputError: null,
        });
      } else {
        update({ isLoading: false });
      }
    } catch (err) {
      console.error('Skin enhancer error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, localMode, localSharpen, localSmartGrain, localSkinDetail, localOptimizedFor]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleEnhance();
    }
  }, [data.triggerGenerate, handleEnhance]);

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

  const slider = (label, value, onChange, min = 0, max = 100, defaultVal = 0) => (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#999' }}>{label}</span>
        <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 9, color: '#555', minWidth: 18, textAlign: 'right' }}>{min}</span>
        <input type="range" min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#e879f9' }} />
        <span style={{ fontSize: 9, color: '#555', minWidth: 18 }}>{max}</span>
      </div>
    </div>
  );

  const pill = (label, isActive, onClick, color) => (
    <button key={label} onClick={onClick} style={{
      padding: '4px 10px', fontSize: 11, fontWeight: isActive ? 600 : 400,
      borderRadius: 14, border: 'none', cursor: 'pointer',
      background: isActive ? (color || '#e879f9') : '#1a1a1a',
      color: isActive ? '#fff' : '#999',
    }}>{label}</button>
  );

  const ACCENT = '#e879f9';

  // ── Render ──

  return (
    <NodeShell label={data.label || 'Skin Enhancer'} dotColor={ACCENT} selected={selected}>

      {/* ── 1. Image ── */}
      {sectionHeader('Image', 'image-in', 'target', getHandleColor('image-in'),
        hasImageConnection ? linkedBadges('image-in') : null
      )}
      {hasImageConnection ? connectionInfoBox(imageConnection) : (
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Click or drag to upload portrait image"
        />
      )}

      {/* ── 2. Mode Selector ── */}
      <div style={{ marginTop: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Enhancement Mode</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        {MODES.map((m) => (
          <button key={m.value} onClick={() => update({ localMode: m.value })} style={{
            flex: 1, padding: '8px 6px', fontSize: 11, textAlign: 'center',
            borderRadius: 8, border: 'none', cursor: 'pointer',
            background: localMode === m.value ? 'rgba(232,121,249,0.15)' : '#1a1a1a',
            borderLeft: localMode === m.value ? `3px solid ${ACCENT}` : '3px solid transparent',
            transition: 'all 0.15s',
          }}>
            <div style={{ fontWeight: localMode === m.value ? 600 : 400, color: localMode === m.value ? '#e0e0e0' : '#999', marginBottom: 2 }}>
              {m.label}
            </div>
            <div style={{ fontSize: 9, color: '#666' }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* ── 3. Common Controls ── */}
      <div style={{
        background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
        padding: 10, marginTop: 8,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 8 }}>
          Enhancement Controls
        </div>
        {slider('Sharpen', localSharpen, (v) => update({ localSharpen: v }), 0, 100, 0)}
        {slider('Smart Grain', localSmartGrain, (v) => update({ localSmartGrain: v }), 0, 100, 2)}

        {/* Faithful-only: Skin Detail */}
        {localMode === 'faithful' && (
          slider('Skin Detail', localSkinDetail, (v) => update({ localSkinDetail: v }), 0, 100, 80)
        )}

        {/* Flexible-only: Optimized For */}
        {localMode === 'flexible' && (
          <>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#999', marginTop: 8, marginBottom: 6 }}>
              Optimized For
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {OPTIMIZED_FOR.map((o) => pill(o.label, localOptimizedFor === o.value,
                () => update({ localOptimizedFor: o.value }), ACCENT
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── 4. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ec4899', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Enhanced Output</span>
        </div>
      </div>
      <div style={{
        background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
        minHeight: 80, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{
            width: 28, height: 28, border: '3px solid #3a3a3a',
            borderTop: `3px solid ${ACCENT}`, borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        ) : data.outputImage ? (
          <img src={data.outputImage} alt="enhanced" style={{ width: '100%', display: 'block', borderRadius: 6 }} />
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', padding: 12, textAlign: 'center' }}>{data.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', padding: 16, textAlign: 'center' }}>Enhanced portrait will appear here</span>
        )}
      </div>

      {/* Output handles */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6, gap: 4, alignItems: 'center' }}>
        <Handle type="source" position={Position.Right} id="output" style={{
          width: 10, height: 10, borderRadius: '50%',
          background: getHandleColor('output'), border: 'none',
          position: 'relative', right: -12, transform: 'none',
        }} />
      </div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </NodeShell>
  );
}
