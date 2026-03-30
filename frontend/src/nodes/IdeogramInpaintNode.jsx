import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { ideogramInpaint, pollIdeogramInpaintStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';

const RENDERING_SPEEDS = [
  { value: 'TURBO', label: 'Turbo', desc: 'Fastest' },
  { value: 'DEFAULT', label: 'Default', desc: 'Balanced' },
  { value: 'QUALITY', label: 'Quality', desc: 'Best' },
];

const MAGIC_PROMPT_OPTIONS = [
  { value: '', label: 'Auto' },
  { value: 'ON', label: 'On' },
  { value: 'OFF', label: 'Off' },
];

const STYLE_TYPES = [
  { value: '', label: 'Auto' },
  { value: 'GENERAL', label: 'General' },
  { value: 'REALISTIC', label: 'Realistic' },
  { value: 'DESIGN', label: 'Design' },
];

const COLOR_PALETTES = [
  { value: '', label: 'None' },
  { value: 'EMBER', label: 'Ember' },
  { value: 'FRESH', label: 'Fresh' },
  { value: 'JUNGLE', label: 'Jungle' },
  { value: 'MAGIC', label: 'Magic' },
  { value: 'MELON', label: 'Melon' },
  { value: 'MOSAIC', label: 'Mosaic' },
  { value: 'PASTEL', label: 'Pastel' },
  { value: 'ULTRAMARINE', label: 'Ultramarine' },
];

export default function IdeogramInpaintNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const localRenderingSpeed = data.localRenderingSpeed || 'DEFAULT';
  const localMagicPrompt = data.localMagicPrompt || '';
  const localStyleType = data.localStyleType || '';
  const localColorPalette = data.localColorPalette || '';
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
  const maskConnection = getConnInfo('mask-in');
  const hasMaskConnection = data.hasConnection?.(id, 'mask-in');
  const promptConnection = getConnInfo('prompt-in');
  const hasPromptConnection = data.hasConnection?.(id, 'prompt-in');

  const handleInpaint = useCallback(async () => {
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];
    if (!images?.length) return;

    let masks = data.resolveInput?.(id, 'mask-in');
    if (!masks?.length && data.localMask) masks = [data.localMask];
    if (!masks?.length) return;

    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
    if (!prompt) return;

    setIsLoading(true);
    update({ outputImage: null, isLoading: true });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) imageBase64 = imageBase64.split(',')[1];

      let maskBase64 = masks[0];
      if (maskBase64.startsWith('data:')) maskBase64 = maskBase64.split(',')[1];

      const params = { image: imageBase64, mask: maskBase64, prompt };

      if (localRenderingSpeed !== 'DEFAULT') params.rendering_speed = localRenderingSpeed;
      if (localMagicPrompt) params.magic_prompt = localMagicPrompt;
      if (localStyleType) params.style_type = localStyleType;
      if (localSeed !== '' && localSeed !== undefined && localSeed !== null) params.seed = Number(localSeed);
      if (localColorPalette) params.color_palette = { name: localColorPalette };

      const result = await ideogramInpaint(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      if (result.data?.task_id) {
        const status = await pollIdeogramInpaintStatus(result.data.task_id);
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
      console.error('Ideogram inpaint error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, localRenderingSpeed, localMagicPrompt, localStyleType, localColorPalette, localSeed]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleInpaint();
    }
  }, [data.triggerGenerate, handleInpaint]);

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

  const pill = (label, isActive, onClick, color) => (
    <button key={label} onClick={onClick} style={{
      padding: '4px 10px', fontSize: 11, fontWeight: isActive ? 600 : 400,
      borderRadius: 14, border: 'none', cursor: 'pointer',
      background: isActive ? (color || '#d946ef') : '#1a1a1a',
      color: isActive ? '#fff' : '#999',
    }}>{label}</button>
  );

  const ACCENT = '#d946ef';

  // ── Render ──

  return (
    <NodeShell label={data.label || 'Ideogram Inpaint'} dotColor={ACCENT} selected={selected}>

      {/* ── 1. Image ── */}
      {sectionHeader('Image', 'image-in', 'target', getHandleColor('image-in'),
        hasImageConnection ? linkedBadges('image-in') : null
      )}
      {hasImageConnection ? connectionInfoBox(imageConnection) : (
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Click or drag to upload source image"
        />
      )}

      {/* ── 2. Mask ── */}
      {sectionHeader('Mask', 'mask-in', 'target', getHandleColor('image-in'),
        hasMaskConnection ? linkedBadges('mask-in') : null
      )}
      {hasMaskConnection ? connectionInfoBox(maskConnection) : (
        <ImageUploadBox
          image={data.localMask || null}
          onImageChange={(img) => update({ localMask: img })}
          placeholder="Upload mask (Black = edit, White = keep)"
          minHeight={40}
        />
      )}

      {/* ── 3. Prompt (required) ── */}
      {sectionHeader('Prompt', 'prompt-in', 'target', getHandleColor('prompt-in'),
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><AutoPromptButton id={id} data={data} update={update} imageKey="image-in" localImageKey="localImage" />
            <ImprovePromptButton id={id} data={data} update={update} type="image" />{hasPromptConnection ? linkedBadges('prompt-in') : null}</div>
      )}
      {hasPromptConnection ? connectionInfoBox(promptConnection) : (
        <textarea value={data.inputPrompt || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder='Describe desired changes (required)'
          rows={2}
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
          }} />
      )}

      {/* ── 4. Rendering Speed ── */}
      <div style={{ marginTop: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Rendering Speed</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        {RENDERING_SPEEDS.map((rs) => (
          <button key={rs.value} onClick={() => update({ localRenderingSpeed: rs.value })} style={{
            flex: 1, padding: '8px 6px', fontSize: 11, textAlign: 'center',
            borderRadius: 8, border: 'none', cursor: 'pointer',
            background: localRenderingSpeed === rs.value ? 'rgba(217,70,239,0.15)' : '#1a1a1a',
            borderLeft: localRenderingSpeed === rs.value ? `3px solid ${ACCENT}` : '3px solid transparent',
            transition: 'all 0.15s',
          }}>
            <div style={{ fontWeight: localRenderingSpeed === rs.value ? 600 : 400, color: localRenderingSpeed === rs.value ? '#e0e0e0' : '#999' }}>
              {rs.label}
            </div>
            <div style={{ fontSize: 9, color: '#666' }}>{rs.desc}</div>
          </button>
        ))}
      </div>

      {/* ── 5. MagicPrompt ── */}
      <div style={{ marginTop: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>MagicPrompt</span>
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {MAGIC_PROMPT_OPTIONS.map((mp) => pill(mp.label, localMagicPrompt === mp.value,
          () => update({ localMagicPrompt: mp.value }), ACCENT
        ))}
      </div>

      {/* ── 6. Advanced Settings (collapsible) ── */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{
          width: '100%', padding: '8px 0', marginTop: 8, marginBottom: 4,
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Advanced Settings</span>
        <span style={{
          fontSize: 11, color: '#666',
          transform: showAdvanced ? 'rotate(90deg)' : 'none',
          transition: 'transform 0.15s',
        }}>›</span>
      </button>

      {showAdvanced && (
        <div style={{
          background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
          padding: 10, marginBottom: 4,
        }}>
          {/* Style Type */}
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Style Type</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {STYLE_TYPES.map((st) => pill(st.label, localStyleType === st.value,
              () => update({ localStyleType: st.value }), ACCENT
            ))}
          </div>

          {/* Color Palette */}
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Color Palette</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {COLOR_PALETTES.map((cp) => pill(cp.label, localColorPalette === cp.value,
              () => update({ localColorPalette: cp.value }), ACCENT
            ))}
          </div>

          {/* Seed */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Seed</span>
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
              placeholder="Random if empty"
              style={{
                width: '100%', background: '#111', border: '1px solid #3a3a3a',
                borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: '6px 8px',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      )}

      {/* ── 7. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ec4899', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Inpainted Output</span>
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
          <img src={data.outputImage} alt="inpainted" style={{ width: '100%', display: 'block', borderRadius: 6 }} />
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', padding: 12, textAlign: 'center' }}>{data.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', padding: 16, textAlign: 'center' }}>Inpainted image will appear here</span>
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
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
