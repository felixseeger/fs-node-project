import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { relightImage, pollRelightStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';

const STYLES = [
  { value: 'standard', label: 'Standard' },
  { value: 'darker_but_realistic', label: 'Dark Realistic' },
  { value: 'clean', label: 'Clean' },
  { value: 'smooth', label: 'Smooth' },
  { value: 'brighter', label: 'Brighter' },
  { value: 'contrasted_n_hdr', label: 'Contrast HDR' },
  { value: 'just_composition', label: 'Composition' },
];

const ENGINES = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'cool', label: 'Cool' },
  { value: 'real', label: 'Real' },
  { value: 'illusio', label: 'Illusio' },
  { value: 'fairy', label: 'Fairy' },
  { value: 'colorful_anime', label: 'Anime' },
  { value: 'hard_transform', label: 'Hard' },
  { value: 'softy', label: 'Softy' },
];

const TRANSFER_A = [
  { value: 'automatic', label: 'Auto' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'high_on_faces', label: 'Faces' },
];

const TRANSFER_B = [
  { value: 'automatic', label: 'Auto' },
  { value: 'composition', label: 'Composition' },
  { value: 'straight', label: 'Straight' },
  { value: 'smooth_in', label: 'Smooth In' },
  { value: 'smooth_out', label: 'Smooth Out' },
  { value: 'smooth_both', label: 'Smooth Both' },
  { value: 'soft_in', label: 'Soft In' },
  { value: 'soft_out', label: 'Soft Out' },
  { value: 'soft_mid', label: 'Soft Mid' },
  { value: 'strong_mid', label: 'Strong Mid' },
];

