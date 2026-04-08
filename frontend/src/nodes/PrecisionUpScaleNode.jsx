import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { upscalePrecision, pollPrecisionStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

const SCALE_FACTORS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
const FLAVORS = [
  { value: 'sublime', label: 'Sublime', desc: 'Art & illustrations' },
  { value: 'photo', label: 'Photo', desc: 'Photographs' },
  { value: 'photo_denoiser', label: 'Photo Denoiser', desc: 'Noisy images' },
];

export default function PrecisionUpScaleNode({ id, data, selected }) {
  const { isActive, start, complete, fail } = useNodeProgress();

  const localScale = data.localScaleFactor || '4';
  const localFlavor = data.localFlavor || '';
  const localSharpen = data.localSharpen ?? 7;
  const localSmartGrain = data.localSmartGrain ?? 7;
  const localUltraDetail = data.localUltraDetail ?? 30;

  const update = useCallback(
    (patch) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback((handleId) => {
    return data.getConnectionInfo?.(id, handleId) || null;
  }, [id, data]);

  const imageConnection = getConnInfo('image-in');
  const hasImageConnection = data.hasConnection?.(id, 'image-in');

  const handleUpscale = useCallback(async () => {
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];
    if (!images?.length) return;

    start();
    update({ outputImage: null, isLoading: true });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) {
        imageBase64 = imageBase64.split(',')[1];
      }

      const params = { image: imageBase64 };

      const scaleFactor = data.resolveInput?.(id, 'scale-factor-in') || localScale;
      if (scaleFactor) params.scale_factor = Number(scaleFactor);

      const sharpen = data.resolveInput?.(id, 'sharpen-in') ?? localSharpen;
      if (sharpen !== 7) params.sharpen = sharpen;

      const smartGrain = data.resolveInput?.(id, 'smart-grain-in') ?? localSmartGrain;
      if (smartGrain !== 7) params.smart_grain = smartGrain;

      const ultraDetail = data.resolveInput?.(id, 'ultra-detail-in') ?? localUltraDetail;
      if (ultraDetail !== 30) params.ultra_detail = ultraDetail;

      const flavor = data.resolveInput?.(id, 'flavor-in') || localFlavor;
      if (flavor) params.flavor = flavor;

      const result = await upscalePrecision(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail(result.error?.message || 'Upscaling failed');
        return;
      }

      if (result.data?.task_id) {
        const status = await pollPrecisionStatus(result.data.task_id);
        const generated = status.data?.generated || [];
        update({
          outputImage: generated[0] || null,
          outputImages: generated,
          isLoading: false,
          outputError: null,
        });
        complete();
      } else if (result.data?.generated?.length) {
        update({
          outputImage: result.data.generated[0],
          outputImages: result.data.generated,
          isLoading: false,
          outputError: null,
        });
        complete();
      } else {
        update({ isLoading: false });
        fail('No output generated');
      }
    } catch (err) {
      console.error('Precision upscale error:', err);
      update({ isLoading: false, outputError: err.message });
      fail(err.message);
    }
  }, [id, data, update, localScale, localFlavor, localSharpen, localSmartGrain, localUltraDetail, start, complete, fail]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleUpscale();
    }
  }, [data.triggerGenerate, handleUpscale]);

  // ── Helpers ──

  const sectionHeader = (label, handleId, handleType, color, onAdd, extra) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 6, marginTop: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Handle
          type={handleType}
          position={handleType === 'target' ? Position.Left : Position.Right}
          id={handleId}
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: color, border: 'none',
            position: 'relative',
            left: handleType === 'target' ? -12 : 'auto',
            right: handleType === 'source' ? -12 : 'auto',
            transform: 'none',
          }}
        />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {extra}
        {onAdd && (
          <button
            onClick={onAdd}
            style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'transparent', border: '1px solid #3a3a3a',
              color: '#999', fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0, lineHeight: 1,
            }}
          >
            +
          </button>
        )}
      </div>
    </div>
  );

  const linkedBadges = (onUnlinkHandle) => (
    <>
      <span style={{
        fontSize: 9, color: '#3b82f6', padding: '2px 6px',
        background: 'rgba(59,130,246,0.1)', borderRadius: 4,
      }}>linked</span>
      <button
        onClick={() => data.onUnlink?.(id, onUnlinkHandle)}
        style={{
          fontSize: 9, color: '#ef4444', padding: '2px 6px',
          background: 'rgba(239,68,68,0.15)', borderRadius: 4,
          border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
        }}
      >
        unlink
      </button>
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

  const pill = (label, isActive, onClick, activeColor) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        padding: '4px 10px', fontSize: 11, fontWeight: isActive ? 600 : 400,
        borderRadius: 14, border: 'none', cursor: 'pointer',
        background: isActive ? (activeColor || '#22c55e') : '#1a1a1a',
        color: isActive ? '#fff' : '#999',
      }}
    >
      {label}
    </button>
  );

  const slider = (label, value, onChange, min = 0, max = 100, defaultVal = 0) => (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#999' }}>{label}</span>
        <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 9, color: '#555', minWidth: 18, textAlign: 'right' }}>{min}</span>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#22c55e' }}
        />
        <span style={{ fontSize: 9, color: '#555', minWidth: 18 }}>{max}</span>
      </div>
    </div>
  );

  // ── Render ──

  return (
    <NodeShell data={data}
      label={data.label || 'Precision Upscale'}
      dotColor="#22c55e"
      selected={selected}
      onGenerate={handleUpscale}
      isGenerating={isActive}
    >
      {/* ── Image Output Handle (top, aligned with image-in) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        marginBottom: 4,
      }}>
        <span style={{ fontSize: 10, color: '#999', marginRight: 4 }}>image</span>
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('output'), border: 'none',
            position: 'relative', right: -12, transform: 'none',
          }}
        />
      </div>

      {/* ── 1. Image Section ── */}
      {sectionHeader('Image', 'image-in', 'target', getHandleColor('image-in'), null,
        hasImageConnection ? linkedBadges('image-in') : null
      )}
      {hasImageConnection ? (
        connectionInfoBox(imageConnection)
      ) : (
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Click or drag to upload image"
        />
      )}

      {/* ── 2. Scale Factor ── */}
      {sectionHeader('Scale Factor', 'scale-factor-in', 'target', getHandleColor('resolution-in'),
        () => data.onAddToInput?.('scale_factor', id, 'scale-factor-in')
      )}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4,
        maxHeight: 60, overflowY: 'auto',
      }}>
        {SCALE_FACTORS.map((s) => pill(`${s}x`, localScale === s,
          () => update({ localScaleFactor: s }), '#22c55e'
        ))}
      </div>

      {/* ── 3. Flavor ── */}
      {sectionHeader('Flavor', 'flavor-in', 'target', getHandleColor('aspect-ratio-in'),
        () => data.onAddToInput?.('flavor', id, 'flavor-in')
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 4 }}>
        {FLAVORS.map((f) => (
          <button
            key={f.value}
            onClick={() => update({ localFlavor: localFlavor === f.value ? '' : f.value })}
            style={{
              padding: '8px 12px', fontSize: 11, textAlign: 'left',
              borderRadius: 8, border: 'none', cursor: 'pointer',
              background: localFlavor === f.value ? 'rgba(34,197,94,0.15)' : '#1a1a1a',
              borderLeft: localFlavor === f.value ? '3px solid #22c55e' : '3px solid transparent',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontWeight: localFlavor === f.value ? 600 : 400, color: localFlavor === f.value ? '#e0e0e0' : '#999' }}>
              {f.label}
            </span>
            <span style={{ fontSize: 10, color: '#666' }}>{f.desc}</span>
          </button>
        ))}
      </div>

      {/* ── 4. Enhancement Controls ── */}
      <div style={{
        background: '#1a1a1a', borderRadius: 6,
        border: '1px solid #3a3a3a', padding: 10, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 8 }}>
          Enhancement Controls
        </div>
        {slider('Sharpen', localSharpen, (v) => update({ localSharpen: v }), 0, 100, 7)}
        {slider('Smart Grain', localSmartGrain, (v) => update({ localSmartGrain: v }), 0, 100, 7)}
        {slider('Ultra Detail', localUltraDetail, (v) => update({ localUltraDetail: v }), 0, 100, 30)}
      </div>

      {/* ── 5. Progress ── */}
      <NodeProgress isActive={isActive} />

      {/* ── 6. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ec4899', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Upscaled Output</span>
        </div>
      </div>
      <div style={{
        background: '#1a1a1a', borderRadius: 6,
        border: '1px solid #3a3a3a',
        minHeight: 80, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {isActive ? (
          <div style={{
            width: 28, height: 28, border: '3px solid #3a3a3a',
            borderTop: '3px solid #22c55e', borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        ) : data.outputImage ? (
          <img
            src={data.outputImage}
            alt="upscaled"
            style={{ width: '100%', display: 'block', borderRadius: 6 }}
          />
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', padding: 12, textAlign: 'center' }}>
            {data.outputError}
          </span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', padding: 16, textAlign: 'center' }}>
            Upscaled image will appear here
          </span>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </NodeShell>
  );
}
