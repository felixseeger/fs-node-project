import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { seedreamExpand, pollSeedreamExpandStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';

const PRESETS = [
  { label: 'Widen', left: 256, right: 256, top: 0, bottom: 0 },
  { label: 'Extend Top', left: 0, right: 0, top: 512, bottom: 0 },
  { label: 'Extend Bottom', left: 0, right: 0, top: 0, bottom: 512 },
  { label: 'Equal All', left: 128, right: 128, top: 128, bottom: 128 },
  { label: 'Banner', left: 512, right: 512, top: 0, bottom: 0 },
  { label: 'Reset', left: 0, right: 0, top: 0, bottom: 0 },
];

export default function SeedreamExpandNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);

  const localLeft = data.localLeft ?? 0;
  const localRight = data.localRight ?? 0;
  const localTop = data.localTop ?? 0;
  const localBottom = data.localBottom ?? 0;
  const localSeed = data.localSeed ?? '';

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

  const handleExpand = useCallback(async () => {
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];
    if (!images?.length) return;

    setIsLoading(true);
    update({ outputImage: null, isLoading: true });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) imageBase64 = imageBase64.split(',')[1];

      const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';

      const params = {
        image: imageBase64,
        left: localLeft,
        right: localRight,
        top: localTop,
        bottom: localBottom,
      };
      if (prompt) params.prompt = prompt;
      if (localSeed !== '' && localSeed !== undefined && localSeed !== null) {
        params.seed = Number(localSeed);
      }

      const result = await seedreamExpand(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      if (result.data?.task_id) {
        const status = await pollSeedreamExpandStatus(result.data.task_id);
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
      console.error('Seedream expand error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, localLeft, localRight, localTop, localBottom, localSeed]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleExpand();
    }
  }, [data.triggerGenerate, handleExpand]);

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

  const dirSlider = (label, value, onChange, color) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
      <span style={{ fontSize: 10, color: '#999', width: 40, textAlign: 'right', flexShrink: 0 }}>{label}</span>
      <input type="range" min={0} max={2048} step={64} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: color }} />
      <span style={{ fontSize: 10, color: '#e0e0e0', fontWeight: 600, width: 44, textAlign: 'right', flexShrink: 0 }}>{value}px</span>
    </div>
  );

  // ── Render ──

  return (
    <NodeShell label={data.label || 'Seedream Expand'} dotColor="#a855f7" selected={selected}>

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

      {/* ── 2. Prompt ── */}
      {sectionHeader('Prompt', 'prompt-in', 'target', getHandleColor('prompt-in'),
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><AutoPromptButton id={id} data={data} update={update} imageKey="image-in" localImageKey="localImage" />
            <ImprovePromptButton id={id} data={data} update={update} type="image" />{hasPromptConnection ? linkedBadges('prompt-in') : null}</div>
      )}
      {hasPromptConnection ? connectionInfoBox(promptConnection) : (
        <textarea value={data.inputPrompt || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder='Optional: guide content (auto-generated if empty)'
          rows={2}
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
          }} />
      )}

      {/* ── 3. Expansion Presets ── */}
      <div style={{ marginTop: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Presets</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
        {PRESETS.map((p) => (
          <button key={p.label} onClick={() => update({ localLeft: p.left, localRight: p.right, localTop: p.top, localBottom: p.bottom })} style={{
            padding: '4px 10px', fontSize: 10, fontWeight: 400,
            borderRadius: 14, border: 'none', cursor: 'pointer',
            background: '#1a1a1a', color: '#999',
          }}>{p.label}</button>
        ))}
      </div>

      {/* ── 4. Directional Controls ── */}
      <div style={{
        background: '#1a1a1a', borderRadius: 8, border: '1px solid #3a3a3a',
        padding: 12, marginTop: 6,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          Expansion Pixels (0–2048)
        </div>

        {/* Visual direction indicator */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 40px',
          gridTemplateRows: 'auto auto auto',
          gap: 2, alignItems: 'center', marginBottom: 8,
        }}>
          <div />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: localTop > 0 ? '#a855f7' : '#555' }}>▲ Top: {localTop}</span>
          </div>
          <div />

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 10, color: localLeft > 0 ? '#a855f7' : '#555' }}>◀ {localLeft}</span>
          </div>
          <div style={{
            background: '#0e0e0e', borderRadius: 4, border: '1px solid #333',
            padding: '8px 4px', textAlign: 'center',
          }}>
            <span style={{ fontSize: 10, color: '#666' }}>Original</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: 10, color: localRight > 0 ? '#a855f7' : '#555' }}>{localRight} ▶</span>
          </div>

          <div />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: localBottom > 0 ? '#a855f7' : '#555' }}>▼ Bottom: {localBottom}</span>
          </div>
          <div />
        </div>

        {/* Sliders */}
        {dirSlider('Left', localLeft, (v) => update({ localLeft: v }), '#a855f7')}
        {dirSlider('Right', localRight, (v) => update({ localRight: v }), '#a855f7')}
        {dirSlider('Top', localTop, (v) => update({ localTop: v }), '#a855f7')}
        {dirSlider('Bottom', localBottom, (v) => update({ localBottom: v }), '#a855f7')}

        {/* Total expansion summary */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 8,
          padding: '6px 8px', background: '#111', borderRadius: 6,
        }}>
          <span style={{ fontSize: 10, color: '#666' }}>Total width added:</span>
          <span style={{ fontSize: 10, color: '#a855f7', fontWeight: 600 }}>{localLeft + localRight}px</span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 2,
          padding: '6px 8px', background: '#111', borderRadius: 6,
        }}>
          <span style={{ fontSize: 10, color: '#666' }}>Total height added:</span>
          <span style={{ fontSize: 10, color: '#a855f7', fontWeight: 600 }}>{localTop + localBottom}px</span>
        </div>
      </div>

      {/* ── 5. Seed ── */}
      <div style={{ marginTop: 10, marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Seed (optional)</span>
          {localSeed !== '' && (
            <button onClick={() => update({ localSeed: '' })} style={{
              fontSize: 9, color: '#999', background: 'transparent', border: 'none', cursor: 'pointer',
            }}>clear</button>
          )}
        </div>
        <input
          type="number"
          min={0}
          max={2147483647}
          value={localSeed}
          onChange={(e) => update({ localSeed: e.target.value })}
          placeholder="Random if empty (0–2147483647)"
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: '8px 10px',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* ── 6. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ec4899', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Expanded Output</span>
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
            borderTop: '3px solid #a855f7', borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        ) : data.outputImage ? (
          <img src={data.outputImage} alt="expanded" style={{ width: '100%', display: 'block', borderRadius: 6 }} />
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', padding: 12, textAlign: 'center' }}>{data.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', padding: 16, textAlign: 'center' }}>Expanded image will appear here</span>
        )}
      </div>

      {/* Output handles */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6, gap: 4, alignItems: 'center' }}>
        <Handle type="source" position={Position.Right} id="prompt-out" style={{
          width: 10, height: 10, borderRadius: '50%',
          background: getHandleColor('prompt-out'), border: 'none',
          position: 'relative', right: -12, transform: 'none',
        }} />
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </NodeShell>
  );
}
