import { useCallback, useState, useEffect, useRef } from 'react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { upscaleCreative, pollUpscaleStatus } from '../utils/api';
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
  Slider,
  PromptInput,
  SettingsPanel,
  useNodeConnections,
  stripBase64Prefix,
  surface,
  text,
  font,
  sp,
  radius,
} from './shared';

const ACCENT = '#8b5cf6';

const SCALE_FACTORS = [
  { value: '2x', label: '2x' },
  { value: '4x', label: '4x' },
  { value: '8x', label: '8x' },
  { value: '16x', label: '16x' },
];

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
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localScale = data.localScaleFactor || '2x';
  const localOptimized = data.localOptimizedFor || 'standard';
  const localEngine = data.localEngine || 'automatic';
  const localCreativity = data.localCreativity ?? 0;
  const localHdr = data.localHdr ?? 0;
  const localResemblance = data.localResemblance ?? 0;
  const localFractality = data.localFractality ?? 0;

  const image = conn('image-in');
  const prompt = conn('prompt-in');

  const handleUpscale = useCallback(async () => {
    const images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    setIsLoading(true);
    update({ outputImage: null, isLoading: true });

    try {
      const imageBase64 = stripBase64Prefix(images[0]);
      const promptText = resolve.text('prompt-in', data.inputPrompt);

      const params = { image: imageBase64 };

      const scaleFactor = resolve.raw('scale-factor-in') || localScale;
      if (scaleFactor) params.scale_factor = scaleFactor;

      const optimized = resolve.raw('optimized-for-in') || localOptimized;
      if (optimized) params.optimized_for = optimized;

      if (promptText) params.prompt = promptText;

      const creativity = resolve.raw('creativity-in') ?? localCreativity;
      if (creativity !== 0) params.creativity = creativity;

      const hdrVal = resolve.raw('hdr-in') ?? localHdr;
      if (hdrVal !== 0) params.hdr = hdrVal;

      const resemblance = resolve.raw('resemblance-in') ?? localResemblance;
      if (resemblance !== 0) params.resemblance = resemblance;

      const fractality = resolve.raw('fractality-in') ?? localFractality;
      if (fractality !== 0) params.fractality = fractality;

      const engine = resolve.raw('engine-in') || localEngine;
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
  }, [id, data, update, resolve, localScale, localOptimized, localEngine, localCreativity, localHdr, localResemblance, localFractality]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleUpscale();
    }
  }, [data.triggerGenerate, handleUpscale]);

  return (
    <NodeShell label={data.label || 'Creative Upscale'} dotColor={ACCENT} selected={selected}>

      {/* Image Output Handle (top) */}
      <OutputHandle />

      {/* 1. Image Section */}
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

      {/* 2. Prompt Section */}
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
          placeholder="Guide the upscale (e.g., sharp details, vibrant colors)..."
          rows={2}
        />
      </ConnectedOrLocal>

      {/* 3. Scale Factor */}
      <SectionHeader
        label="Scale Factor"
        handleId="scale-factor-in"
        handleType="target"
        color={getHandleColor('aspect-ratio-in')}
      />
      <PillGroup
        options={SCALE_FACTORS}
        value={localScale}
        onChange={(v) => update({ localScaleFactor: v })}
        accentColor={ACCENT}
      />

      {/* 4. Optimized For */}
      <SectionHeader
        label="Optimized For"
        handleId="optimized-for-in"
        handleType="target"
        color={getHandleColor('aspect-ratio-in')}
      />
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: sp[1], marginBottom: sp[1],
      }}>
        {OPTIMIZED_OPTIONS.map((o) => (
          <Pill
            key={o.value}
            label={o.label}
            isActive={localOptimized === o.value}
            onClick={() => update({ localOptimizedFor: o.value })}
            accentColor={ACCENT}
          />
        ))}
      </div>

      {/* 5. Engine */}
      <SectionHeader
        label="Engine"
        handleId="engine-in"
        handleType="target"
        color={getHandleColor('aspect-ratio-in')}
      />
      <PillGroup
        options={ENGINES}
        value={localEngine}
        onChange={(v) => update({ localEngine: v })}
        accentColor={ACCENT}
      />

      {/* 6. Creative Controls */}
      <SettingsPanel title="Creative Controls">
        <Slider
          label="Creativity"
          value={localCreativity}
          onChange={(v) => update({ localCreativity: v })}
          min={-10}
          max={10}
          step={1}
          accentColor={ACCENT}
        />
        <Slider
          label="HDR"
          value={localHdr}
          onChange={(v) => update({ localHdr: v })}
          min={-10}
          max={10}
          step={1}
          accentColor={ACCENT}
        />
        <Slider
          label="Resemblance"
          value={localResemblance}
          onChange={(v) => update({ localResemblance: v })}
          min={-10}
          max={10}
          step={1}
          accentColor={ACCENT}
        />
        <Slider
          label="Fractality"
          value={localFractality}
          onChange={(v) => update({ localFractality: v })}
          min={-10}
          max={10}
          step={1}
          accentColor={ACCENT}
        />
      </SettingsPanel>

      {/* 7. Output */}
      <OutputPreview
        isLoading={isLoading}
        output={data.outputImage}
        error={data.outputError}
        type="image"
        label="Upscaled Output"
        accentColor={ACCENT}
        emptyText="Upscaled image will appear here"
      />

      {/* Secondary output handle */}
      <SecondaryOutputHandle id="prompt-out" />

    </NodeShell>
  );
}
