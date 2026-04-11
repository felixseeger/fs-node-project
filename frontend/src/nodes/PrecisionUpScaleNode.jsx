import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  Pill,
  Slider,
  OutputHandle,
  OutputPreview,
  useNodeConnections,
  CATEGORY_COLORS,
  getHandleColor,
  sp,
  font,
  text,
  surface,
  border,
  radius,
} from './shared';
import { upscalePrecision, pollPrecisionStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

const SCALE_FACTORS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
const FLAVORS = [
  { value: 'sublime', label: 'Sublime', desc: 'Art & illustrations' },
  { value: 'photo', label: 'Photo', desc: 'Photographs' },
  { value: 'photo_denoiser', label: 'Photo Denoiser', desc: 'Noisy images' },
];

export default function PrecisionUpScaleNode({ id, data, selected }) {
  const { isActive, start, complete, fail } = useNodeProgress();
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localScale = data.localScaleFactor || '4';
  const localFlavor = data.localFlavor || '';
  const localSharpen = data.localSharpen ?? 7;
  const localSmartGrain = data.localSmartGrain ?? 7;
  const localUltraDetail = data.localUltraDetail ?? 30;

  const imageConn = conn('image-in');
  const scaleConn = conn('scale-factor-in');
  const flavorConn = conn('flavor-in');

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

      const params = { image: imageBase64 };

      const scaleFactor = resolve.text('scale-factor-in', localScale);
      if (scaleFactor) params.scale_factor = Number(scaleFactor);

      const sharpen = data.resolveInput?.(id, 'sharpen-in') ?? localSharpen;
      if (sharpen !== 7) params.sharpen = sharpen;

      const smartGrain = data.resolveInput?.(id, 'smart-grain-in') ?? localSmartGrain;
      if (smartGrain !== 7) params.smart_grain = smartGrain;

      const ultraDetail = data.resolveInput?.(id, 'ultra-detail-in') ?? localUltraDetail;
      if (ultraDetail !== 30) params.ultra_detail = ultraDetail;

      const flavor = resolve.text('flavor-in', localFlavor);
      if (flavor) params.flavor = flavor;

      const result = await upscalePrecision(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail(result.error?.message || 'Upscaling failed');
        return;
      }

      if (result.data?.task_id) {
        const status = await pollPrecisionStatus(result.data.task_id);
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
        fail('No output generated');
      }
    } catch (err) {
      console.error('Precision upscale error:', err);
      update({ isLoading: false, outputError: err.message });
      fail(err.message);
    }
  }, [id, data, update, localScale, localFlavor, localSharpen, localSmartGrain, localUltraDetail, start, complete, fail, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleUpscale();
    }
  }, [data.triggerGenerate, handleUpscale]);

  const ACCENT = '#22c55e';

  return (
    <NodeShell data={data}
      label={data.label || 'Precision Upscale'}
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

      {/* ── 2. Scale Factor ── */}
      <SectionHeader 
        label="Scale Factor" 
        handleId="scale-factor-in" 
        handleType="target" 
        color={getHandleColor('resolution-in')}
        isConnected={scaleConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'scale-factor-in')}
      />
      <ConnectedOrLocal connected={scaleConn.connected} connInfo={scaleConn.info}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4,
          maxHeight: 60, overflowY: 'auto',
        }}>
          {SCALE_FACTORS.map((s) => (
            <Pill key={s} label={`${s}x`} isActive={localScale === s} onClick={() => update({ localScaleFactor: s })} accentColor={ACCENT} />
          ))}
        </div>
      </ConnectedOrLocal>

      {/* ── 3. Flavor ── */}
      <SectionHeader 
        label="Flavor" 
        handleId="flavor-in" 
        handleType="target" 
        color={getHandleColor('aspect-ratio-in')}
        isConnected={flavorConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'flavor-in')}
      />
      <ConnectedOrLocal connected={flavorConn.connected} connInfo={flavorConn.info}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 4 }}>
          {FLAVORS.map((f) => (
            <button
              key={f.value}
              className="nodrag nopan"
              onClick={() => update({ localFlavor: localFlavor === f.value ? '' : f.value })}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                padding: '8px 12px', fontSize: 11, textAlign: 'left',
                borderRadius: 8, border: 'none', cursor: 'pointer',
                background: localFlavor === f.value ? 'rgba(34,197,94,0.15)' : '#1a1a1a',
                borderLeft: localFlavor === f.value ? `3px solid ${ACCENT}` : '3px solid transparent',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontWeight: localFlavor === f.value ? 600 : 400, color: localFlavor === f.value ? '#e0e0e0' : '#999' }}>
                {f.label}
              </span>
              <span style={{ fontSize: 10, color: '#666' }}>{f.desc}</span>
            </button>
          ))}
        </div>
      </ConnectedOrLocal>

      {/* ── 4. Enhancement Controls ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.08)', padding: 10, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 8 }}>
          Enhancement Controls
        </div>
        <Slider label="Sharpen" value={localSharpen} onChange={(v) => update({ localSharpen: v })} min={0} max={100} accentColor={ACCENT} />
        <Slider label="Smart Grain" value={localSmartGrain} onChange={(v) => update({ localSmartGrain: v })} min={0} max={100} accentColor={ACCENT} />
        <Slider label="Ultra Detail" value={localUltraDetail} onChange={(v) => update({ localUltraDetail: v })} min={0} max={100} accentColor={ACCENT} />
      </div>

      <NodeProgress isActive={isActive} />

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
