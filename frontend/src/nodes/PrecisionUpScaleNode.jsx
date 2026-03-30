import { useCallback, useState, useEffect, useRef } from 'react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { upscalePrecision, pollPrecisionStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import {
  SectionHeader,
  LinkedBadges,
  ConnectedOrLocal,
  OutputHandle,
  OutputPreview,
  PillGroup,
  Pill,
  Slider,
  SettingsPanel,
  useNodeConnections,
  stripBase64Prefix,
  surface,
  text,
  font,
  sp,
  radius,
} from './shared';

const ACCENT = '#22c55e';

const SCALE_FACTORS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
const FLAVORS = [
  { value: 'sublime', label: 'Sublime', desc: 'Art & illustrations' },
  { value: 'photo', label: 'Photo', desc: 'Photographs' },
  { value: 'photo_denoiser', label: 'Photo Denoiser', desc: 'Noisy images' },
];

export default function PrecisionUpScaleNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localScale = data.localScaleFactor || '4';
  const localFlavor = data.localFlavor || '';
  const localSharpen = data.localSharpen ?? 7;
  const localSmartGrain = data.localSmartGrain ?? 7;
  const localUltraDetail = data.localUltraDetail ?? 30;

  const image = conn('image-in');

  const handleUpscale = useCallback(async () => {
    const images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    setIsLoading(true);
    update({ outputImage: null, isLoading: true });

    try {
      const imageBase64 = stripBase64Prefix(images[0]);

      const params = { image: imageBase64 };

      const scaleFactor = resolve.raw('scale-factor-in') || localScale;
      if (scaleFactor) params.scale_factor = Number(scaleFactor);

      const sharpen = resolve.raw('sharpen-in') ?? localSharpen;
      if (sharpen !== 7) params.sharpen = sharpen;

      const smartGrain = resolve.raw('smart-grain-in') ?? localSmartGrain;
      if (smartGrain !== 7) params.smart_grain = smartGrain;

      const ultraDetail = resolve.raw('ultra-detail-in') ?? localUltraDetail;
      if (ultraDetail !== 30) params.ultra_detail = ultraDetail;

      const flavor = resolve.raw('flavor-in') || localFlavor;
      if (flavor) params.flavor = flavor;

      const result = await upscalePrecision(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
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
      console.error('Precision upscale error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, resolve, localScale, localFlavor, localSharpen, localSmartGrain, localUltraDetail]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleUpscale();
    }
  }, [data.triggerGenerate, handleUpscale]);

  return (
    <NodeShell label={data.label || 'Precision Upscale'} dotColor={ACCENT} selected={selected}>

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

      {/* 2. Scale Factor */}
      <SectionHeader
        label="Scale Factor"
        handleId="scale-factor-in"
        handleType="target"
        color={getHandleColor('resolution-in')}
      />
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: sp[1], marginBottom: sp[1],
        maxHeight: 60, overflowY: 'auto',
      }}>
        {SCALE_FACTORS.map((s) => (
          <Pill
            key={s}
            label={`${s}x`}
            isActive={localScale === s}
            onClick={() => update({ localScaleFactor: s })}
            accentColor={ACCENT}
          />
        ))}
      </div>

      {/* 3. Flavor */}
      <SectionHeader
        label="Flavor"
        handleId="flavor-in"
        handleType="target"
        color={getHandleColor('aspect-ratio-in')}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: sp[1], marginBottom: sp[1] }}>
        {FLAVORS.map((f) => (
          <button
            key={f.value}
            onClick={() => update({ localFlavor: localFlavor === f.value ? '' : f.value })}
            style={{
              padding: `${sp[3]}px ${sp[5]}px`, fontSize: 11, textAlign: 'left',
              borderRadius: radius.lg, border: 'none', cursor: 'pointer',
              background: localFlavor === f.value ? 'rgba(34,197,94,0.15)' : surface.sunken,
              borderLeft: localFlavor === f.value ? `3px solid ${ACCENT}` : '3px solid transparent',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontWeight: localFlavor === f.value ? 600 : 400, color: localFlavor === f.value ? text.primary : text.secondary }}>
              {f.label}
            </span>
            <span style={{ ...font.caption, color: text.muted }}>{f.desc}</span>
          </button>
        ))}
      </div>

      {/* 4. Enhancement Controls */}
      <SettingsPanel title="Enhancement Controls">
        <Slider
          label="Sharpen"
          value={localSharpen}
          onChange={(v) => update({ localSharpen: v })}
          min={0}
          max={100}
          step={1}
          accentColor={ACCENT}
        />
        <Slider
          label="Smart Grain"
          value={localSmartGrain}
          onChange={(v) => update({ localSmartGrain: v })}
          min={0}
          max={100}
          step={1}
          accentColor={ACCENT}
        />
        <Slider
          label="Ultra Detail"
          value={localUltraDetail}
          onChange={(v) => update({ localUltraDetail: v })}
          min={0}
          max={100}
          step={1}
          accentColor={ACCENT}
        />
      </SettingsPanel>

      {/* 5. Output */}
      <OutputPreview
        isLoading={isLoading}
        output={data.outputImage}
        error={data.outputError}
        type="image"
        label="Upscaled Output"
        accentColor={ACCENT}
        emptyText="Upscaled image will appear here"
      />

    </NodeShell>
  );
}
