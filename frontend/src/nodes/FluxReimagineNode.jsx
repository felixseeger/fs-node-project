import { useCallback, useState, useEffect, useRef } from 'react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { reimagineFlux } from '../utils/api';
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
  PromptInput,
  useNodeConnections,
  stripBase64Prefix,
  surface,
  text,
  font,
  sp,
  radius,
} from './shared';

const ACCENT = '#10b981';

const IMAGINATIONS = [
  { value: 'subtle', label: 'Subtle', desc: 'Close to original' },
  { value: 'vivid', label: 'Vivid', desc: 'Balanced creativity' },
  { value: 'wild', label: 'Wild', desc: 'Maximum creativity' },
];

const ASPECT_RATIOS = [
  { value: 'original', label: 'Original' },
  { value: 'square_1_1', label: '1:1' },
  { value: 'classic_4_3', label: '4:3' },
  { value: 'traditional_3_4', label: '3:4' },
  { value: 'widescreen_16_9', label: '16:9' },
  { value: 'social_story_9_16', label: '9:16' },
  { value: 'standard_3_2', label: '3:2' },
  { value: 'portrait_2_3', label: '2:3' },
  { value: 'horizontal_2_1', label: '2:1' },
  { value: 'vertical_1_2', label: '1:2' },
  { value: 'social_post_4_5', label: '4:5' },
];

export default function FluxReimagineNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localImagination = data.localImagination || 'vivid';
  const localAspect = data.localAspect || 'original';

  const image = conn('image-in');
  const prompt = conn('prompt-in');

  const handleReimagine = useCallback(async () => {
    const images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    setIsLoading(true);
    update({ outputImage: null, isLoading: true });

    try {
      const imageBase64 = stripBase64Prefix(images[0]);
      const promptText = resolve.text('prompt-in', data.inputPrompt);

      const params = { image: imageBase64 };
      if (promptText) params.prompt = promptText;

      const imagination = resolve.raw('imagination-in') || localImagination;
      if (imagination) params.imagination = imagination;

      const aspectRatio = resolve.raw('aspect-ratio-in') || localAspect;
      if (aspectRatio && aspectRatio !== 'original') params.aspect_ratio = aspectRatio;

      const result = await reimagineFlux(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      // Synchronous — results come back directly
      const generated = result.data?.generated || result.generated || [];
      update({
        outputImage: generated[0] || null,
        outputImages: generated,
        isLoading: false,
        outputError: null,
      });
    } catch (err) {
      console.error('Reimagine error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, resolve, localImagination, localAspect]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleReimagine();
    }
  }, [data.triggerGenerate, handleReimagine]);

  return (
    <NodeShell label={data.label || 'Flux Reimagine'} dotColor={ACCENT} selected={selected}>

      {/* Image Output Handle (top) */}
      <OutputHandle />

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
          placeholder="Click or drag to upload image"
        />
      </ConnectedOrLocal>

      {/* 2. Prompt */}
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
          placeholder="Optional: guide the reimagination (e.g., 'cyberpunk city at night')"
          rows={2}
        />
      </ConnectedOrLocal>

      {/* 3. Imagination */}
      <SectionHeader
        label="Imagination"
        handleId="imagination-in"
        handleType="target"
        color={getHandleColor('aspect-ratio-in')}
      />
      <div style={{ display: 'flex', gap: sp[3], marginBottom: sp[1] }}>
        {IMAGINATIONS.map((im) => (
          <button key={im.value} onClick={() => update({ localImagination: im.value })} style={{
            flex: 1, padding: `${sp[3]}px ${sp[2]}px`, fontSize: 11, textAlign: 'center',
            borderRadius: radius.lg, border: 'none', cursor: 'pointer',
            background: localImagination === im.value ? 'rgba(16,185,129,0.15)' : surface.sunken,
            borderLeft: localImagination === im.value ? `3px solid ${ACCENT}` : '3px solid transparent',
            transition: 'all 0.15s',
          }}>
            <div style={{ fontWeight: localImagination === im.value ? 600 : 400, color: localImagination === im.value ? text.primary : text.secondary, marginBottom: 2 }}>
              {im.label}
            </div>
            <div style={{ ...font.micro, color: text.muted }}>{im.desc}</div>
          </button>
        ))}
      </div>

      {/* 4. Aspect Ratio */}
      <SectionHeader
        label="Aspect Ratio"
        handleId="aspect-ratio-in"
        handleType="target"
        color={getHandleColor('aspect-ratio-in')}
      />
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: sp[1], marginBottom: sp[1],
        maxHeight: 60, overflowY: 'auto',
      }}>
        {ASPECT_RATIOS.map((a) => (
          <Pill
            key={a.value}
            label={a.label}
            isActive={localAspect === a.value}
            onClick={() => update({ localAspect: a.value })}
            accentColor={ACCENT}
          />
        ))}
      </div>

      {/* 5. Info badge */}
      <div style={{
        background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: radius.lg, padding: `${sp[3]}px ${sp[5]}px`, marginTop: sp[3],
        display: 'flex', alignItems: 'center', gap: sp[3],
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={ACCENT} strokeWidth="1.5" fill="none" />
          <path d="M12 8v4M12 16h.01" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ ...font.caption, color: '#6ee7b7', lineHeight: 1.4 }}>
          Synchronous — reimagined image returns instantly
        </span>
      </div>

      {/* 6. Output */}
      <OutputPreview
        isLoading={isLoading}
        output={data.outputImage}
        error={data.outputError}
        type="image"
        label="Reimagined Output"
        accentColor={ACCENT}
        emptyText="Reimagined image will appear here"
      />

      {/* Secondary output handle */}
      <SecondaryOutputHandle id="prompt-out" />

    </NodeShell>
  );
}
