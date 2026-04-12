import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  PromptInput,
  TextInput,
  Pill,
  OutputHandle,
  OutputPreview,
  useNodeConnections,
  getHandleColor,
} from './shared';
import { ideogramInpaint, pollIdeogramInpaintStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

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
  const { isActive, start, fail, complete } = useNodeProgress();
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const localRenderingSpeed = data.localRenderingSpeed || 'DEFAULT';
  const localMagicPrompt = data.localMagicPrompt || '';
  const localStyleType = data.localStyleType || '';
  const localColorPalette = data.localColorPalette || '';
  const localSeed = data.localSeed ?? '';

  const imageConn = conn('image-in');
  const maskConn = conn('mask-in');
  const promptConn = conn('prompt-in');

  const handleInpaint = useCallback(async () => {
    let images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    let masks = resolve.image('mask-in', data.localMask);
    if (!masks?.length) return;

    const prompt = resolve.text('prompt-in', data.inputPrompt);
    if (!prompt) return;

    start();
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
        fail();
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
      complete();
    } catch (err) {
      console.error('Ideogram inpaint error:', err);
      update({ isLoading: false, outputError: err.message });
      fail();
    }
  }, [id, data, update, localRenderingSpeed, localMagicPrompt, localStyleType, localColorPalette, localSeed, start, fail, complete, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleInpaint();
    }
  }, [data.triggerGenerate, handleInpaint]);

  const ACCENT = '#d946ef';

  return (
    <NodeShell data={data} label={data.label || 'Ideogram Inpaint'} dotColor={ACCENT} selected={selected} onGenerate={handleInpaint} isGenerating={isActive} downloadUrl={data.outputImage || undefined} onDisconnect={disconnectNode}>
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
          placeholder="Click or drag to upload source image"
        />
      </ConnectedOrLocal>

      {/* ── 2. Mask ── */}
      <SectionHeader 
        label="Mask" 
        handleId="mask-in" 
        handleType="target" 
        color={getHandleColor('image-in')}
        isConnected={maskConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'mask-in')}
      />
      <ConnectedOrLocal connected={maskConn.connected} connInfo={maskConn.info}>
        <ImageUploadBox
          image={data.localMask || null}
          onImageChange={(img) => update({ localMask: img })}
          placeholder="Upload mask (Black = edit, White = keep)"
          minHeight={40}
        />
      </ConnectedOrLocal>

      {/* ── 3. Prompt (required) ── */}
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
          placeholder='Describe desired changes (required)'
          rows={2}
        />
      </ConnectedOrLocal>

      {/* ── 4. Rendering Speed ── */}
      <div style={{ marginTop: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Rendering Speed</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        {RENDERING_SPEEDS.map((rs) => (
          <button 
            key={rs.value} 
            className="nodrag nopan"
            onClick={() => update({ localRenderingSpeed: rs.value })} 
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              flex: 1, padding: '8px 6px', fontSize: 11, textAlign: 'center',
              borderRadius: 8, border: 'none', cursor: 'pointer',
              background: localRenderingSpeed === rs.value ? 'rgba(217,70,239,0.15)' : '#1a1a1a',
              borderLeft: localRenderingSpeed === rs.value ? `3px solid ${ACCENT}` : '3px solid transparent',
              transition: 'all 0.15s',
            }}
          >
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
        {MAGIC_PROMPT_OPTIONS.map((mp) => (
          <Pill key={mp.label} label={mp.label} isActive={localMagicPrompt === mp.value} onClick={() => update({ localMagicPrompt: mp.value })} accentColor={ACCENT} />
        ))}
      </div>

      {/* ── 6. Advanced Settings (collapsible) ── */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="nodrag nopan"
        onMouseDown={(e) => e.stopPropagation()}
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
          background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)',
          padding: 10, marginBottom: 4,
        }}>
          {/* Style Type */}
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Style Type</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {STYLE_TYPES.map((st) => (
              <Pill key={st.label} label={st.label} isActive={localStyleType === st.value} onClick={() => update({ localStyleType: st.value })} accentColor={ACCENT} />
            ))}
          </div>

          {/* Color Palette */}
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Color Palette</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {COLOR_PALETTES.map((cp) => (
              <Pill key={cp.label} label={cp.label} isActive={localColorPalette === cp.value} onClick={() => update({ localColorPalette: cp.value })} accentColor={ACCENT} />
            ))}
          </div>

          {/* Seed */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Seed</span>
            </div>
            <TextInput
              type="number"
              value={String(localSeed)}
              onChange={(v) => update({ localSeed: v })}
              placeholder="Random if empty"
            />
          </div>
        </div>
      )}

      <NodeProgress isActive={isActive} />

      <OutputPreview
        isLoading={isActive}
        output={data.outputImage}
        error={data.outputError}
        accentColor={ACCENT}
        label="Inpainted Output"
      />
    </NodeShell>
  );
}
