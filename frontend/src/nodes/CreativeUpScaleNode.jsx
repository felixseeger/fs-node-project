import { useCallback, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  PromptInput,
  Pill,
  Slider,
  OutputHandle,
  OutputPreview,
  useNodeConnections,
  getHandleColor,
} from './shared';
import { upscaleCreative, pollUpscaleStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

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
  const { isActive, start, complete, fail } = useNodeProgress(id, data);
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localScale = data.localScaleFactor || '2x';
  const localOptimized = data.localOptimizedFor || 'standard';
  const localEngine = data.localEngine || 'automatic';
  const localCreativity = data.localCreativity ?? 0;
  const localHdr = data.localHdr ?? 0;
  const localResemblance = data.localResemblance ?? 0;
  const localFractality = data.localFractality ?? 0;

  const imageConn = conn('image-in');
  const promptConn = conn('prompt-in');
  const scaleConn = conn('scale-factor-in');
  const optimizedConn = conn('optimized-for-in');
  const engineConn = conn('engine-in');

  const handleUpscale = useCallback(async () => {
    let images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    start();
    update({ outputImage: null, isLoading: true });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) {
        imageBase64 = imageBase64.split(',')[1];
      }

      const prompt = resolve.text('prompt-in', data.inputPrompt);

      const params = { image: imageBase64 };

      const scaleFactor = resolve.text('scale-factor-in', localScale);
      if (scaleFactor) params.scale_factor = scaleFactor;

      const optimized = resolve.text('optimized-for-in', localOptimized);
      if (optimized) params.optimized_for = optimized;

      if (prompt) params.prompt = prompt;

      const creativity = data.resolveInput?.(id, 'creativity-in') ?? localCreativity;
      if (creativity !== 0) params.creativity = creativity;

      const hdrVal = data.resolveInput?.(id, 'hdr-in') ?? localHdr;
      if (hdrVal !== 0) params.hdr = hdrVal;

      const resemblance = data.resolveInput?.(id, 'resemblance-in') ?? localResemblance;
      if (resemblance !== 0) params.resemblance = resemblance;

      const freactality = data.resolveInput?.(id, 'fractality-in') ?? localFractality;
      if (freactality !== 0) params.fractality = freactality;

      const engine = resolve.text('engine-in', localEngine);
      if (engine) params.engine = engine;

      const result = await upscaleCreative(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail();
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
      console.error('Upscale error:', err);
      update({ isLoading: false, outputError: err.message });
      fail();
    }
  }, [id, data, update, localScale, localOptimized, localEngine, localCreativity, localHdr, localResemblance, localFractality, start, complete, fail, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleUpscale();
    }
  }, [data.triggerGenerate, handleUpscale]);

  const ACCENT = '#8b5cf6';

  return (
    <NodeShell data={data}
      label={data.label || 'Creative Upscale'}
      dotColor={ACCENT}
      selected={selected}
      onGenerate={handleUpscale}
      isGenerating={isActive}
    >
      <OutputHandle id="output" label="image" color={getHandleColor('output')} />

      {/* ── 1. Image Section ── */}
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

      {/* ── 2. Prompt Section ── */}
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
          placeholder="Guide the upscale (e.g., sharp details, vibrant colors)..."
        />
      </ConnectedOrLocal>

      {/* ── 3. Scale Factor ── */}
      <SectionHeader 
        label="Scale Factor" 
        handleId="scale-factor-in" 
        handleType="target" 
        color={getHandleColor('aspect-ratio-in')}
        isConnected={scaleConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'scale-factor-in')}
      />
      <ConnectedOrLocal connected={scaleConn.connected} connInfo={scaleConn.info}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
          {SCALE_FACTORS.map((s) => (
            <Pill key={s} label={s} isActive={localScale === s} onClick={() => update({ localScaleFactor: s })} accentColor={ACCENT} />
          ))}
        </div>
      </ConnectedOrLocal>

      {/* ── 4. Optimized For ── */}
      <SectionHeader 
        label="Optimized For" 
        handleId="optimized-for-in" 
        handleType="target" 
        color={getHandleColor('aspect-ratio-in')}
        isConnected={optimizedConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'optimized-for-in')}
      />
      <ConnectedOrLocal connected={optimizedConn.connected} connInfo={optimizedConn.info}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 4 }}>
          {OPTIMIZED_OPTIONS.map((o) => (
            <Pill key={o.value} label={o.label} isActive={localOptimized === o.value} onClick={() => update({ localOptimizedFor: o.value })} accentColor={ACCENT} />
          ))}
        </div>
      </ConnectedOrLocal>

      {/* ── 5. Engine ── */}
      <SectionHeader 
        label="Engine" 
        handleId="engine-in" 
        handleType="target" 
        color={getHandleColor('aspect-ratio-in')}
        isConnected={engineConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'engine-in')}
      />
      <ConnectedOrLocal connected={engineConn.connected} connInfo={engineConn.info}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
          {ENGINES.map((e) => (
            <Pill key={e.value} label={e.label} isActive={localEngine === e.value} onClick={() => update({ localEngine: e.value })} accentColor={ACCENT} />
          ))}
        </div>
      </ConnectedOrLocal>

      {/* ── 6. Creativity / HDR / Resemblance / Fractality Sliders ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.08)', padding: 10, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 8 }}>
          Creative Controls
        </div>
        <Slider label="Creativity" value={localCreativity} onChange={(v) => update({ localCreativity: v })} min={-10} max={10} accentColor={ACCENT} />
        <Slider label="HDR" value={localHdr} onChange={(v) => update({ localHdr: v })} min={-10} max={10} accentColor={ACCENT} />
        <Slider label="Resemblance" value={localResemblance} onChange={(v) => update({ localResemblance: v })} min={-10} max={10} accentColor={ACCENT} />
        <Slider label="Fractality" value={localFractality} onChange={(v) => update({ localFractality: v })} min={-10} max={10} accentColor={ACCENT} />
      </div>

      <NodeProgress nodeId={id} />

      <OutputPreview
        isLoading={isActive}
        output={data.outputImage}
        error={data.outputError}
        accentColor={ACCENT}
        label="Upscaled Output"
      />
    </NodeShell>
  );
}
