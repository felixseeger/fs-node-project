import { useCallback, useState, useEffect, useRef } from 'react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { ideogramInpaint, pollIdeogramInpaintStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import {
  SectionHeader,
  LinkedBadges,
  ConnectedOrLocal,
  OutputHandle,
  SecondaryOutputHandle,
  OutputPreview,
  PillGroup,
  Pill,
  TextInput,
  PromptInput,
  SettingsPanel,
  useNodeConnections,
  stripBase64Prefix,
  surface,
  text,
  font,
  sp,
  radius,
  border,
} from './shared';

const ACCENT = '#d946ef';

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
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localRenderingSpeed = data.localRenderingSpeed || 'DEFAULT';
  const localMagicPrompt = data.localMagicPrompt || '';
  const localStyleType = data.localStyleType || '';
  const localColorPalette = data.localColorPalette || '';
  const localSeed = data.localSeed ?? '';

  const image = conn('image-in');
  const mask = conn('mask-in');
  const prompt = conn('prompt-in');

  const handleInpaint = useCallback(async () => {
    const images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    const masks = resolve.image('mask-in', data.localMask);
    if (!masks?.length) return;

    const promptText = resolve.text('prompt-in', data.inputPrompt);
    if (!promptText) return;

    setIsLoading(true);
    update({ outputImage: null, isLoading: true });

    try {
      const imageBase64 = stripBase64Prefix(images[0]);
      const maskBase64 = stripBase64Prefix(masks[0]);

      const params = { image: imageBase64, mask: maskBase64, prompt: promptText };

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
  }, [id, data, update, resolve, localRenderingSpeed, localMagicPrompt, localStyleType, localColorPalette, localSeed]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleInpaint();
    }
  }, [data.triggerGenerate, handleInpaint]);

  return (
    <NodeShell label={data.label || 'Ideogram Inpaint'} dotColor={ACCENT} selected={selected}>

      {/* 1. Image */}
      <SectionHeader
        label="Image"
        handleId="image-in"
        handleType="target"
        color={getHandleColor('image-in')}
        extra={image.connected ? (
          <LinkedBadges nodeId={id} handleId="image-in" onUnlink={data.onUnlink} />
        ) : null}
      />
      <ConnectedOrLocal connected={image.connected} connInfo={image.info}>
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Click or drag to upload source image"
        />
      </ConnectedOrLocal>

      {/* 2. Mask */}
      <SectionHeader
        label="Mask"
        handleId="mask-in"
        handleType="target"
        color={getHandleColor('image-in')}
        extra={mask.connected ? (
          <LinkedBadges nodeId={id} handleId="mask-in" onUnlink={data.onUnlink} />
        ) : null}
      />
      <ConnectedOrLocal connected={mask.connected} connInfo={mask.info}>
        <ImageUploadBox
          image={data.localMask || null}
          onImageChange={(img) => update({ localMask: img })}
          placeholder="Upload mask (Black = edit, White = keep)"
          minHeight={40}
        />
      </ConnectedOrLocal>

      {/* 3. Prompt (required) */}
      <SectionHeader
        label="Prompt"
        handleId="prompt-in"
        handleType="target"
        color={getHandleColor('prompt-in')}
        extra={
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <AutoPromptButton id={id} data={data} update={update} imageKey="image-in" localImageKey="localImage" />
            <ImprovePromptButton id={id} data={data} update={update} type="image" />
            {prompt.connected ? <LinkedBadges nodeId={id} handleId="prompt-in" onUnlink={data.onUnlink} /> : null}
          </div>
        }
      />
      <ConnectedOrLocal connected={prompt.connected} connInfo={prompt.info}>
        <PromptInput
          value={data.inputPrompt}
          onChange={(v) => update({ inputPrompt: v })}
          placeholder="Describe desired changes (required)"
          rows={2}
        />
      </ConnectedOrLocal>

      {/* 4. Rendering Speed */}
      <div style={{ marginTop: sp[4], marginBottom: sp[2] }}>
        <span style={font.sublabel}>Rendering Speed</span>
      </div>
      <div style={{ display: 'flex', gap: sp[3], marginBottom: sp[1] }}>
        {RENDERING_SPEEDS.map((rs) => (
          <button key={rs.value} onClick={() => update({ localRenderingSpeed: rs.value })} style={{
            flex: 1, padding: `${sp[3]}px ${sp[2]}px`, fontSize: 11, textAlign: 'center',
            borderRadius: radius.lg, border: 'none', cursor: 'pointer',
            background: localRenderingSpeed === rs.value ? 'rgba(217,70,239,0.15)' : surface.sunken,
            borderLeft: localRenderingSpeed === rs.value ? `3px solid ${ACCENT}` : '3px solid transparent',
            transition: 'all 0.15s',
          }}>
            <div style={{ fontWeight: localRenderingSpeed === rs.value ? 600 : 400, color: localRenderingSpeed === rs.value ? text.primary : text.secondary }}>
              {rs.label}
            </div>
            <div style={{ ...font.micro, color: text.muted }}>{rs.desc}</div>
          </button>
        ))}
      </div>

      {/* 5. MagicPrompt */}
      <div style={{ marginTop: sp[3], marginBottom: sp[2] }}>
        <span style={font.sublabel}>MagicPrompt</span>
      </div>
      <PillGroup
        options={MAGIC_PROMPT_OPTIONS}
        value={localMagicPrompt}
        onChange={(v) => update({ localMagicPrompt: v })}
        accentColor={ACCENT}
      />

      {/* 6. Advanced Settings (collapsible) */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{
          width: '100%', padding: `${sp[3]}px 0`, marginTop: sp[3], marginBottom: sp[1],
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <span style={font.sublabel}>Advanced Settings</span>
        <span style={{
          ...font.sm, color: text.muted,
          transform: showAdvanced ? 'rotate(90deg)' : 'none',
          transition: 'transform 0.15s',
        }}>&rsaquo;</span>
      </button>

      {showAdvanced && (
        <SettingsPanel>
          {/* Style Type */}
          <div style={{ marginBottom: sp[3] }}>
            <span style={font.sublabel}>Style Type</span>
          </div>
          <PillGroup
            options={STYLE_TYPES}
            value={localStyleType}
            onChange={(v) => update({ localStyleType: v })}
            accentColor={ACCENT}
          />

          {/* Color Palette */}
          <div style={{ marginBottom: sp[3] }}>
            <span style={font.sublabel}>Color Palette</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: sp[1], marginBottom: sp[4] }}>
            {COLOR_PALETTES.map((cp) => (
              <Pill
                key={cp.value}
                label={cp.label}
                isActive={localColorPalette === cp.value}
                onClick={() => update({ localColorPalette: cp.value })}
                accentColor={ACCENT}
              />
            ))}
          </div>

          {/* Seed */}
          <div style={{ marginBottom: sp[2] }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: sp[1] }}>
              <span style={font.sublabel}>Seed</span>
              {localSeed !== '' && (
                <button onClick={() => update({ localSeed: '' })} style={{
                  ...font.micro, color: text.secondary, background: 'transparent', border: 'none', cursor: 'pointer',
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
                width: '100%', background: surface.deep, border: `1px solid ${border.subtle}`,
                borderRadius: radius.md, color: text.primary, fontSize: 12, padding: `${sp[2]}px ${sp[3]}px`,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </SettingsPanel>
      )}

      {/* 7. Output */}
      <OutputPreview
        isLoading={isLoading}
        output={data.outputImage}
        error={data.outputError}
        type="image"
        label="Inpainted Output"
        accentColor={ACCENT}
        emptyText="Inpainted image will appear here"
      />

      {/* Output handles */}
      <SecondaryOutputHandle id="prompt-out" />
      <SecondaryOutputHandle id="output" />

    </NodeShell>
  );
}
