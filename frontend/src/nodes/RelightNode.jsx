import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import { useNodeConnections, Toggle } from './shared';
import { getHandleColor } from '../utils/handleTypes';
import { NodeCapabilities } from './nodeCapabilities';
import { CATEGORY_COLORS } from './nodeTokens';
import { relightImage, pollRelightStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';


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
  const { onDisconnectNode } = useNodeConnections();
  const { isActive, start, complete, fail } = useNodeProgress();
  const { update, conn, resolve } = useNodeConnections(id, data);
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

  const imageConn = conn('image-in');
  const promptConn = conn('prompt-in');
  const refConn = conn('reference-image-in');
  const lightmapConn = conn('lightmap-in');

  const handleRelight = useCallback(async () => {
    let images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    start();
    update({ outputImage: null, isLoading: true });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) {
        imageBase64 = imageBase64.split(',')[1];
      }

      const params = { image: imageBase64 };

      // Light transfer method
      const prompt = resolve.text('prompt-in', data.inputPrompt);
      if (prompt && lightMode === 'prompt') params.prompt = prompt;

      let refImages = resolve.image('reference-image-in', data.localRefImage);
      if (refImages?.length && lightMode === 'reference') {
        let ref = refImages[0];
        if (ref.startsWith('data:')) ref = ref.split(',')[1];
        params.transfer_light_from_reference_image = ref;
      }

      let lightmaps = resolve.image('lightmap-in', data.localLightmap);
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
        fail();
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
        complete();
      }
    } catch (err) {
      console.error('Relight error:', err);
      update({ isLoading: false, outputError: err.message });
      fail();
    }
  }, [id, data, update, lightMode, localStrength, localInterpolate, localChangeBg, localStyle, localPreserveDetails,
    localWhites, localBlacks, localBrightness, localContrast, localSaturation, localEngine, localTransferA, localTransferB, localFixedGen, start, complete, fail, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleRelight();
    }
  }, [data.triggerGenerate, handleRelight]);

  const ACCENT = '#f59e0b';

  return (
    <NodeShell data={data} label={data.label || 'Relight'} dotColor={ACCENT} selected={selected} onGenerate={handleRelight} isGenerating={isActive} downloadUrl={data.outputImage || undefined} onDisconnect={onDisconnectNode} capabilities={[NodeCapabilities.IMAGE_RELIGHT, NodeCapabilities.OUTPUT_IMAGE]}>
      <OutputHandle id="output" label="image" color={getHandleColor('output')} />
      <OutputHandle id="prompt-out" label="prompt" color={getHandleColor('prompt-out')} />

      {/* ── 1. Image ── */}
      <SectionHeader 
        label="Image" 
        handleId="image-in" 
        handleType="target" 
        color={getHandleColor('image-in')}
        isConnected={imageConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'image-in')}
      />
      <ConnectedOrLocal connected={imageConn.connected} connInfo={imageConn.info}>
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Click or drag to upload image"
        />
      </ConnectedOrLocal>

      {/* ── 2. Light Transfer Mode ── */}
      <div style={{ marginTop: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Light Transfer</span>
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        <Pill label="Prompt" isActive={lightMode === 'prompt'} onClick={() => update({ localLightMode: 'prompt' })} accentColor={ACCENT} />
        <Pill label="Reference" isActive={lightMode === 'reference'} onClick={() => update({ localLightMode: 'reference' })} accentColor={ACCENT} />
        <Pill label="Lightmap" isActive={lightMode === 'lightmap'} onClick={() => update({ localLightMode: 'lightmap' })} accentColor={ACCENT} />
      </div>

      {/* ── 3. Conditional Light Source ── */}
      {lightMode === 'prompt' && (
        <>
          <SectionHeader 
            label="Prompt" 
            handleId="prompt-in" 
            handleType="target" 
            color={getHandleColor('prompt-in')}
            isConnected={promptConn.connected}
            onUnlink={() => data.onUnlink?.(id, 'prompt-in')}
            extra={<div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <AutoPromptButton id={id} data={data} update={update} imageKey="image-in" localImageKey="localImage" />
              <ImprovePromptButton id={id} data={data} update={update} type="image" />
            </div>}
          />
          <ConnectedOrLocal connected={promptConn.connected} connInfo={promptConn.info}>
            <PromptInput
              value={data.inputPrompt || ''}
              onChange={(v) => update({ inputPrompt: v })}
              placeholder='e.g. "A sunlit forest at golden hour" or "(dark scene:1.3)"'
              rows={2}
            />
          </ConnectedOrLocal>
        </>
      )}

      {lightMode === 'reference' && (
        <>
          <SectionHeader 
            label="Reference Image" 
            handleId="reference-image-in" 
            handleType="target" 
            color={getHandleColor('image-in')}
            isConnected={refConn.connected}
            onUnlink={() => data.onUnlink?.(id, 'reference-image-in')}
          />
          <ConnectedOrLocal connected={refConn.connected} connInfo={refConn.info}>
            <ImageUploadBox
              image={data.localRefImage || null}
              onImageChange={(img) => update({ localRefImage: img })}
              placeholder="Upload reference image for light transfer"
              minHeight={50}
            />
          </ConnectedOrLocal>
        </>
      )}

      {lightMode === 'lightmap' && (
        <>
          <SectionHeader 
            label="Lightmap" 
            handleId="lightmap-in" 
            handleType="target" 
            color={getHandleColor('image-in')}
            isConnected={lightmapConn.connected}
            onUnlink={() => data.onUnlink?.(id, 'lightmap-in')}
          />
          <ConnectedOrLocal connected={lightmapConn.connected} connInfo={lightmapConn.info}>
            <ImageUploadBox
              image={data.localLightmap || null}
              onImageChange={(img) => update({ localLightmap: img })}
              placeholder="Upload lightmap (black=dark, white=light)"
              minHeight={50}
            />
          </ConnectedOrLocal>
        </>
      )}

      {/* ── 4. Light Transfer Strength ── */}
      <div style={{ marginTop: 10 }}>
        <Slider label="Transfer Strength" value={localStrength} onChange={(v) => update({ localStrength: v })} min={0} max={100} accentColor={ACCENT} />
      </div>

      {/* ── 5. Style ── */}
      <div style={{ marginTop: 4, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Style</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
        {STYLES.map((s) => (
          <Pill key={s.value} label={s.label} isActive={localStyle === s.value} onClick={() => update({ localStyle: s.value })} accentColor={ACCENT} />
        ))}
      </div>

      {/* ── 6. Toggles ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)',
        padding: 10, marginTop: 8,
      }}>
        <Toggle label="Change Background" value={localChangeBg} onChange={(v) => update({ localChangeBg: v })} accentColor={ACCENT} />
        <Toggle label="Interpolate from Original" value={localInterpolate} onChange={(v) => update({ localInterpolate: v })} accentColor={ACCENT} />
        <Toggle label="Preserve Details" value={localPreserveDetails} onChange={(v) => update({ localPreserveDetails: v })} accentColor={ACCENT} />
      </div>

      {/* ── 7. Advanced Settings (collapsible) ── */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="nodrag nopan"
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
          background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)',
          padding: 10, marginBottom: 4,
        }}>
          <Slider label="Whites" value={localWhites} onChange={(v) => update({ localWhites: v })} accentColor={ACCENT} />
          <Slider label="Blacks" value={localBlacks} onChange={(v) => update({ localBlacks: v })} accentColor={ACCENT} />
          <Slider label="Brightness" value={localBrightness} onChange={(v) => update({ localBrightness: v })} accentColor={ACCENT} />
          <Slider label="Contrast" value={localContrast} onChange={(v) => update({ localContrast: v })} accentColor={ACCENT} />
          <Slider label="Saturation" value={localSaturation} onChange={(v) => update({ localSaturation: v })} accentColor={ACCENT} />

          <div style={{ marginTop: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Engine</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {ENGINES.map((e) => (
              <Pill key={e.value} label={e.label} isActive={localEngine === e.value} onClick={() => update({ localEngine: e.value })} accentColor={ACCENT} />
            ))}
          </div>

          <div style={{ marginTop: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Transfer A</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {TRANSFER_A.map((t) => (
              <Pill key={t.value} label={t.label} isActive={localTransferA === t.value} onClick={() => update({ localTransferA: t.value })} accentColor={ACCENT} />
            ))}
          </div>

          <div style={{ marginTop: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Transfer B</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {TRANSFER_B.map((t) => (
              <Pill key={t.value} label={t.label} isActive={localTransferB === t.value} onClick={() => update({ localTransferB: t.value })} accentColor={ACCENT} />
            ))}
          </div>

          <Toggle label="Fixed Generation" value={localFixedGen} onChange={(v) => update({ localFixedGen: v })} accentColor={ACCENT} />
        </div>
      )}

      <NodeProgress isActive={isActive} />

      <OutputPreview
        isLoading={isActive}
        output={data.outputImage}
        error={data.outputError}
        accentColor={ACCENT}
        label="Relit Output"
      />
    </NodeShell>
  );
}
