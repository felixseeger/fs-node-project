import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { upscaleCreative, pollUpscaleStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';

const SCALE_FACTORS = ['2x', '4x', '8x', '16x'];
const OPTIMIZED_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'soft_portraits', label: 'Soft Portraits' },
  { value: 'hard_portraits', label: 'Hard Portraits' },
  { value: 'art_n_illustration', label: 'Art & Illustration' },
  { value: 'videogame_assets', label: 'Video Game Assets' },
  { value: 'nature_n_landscapes', label: 'Nature & Landscapes' },
  { value: 'films_n_photography', label: 'Films & Photography' },
  { value: '3d_renders', label: '3D Renders' },
  { value: 'science_fiction_n_horror', label: 'Sci-Fi & Horror' },
];
const ENGINES = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'magnific_illusio', label: 'Illusio' },
  { value: 'magnific_sharpy', label: 'Sharpy' },
  { value: 'magnific_sparkle', label: 'Sparkle' },
];

export default function CreativeUpScaleNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);

  const localScale = data.localScaleFactor || '2x';
  const localOptimized = data.localOptimizedFor || 'standard';
  const localEngine = data.localEngine || 'automatic';
  const localCreativity = data.localCreativity ?? 0;
  const localHdr = data.localHdr ?? 0;
  const localResemblance = data.localResemblance ?? 0;
  const localFractality = data.localFractality ?? 0;

  const update = useCallback(
    (patch) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback((handleId) => {
    return data.getConnectionInfo?.(id, handleId) || null;
  }, [id, data]);

  const imageConnection = getConnInfo('image-in');
  const hasImageConnection = data.hasConnection?.(id, 'image-in');
  const promptConnection = getConnInfo('prompt-in');
  const hasPromptConnection = data.hasConnection?.(id, 'prompt-in');

  const handleUpscale = useCallback(async () => {
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];
    if (!images?.length) return;

    setIsLoading(true);
    update({ outputImage: null, isLoading: true });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) {
        imageBase64 = imageBase64.split(',')[1];
      }

      const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';

      const params = { image: imageBase64 };

      const scaleFactor = data.resolveInput?.(id, 'scale-factor-in') || localScale;
      if (scaleFactor) params.scale_factor = scaleFactor;

      const optimized = data.resolveInput?.(id, 'optimized-for-in') || localOptimized;
      if (optimized) params.optimized_for = optimized;

      if (prompt) params.prompt = prompt;

      const creativity = data.resolveInput?.(id, 'creativity-in') ?? localCreativity;
      if (creativity !== 0) params.creativity = creativity;

      const hdrVal = data.resolveInput?.(id, 'hdr-in') ?? localHdr;
      if (hdrVal !== 0) params.hdr = hdrVal;

      const resemblance = data.resolveInput?.(id, 'resemblance-in') ?? localResemblance;
      if (resemblance !== 0) params.resemblance = resemblance;

      const fractality = data.resolveInput?.(id, 'fractality-in') ?? localFractality;
      if (fractality !== 0) params.fractality = fractality;

      const engine = data.resolveInput?.(id, 'engine-in') || localEngine;
      if (engine) params.engine = engine;

      const result = await upscaleCreative(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      if (result.data?.task_id) {
        const status = await pollUpscaleStatus(result.data.task_id);
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
      console.error('Upscale error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, localScale, localOptimized, localEngine, localCreativity, localHdr, localResemblance, localFractality]);

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
        padding: '4px 12px', fontSize: 11, fontWeight: isActive ? 600 : 400,
        borderRadius: 14, border: 'none', cursor: 'pointer',
        background: isActive ? (activeColor || '#8b5cf6') : '#1a1a1a',
        color: isActive ? '#fff' : '#999',
      }}
    >
      {label}
    </button>
  );

  const slider = (label, value, onChange, min = -10, max = 10) => (
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
          style={{ flex: 1, accentColor: '#8b5cf6' }}
        />
        <span style={{ fontSize: 9, color: '#555', minWidth: 18 }}>{max}</span>
      </div>
    </div>
  );

  // ── Render ──

  return (
    <NodeShell
      label={data.label || 'Creative Upscale'}
      dotColor="#8b5cf6"
      selected={selected}
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

      {/* ── 2. Prompt Section ── */}
      {sectionHeader('Prompt', 'prompt-in', 'target', getHandleColor('prompt-in'), null,
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><AutoPromptButton id={id} data={data} update={update} imageKey="image-in" localImageKey="localImage" />
            <ImprovePromptButton id={id} data={data} update={update} type="image" />{hasPromptConnection ? linkedBadges('prompt-in') : null}</div>
      )}
      {hasPromptConnection ? (
        connectionInfoBox(promptConnection)
      ) : (
        <textarea
          value={data.inputPrompt || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder="Guide the upscale (e.g., sharp details, vibrant colors)..."
          rows={2}
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
          }}
        />
      )}

      {/* ── 3. Scale Factor ── */}
      {sectionHeader('Scale Factor', 'scale-factor-in', 'target', getHandleColor('aspect-ratio-in'),
        () => data.onAddToInput?.('scale_factor', id, 'scale-factor-in')
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
        {SCALE_FACTORS.map((s) => pill(s, localScale === s, () => update({ localScaleFactor: s }), '#8b5cf6'))}
      </div>

      {/* ── 4. Optimized For ── */}
      {sectionHeader('Optimized For', 'optimized-for-in', 'target', getHandleColor('aspect-ratio-in'),
        () => data.onAddToInput?.('optimized_for', id, 'optimized-for-in')
      )}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 4,
      }}>
        {OPTIMIZED_OPTIONS.map((o) => pill(o.label, localOptimized === o.value,
          () => update({ localOptimizedFor: o.value }), '#8b5cf6'
        ))}
      </div>

      {/* ── 5. Engine ── */}
      {sectionHeader('Engine', 'engine-in', 'target', getHandleColor('aspect-ratio-in'),
        () => data.onAddToInput?.('engine', id, 'engine-in')
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
        {ENGINES.map((e) => pill(e.label, localEngine === e.value,
          () => update({ localEngine: e.value }), '#8b5cf6'
        ))}
      </div>

      {/* ── 6. Creativity / HDR / Resemblance / Fractality Sliders ── */}
      <div style={{
        background: '#1a1a1a', borderRadius: 6,
        border: '1px solid #3a3a3a', padding: 10, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 8 }}>
          Creative Controls
        </div>
        {slider('Creativity', localCreativity, (v) => update({ localCreativity: v }))}
        {slider('HDR', localHdr, (v) => update({ localHdr: v }))}
        {slider('Resemblance', localResemblance, (v) => update({ localResemblance: v }))}
        {slider('Fractality', localFractality, (v) => update({ localFractality: v }))}
      </div>

      {/* ── 7. Output ── */}
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
        {isLoading ? (
          <div style={{
            width: 28, height: 28, border: '3px solid #3a3a3a',
            borderTop: '3px solid #8b5cf6', borderRadius: '50%',
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

      {/* Output handles */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6, gap: 4, alignItems: 'center' }}>
        <Handle
          type="source"
          position={Position.Right}
          id="prompt-out"
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('prompt-out'), border: 'none',
            position: 'relative', right: -12, transform: 'none',
          }}
        />
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
