import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { styleTransfer, pollStyleTransferStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

const FLAVORS = [
  { value: 'faithful', label: 'Faithful' },
  { value: 'gen_z', label: 'Gen Z' },
  { value: 'psychedelia', label: 'Psychedelia' },
  { value: 'detaily', label: 'Detaily' },
  { value: 'clear', label: 'Clear' },
  { value: 'donotstyle', label: 'No Style' },
  { value: 'donotstyle_sharp', label: 'No Style Sharp' },
];

const ENGINES = [
  { value: 'balanced', label: 'Balanced' },
  { value: 'definio', label: 'Definio' },
  { value: 'illusio', label: 'Illusio' },
  { value: '3d_cartoon', label: '3D Cartoon' },
  { value: 'colorful_anime', label: 'Anime' },
  { value: 'caricature', label: 'Caricature' },
  { value: 'real', label: 'Real' },
  { value: 'super_real', label: 'Super Real' },
  { value: 'softy', label: 'Softy' },
];

const PORTRAIT_STYLES = [
  { value: 'standard', label: 'Standard' },
  { value: 'pop', label: 'Pop' },
  { value: 'super_pop', label: 'Super Pop' },
];

const PORTRAIT_BEAUTIFIERS = [
  { value: '', label: 'None' },
  { value: 'beautify_face', label: 'Beautify' },
  { value: 'beautify_face_max', label: 'Beautify Max' },
];

export default function StyleTransferNode({ id, data, selected }) {
  const { status, isActive, start, complete, fail } = useNodeProgress(id);

  const localStyleStrength = data.localStyleStrength ?? 100;
  const localStructureStrength = data.localStructureStrength ?? 50;
  const localIsPortrait = data.localIsPortrait ?? false;
  const localPortraitStyle = data.localPortraitStyle || 'standard';
  const localPortraitBeautifier = data.localPortraitBeautifier || '';
  const localFlavor = data.localFlavor || 'faithful';
  const localEngine = data.localEngine || 'balanced';
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
  const refConnection = getConnInfo('reference-image-in');
  const hasRefConnection = data.hasConnection?.(id, 'reference-image-in');
  const promptConnection = getConnInfo('prompt-in');
  const hasPromptConnection = data.hasConnection?.(id, 'prompt-in');

  const handleTransfer = useCallback(async () => {
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];
    if (!images?.length) return;

    let refImages = data.resolveInput?.(id, 'reference-image-in');
    if (!refImages?.length && data.localRefImage) refImages = [data.localRefImage];
    if (!refImages?.length) return;

    start();
    update({ outputImage: null, isLoading: true });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) imageBase64 = imageBase64.split(',')[1];

      let refBase64 = refImages[0];
      if (refBase64.startsWith('data:')) refBase64 = refBase64.split(',')[1];

      const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';

      const params = { image: imageBase64, reference_image: refBase64 };
      if (prompt) params.prompt = prompt;
      if (localStyleStrength !== 100) params.style_strength = localStyleStrength;
      if (localStructureStrength !== 50) params.structure_strength = localStructureStrength;
      if (localIsPortrait) {
        params.is_portrait = true;
        if (localPortraitStyle !== 'standard') params.portrait_style = localPortraitStyle;
        if (localPortraitBeautifier) params.portrait_beautifier = localPortraitBeautifier;
      }
      if (localFlavor !== 'faithful') params.flavor = localFlavor;
      if (localEngine !== 'balanced') params.engine = localEngine;
      if (localFixedGen) params.fixed_generation = localFixedGen;

      const result = await styleTransfer(params);

      if (result.error) {
        fail(result.error?.message || JSON.stringify(result.error));
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const pollResult = await pollStyleTransferStatus(taskId);
        const generated = pollResult.data?.generated || [];
        complete();
        update({
          outputImage: generated[0] || null,
          outputImages: generated,
          isLoading: false,
          outputError: null,
        });
      } else if (result.data?.generated?.length) {
        complete();
        update({
          outputImage: result.data.generated[0],
          outputImages: result.data.generated,
          isLoading: false,
          outputError: null,
        });
      } else if (result.generated?.length) {
        complete();
        update({
          outputImage: result.generated[0],
          outputImages: result.generated,
          isLoading: false,
          outputError: null,
        });
      } else {
        complete();
        update({ isLoading: false });
      }
    } catch (err) {
      console.error('Style transfer error:', err);
      fail(err.message);
      update({ isLoading: false, outputError: err.message });
    }
  }, [id, data, update, localStyleStrength, localStructureStrength, localIsPortrait,
    localPortraitStyle, localPortraitBeautifier, localFlavor, localEngine, localFixedGen, start, complete, fail]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleTransfer();
    }
  }, [data.triggerGenerate, handleTransfer]);

  // ── Helpers ──

  const sectionHeader = (label, handleId, handleType, color, onAdd, extra) => (
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {extra}
        {onAdd && (
          <button onClick={onAdd} style={{
            width: 20, height: 20, borderRadius: '50%', background: 'transparent',
            border: '1px solid #3a3a3a', color: '#999', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 1,
          }}>+</button>
        )}
      </div>
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
      background: isActive ? (color || '#ec4899') : '#1a1a1a',
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
          style={{ flex: 1, accentColor: '#ec4899' }} />
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
        background: value ? '#ec4899' : '#333', position: 'relative', transition: 'background 0.15s',
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
    <NodeShell label={data.label || 'Style Transfer'} dotColor="#ec4899" selected={selected} onGenerate={handleTransfer} isGenerating={isActive}>

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

      {/* ── 1. Source Image ── */}
      {sectionHeader('Image', 'image-in', 'target', getHandleColor('image-in'), null,
        hasImageConnection ? linkedBadges('image-in') : null
      )}
      {hasImageConnection ? connectionInfoBox(imageConnection) : (
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Click or drag to upload source image"
        />
      )}

      {/* ── 2. Reference Image (required) ── */}
      {sectionHeader('Reference Style', 'reference-image-in', 'target', getHandleColor('image-in'), null,
        hasRefConnection ? linkedBadges('reference-image-in') : null
      )}
      {hasRefConnection ? connectionInfoBox(refConnection) : (
        <ImageUploadBox
          image={data.localRefImage || data.referenceImagePreview || null}
          onImageChange={(img) => update({ localRefImage: img })}
          placeholder="Upload reference style image (required)"
          minHeight={50}
        />
      )}

      {/* ── 3. Prompt ── */}
      {sectionHeader('Prompt', 'prompt-in', 'target', getHandleColor('prompt-in'), null,
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><AutoPromptButton id={id} data={data} update={update} imageKey="image-in" localImageKey="localImage" />
            <ImprovePromptButton id={id} data={data} update={update} type="image" />{hasPromptConnection ? linkedBadges('prompt-in') : null}</div>
      )}
      {hasPromptConnection ? connectionInfoBox(promptConnection) : (
        <textarea value={data.inputPrompt || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder="Optional: describe desired style transformation..."
          rows={2}
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
          }} />
      )}

      {/* ── 4. Strengths ── */}
      <div style={{ marginTop: 10 }}>
        {slider('Style Strength', localStyleStrength, (v) => update({ localStyleStrength: v }), 0, 100)}
        {slider('Structure Strength', localStructureStrength, (v) => update({ localStructureStrength: v }), 0, 100)}
      </div>

      {/* ── 5. Flavor ── */}
      <div style={{ marginTop: 4, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Flavor</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
        {FLAVORS.map((f) => pill(f.label, localFlavor === f.value,
          () => update({ localFlavor: f.value }), '#ec4899'
        ))}
      </div>

      {/* ── 6. Engine ── */}
      <div style={{ marginTop: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Engine</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
        {ENGINES.map((e) => pill(e.label, localEngine === e.value,
          () => update({ localEngine: e.value }), '#ec4899'
        ))}
      </div>

      {/* ── 7. Portrait Settings ── */}
      <div style={{
        background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
        padding: 10, marginTop: 8,
      }}>
        {toggle('Portrait Mode', localIsPortrait, (v) => update({ localIsPortrait: v }))}
        {toggle('Fixed Generation', localFixedGen, (v) => update({ localFixedGen: v }))}

        {localIsPortrait && (
          <>
            <div style={{ marginTop: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Portrait Style</span>
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              {PORTRAIT_STYLES.map((ps) => pill(ps.label, localPortraitStyle === ps.value,
                () => update({ localPortraitStyle: ps.value }), '#ec4899'
              ))}
            </div>
            <div style={{ marginTop: 4, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Beautifier</span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {PORTRAIT_BEAUTIFIERS.map((pb) => pill(pb.label, localPortraitBeautifier === pb.value,
                () => update({ localPortraitBeautifier: pb.value }), '#ec4899'
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Progress ── */}
      <NodeProgress status={status} />

      {/* ── 8. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ec4899', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Styled Output</span>
        </div>
      </div>
      <div style={{
        background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
        minHeight: 80, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        {isActive ? (
          <div style={{
            width: 28, height: 28, border: '3px solid #3a3a3a',
            borderTop: '3px solid #ec4899', borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        ) : data.outputImage ? (
          <img src={data.outputImage} alt="styled" style={{ width: '100%', display: 'block', borderRadius: 6 }} />
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', padding: 12, textAlign: 'center' }}>{data.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', padding: 16, textAlign: 'center' }}>Styled image will appear here</span>
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