export default function RelightNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const lightMode = data.localLightMode || 'prompt';
  const localStrength = data.localStrength ?? 100;
  const localInterpolate = data.localInterpolate ?? false;
  const localChangeBg = data.localChangeBg ?? true;
  const localStyle = data.localStyle || 'standard';
  const localPreserveDetails = data.localPreserveDetails ?? true;

  // Advanced defaults
  const localWhites = data.localWhites ?? 50;
  const localBlacks = data.localBlacks ?? 50;
  const localBrightness = data.localBrightness ?? 50;
  const localContrast = data.localContrast ?? 50;
  const localSaturation = data.localSaturation ?? 50;
  const localEngine = data.localEngine || 'automatic';
  const localTransferA = data.localTransferA || 'automatic';
  const localTransferB = data.localTransferB || 'automatic';
  const localFixedGen = data.localFixedGen ?? false;

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
  const refConnection = getConnInfo('reference-image-in');
  const hasRefConnection = data.hasConnection?.(id, 'reference-image-in');
  const lightmapConnection = getConnInfo('lightmap-in');
  const hasLightmapConnection = data.hasConnection?.(id, 'lightmap-in');

  const handleRelight = useCallback(async () => {
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

      const params = { image: imageBase64 };

      // Light transfer method
      const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
      if (prompt && lightMode === 'prompt') params.prompt = prompt;

      let refImages = data.resolveInput?.(id, 'reference-image-in');
      if (!refImages?.length && data.localRefImage) refImages = [data.localRefImage];
      if (refImages?.length && lightMode === 'reference') {
        let ref = refImages[0];
        if (ref.startsWith('data:')) ref = ref.split(',')[1];
        params.transfer_light_from_reference_image = ref;
      }

      let lightmaps = data.resolveInput?.(id, 'lightmap-in');
      if (!lightmaps?.length && data.localLightmap) lightmaps = [data.localLightmap];
      if (lightmaps?.length && lightMode === 'lightmap') {
        let lm = lightmaps[0];
        if (lm.startsWith('data:')) lm = lm.split(',')[1];
        params.transfer_light_from_lightmap = lm;
      }

      if (localStrength !== 100) params.light_transfer_strength = localStrength;
      if (localInterpolate) params.interpolate_from_original = localInterpolate;
      if (!localChangeBg) params.change_background = localChangeBg;
      if (localStyle !== 'standard') params.style = localStyle;
      if (!localPreserveDetails) params.preserve_details = localPreserveDetails;

      // Advanced settings (only send if not all defaults)
      const adv = {};
      if (localWhites !== 50) adv.whites = localWhites;
      if (localBlacks !== 50) adv.blacks = localBlacks;
      if (localBrightness !== 50) adv.brightness = localBrightness;
      if (localContrast !== 50) adv.contrast = localContrast;
      if (localSaturation !== 50) adv.saturation = localSaturation;
      if (localEngine !== 'automatic') adv.engine = localEngine;
      if (localTransferA !== 'automatic') adv.transfer_light_a = localTransferA;
      if (localTransferB !== 'automatic') adv.transfer_light_b = localTransferB;
      if (localFixedGen) adv.fixed_generation = localFixedGen;
      if (Object.keys(adv).length > 0) params.advanced_settings = adv;

      const result = await relightImage(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      if (result.data?.task_id) {
        const status = await pollRelightStatus(result.data.task_id);
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
      console.error('Relight error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, lightMode, localStrength, localInterpolate, localChangeBg, localStyle, localPreserveDetails,
    localWhites, localBlacks, localBrightness, localContrast, localSaturation, localEngine, localTransferA, localTransferB, localFixedGen]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleRelight();
    }
  }, [data.triggerGenerate, handleRelight]);

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
          <button onClick={onAdd} style={{
            width: 20, height: 20, borderRadius: '50%',
            background: 'transparent', border: '1px solid #3a3a3a',
            color: '#999', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0, lineHeight: 1,
          }}>+</button>
        )}
      </div>
    </div>
  );

  const linkedBadges = (onUnlinkHandle) => (
    <>
      <span style={{ fontSize: 9, color: '#3b82f6', padding: '2px 6px', background: 'rgba(59,130,246,0.1)', borderRadius: 4 }}>linked</span>
      <button onClick={() => data.onUnlink?.(id, onUnlinkHandle)} style={{
        fontSize: 9, color: '#ef4444', padding: '2px 6px',
        background: 'rgba(239,68,68,0.15)', borderRadius: 4,
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
      background: isActive ? (color || '#f59e0b') : '#1a1a1a',
      color: isActive ? '#fff' : '#999',
    }}>{label}</button>
  );

  const slider = (label, value, onChange, min = 0, max = 100) => (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#999' }}>{label}</span>
        <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 9, color: '#555', minWidth: 18, textAlign: 'right' }}>{min}</span>
        <input type="range" min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#f59e0b' }} />
        <span style={{ fontSize: 9, color: '#555', minWidth: 18 }}>{max}</span>
      </div>
    </div>
  );

  const toggle = (label, value, onChange) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 6, padding: '4px 0',
    }}>
      <span style={{ fontSize: 11, color: '#999' }}>{label}</span>
      <button onClick={() => onChange(!value)} style={{
        width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
        background: value ? '#f59e0b' : '#333',
        position: 'relative', transition: 'background 0.15s',
      }}>
        <span style={{
          width: 14, height: 14, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3, left: value ? 19 : 3, transition: 'left 0.15s',
        }} />
      </button>
    </div>
  );

  // ── Render ──

  return (
    <NodeShell label={data.label || 'Relight'} dotColor="#f59e0b" selected={selected}>

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
      {sectionHeader('Image', 'image-in', 'target', getHandleColor('image-in'), null,
        hasImageConnection ? linkedBadges('image-in') : null
      )}
      {hasImageConnection ? connectionInfoBox(imageConnection) : (
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Click or drag to upload image"
        />
      )}

      {/* ── 2. Light Transfer Mode ── */}
      <div style={{ marginTop: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Light Transfer</span>
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {pill('Prompt', lightMode === 'prompt', () => update({ localLightMode: 'prompt' }), '#f59e0b')}
        {pill('Reference', lightMode === 'reference', () => update({ localLightMode: 'reference' }), '#f59e0b')}
        {pill('Lightmap', lightMode === 'lightmap', () => update({ localLightMode: 'lightmap' }), '#f59e0b')}
      </div>

      {/* ── 3. Conditional Light Source ── */}
      {lightMode === 'prompt' && (
        <>
          {sectionHeader('Prompt', 'prompt-in', 'target', getHandleColor('prompt-in'), null,
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><AutoPromptButton id={id} data={data} update={update} imageKey="image-in" localImageKey="localImage" />
            <ImprovePromptButton id={id} data={data} update={update} type="image" />{hasPromptConnection ? linkedBadges('prompt-in') : null}</div>
          )}
          {hasPromptConnection ? connectionInfoBox(promptConnection) : (
            <textarea
              value={data.inputPrompt || ''}
              onChange={(e) => update({ inputPrompt: e.target.value })}
              placeholder='e.g. "A sunlit forest at golden hour" or "(dark scene:1.3)"'
              rows={2}
              style={{
                width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
                borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
                resize: 'vertical', outline: 'none', boxSizing: 'border-box',
              }}
            />
          )}
        </>
      )}

      {lightMode === 'reference' && (
        <>
          {sectionHeader('Reference Image', 'reference-image-in', 'target', getHandleColor('image-in'), null,
            hasRefConnection ? linkedBadges('reference-image-in') : null
          )}
          {hasRefConnection ? connectionInfoBox(refConnection) : (
            <ImageUploadBox
              image={data.localRefImage || null}
              onImageChange={(img) => update({ localRefImage: img })}
              placeholder="Upload reference image for light transfer"
              minHeight={50}
            />
          )}
        </>
      )}

      {lightMode === 'lightmap' && (
        <>
          {sectionHeader('Lightmap', 'lightmap-in', 'target', getHandleColor('image-in'), null,
            hasLightmapConnection ? linkedBadges('lightmap-in') : null
          )}
          {hasLightmapConnection ? connectionInfoBox(lightmapConnection) : (
            <ImageUploadBox
              image={data.localLightmap || null}
              onImageChange={(img) => update({ localLightmap: img })}
              placeholder="Upload lightmap (black=dark, white=light)"
              minHeight={50}
            />
          )}
        </>
      )}

      {/* ── 4. Light Transfer Strength ── */}
      <div style={{ marginTop: 10 }}>
        {slider('Transfer Strength', localStrength, (v) => update({ localStrength: v }), 0, 100)}
      </div>

      {/* ── 5. Style ── */}
      <div style={{ marginTop: 4, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Style</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
        {STYLES.map((s) => pill(s.label, localStyle === s.value,
          () => update({ localStyle: s.value }), '#f59e0b'
        ))}
      </div>

      {/* ── 6. Toggles ── */}
      <div style={{
        background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
        padding: 10, marginTop: 8,
      }}>
        {toggle('Change Background', localChangeBg, (v) => update({ localChangeBg: v }))}
        {toggle('Interpolate from Original', localInterpolate, (v) => update({ localInterpolate: v }))}
        {toggle('Preserve Details', localPreserveDetails, (v) => update({ localPreserveDetails: v }))}
      </div>

      {/* ── 7. Advanced Settings (collapsible) ── */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{
          width: '100%', padding: '8px 0', marginTop: 8, marginBottom: 4,
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Advanced Settings</span>
        <span style={{ fontSize: 11, color: '#666', transform: showAdvanced ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>›</span>
      </button>

      {showAdvanced && (
        <div style={{
          background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
          padding: 10, marginBottom: 4,
        }}>
          {slider('Whites', localWhites, (v) => update({ localWhites: v }))}
          {slider('Blacks', localBlacks, (v) => update({ localBlacks: v }))}
          {slider('Brightness', localBrightness, (v) => update({ localBrightness: v }))}
          {slider('Contrast', localContrast, (v) => update({ localContrast: v }))}
          {slider('Saturation', localSaturation, (v) => update({ localSaturation: v }))}

          <div style={{ marginTop: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Engine</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {ENGINES.map((e) => pill(e.label, localEngine === e.value,
              () => update({ localEngine: e.value }), '#f59e0b'
            ))}
          </div>

          <div style={{ marginTop: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Transfer A</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {TRANSFER_A.map((t) => pill(t.label, localTransferA === t.value,
              () => update({ localTransferA: t.value }), '#f59e0b'
            ))}
          </div>

          <div style={{ marginTop: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Transfer B</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {TRANSFER_B.map((t) => pill(t.label, localTransferB === t.value,
              () => update({ localTransferB: t.value }), '#f59e0b'
            ))}
          </div>

          {toggle('Fixed Generation', localFixedGen, (v) => update({ localFixedGen: v }))}
        </div>
      )}

      {/* ── 8. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ec4899', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Relit Output</span>
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
            borderTop: '3px solid #f59e0b', borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        ) : data.outputImage ? (
          <img src={data.outputImage} alt="relit" style={{ width: '100%', display: 'block', borderRadius: 6 }} />
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', padding: 12, textAlign: 'center' }}>{data.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', padding: 16, textAlign: 'center' }}>Relit image will appear here</span>
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
