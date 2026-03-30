import { useCallback, useState, useEffect, useRef } from 'react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { skinEnhancer, pollSkinEnhancerStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import {
  SectionHeader, LinkedBadges, ConnectedOrLocal,
  OutputHandle, OutputPreview, SecondaryOutputHandle,
  Slider, SettingsPanel, Pill,
  useNodeConnections, stripBase64Prefix,
  surface, border, text, sp, radius, font,
} from './shared';

const ACCENT = '#e879f9';

const MODES = [
  { value: 'creative', label: 'Creative', desc: 'Artistic stylized' },
  { value: 'faithful', label: 'Faithful', desc: 'Natural preservation' },
  { value: 'flexible', label: 'Flexible', desc: 'Targeted optimization' },
];

const OPTIMIZED_FOR = [
  { value: 'enhance_skin', label: 'Enhance Skin' },
  { value: 'improve_lighting', label: 'Improve Lighting' },
  { value: 'enhance_everything', label: 'Enhance Everything' },
  { value: 'transform_to_real', label: 'Transform to Real' },
  { value: 'no_make_up', label: 'No Makeup' },
];

export default function SkinEnhancerNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localMode = data.localMode || 'faithful';
  const localSharpen = data.localSharpen ?? 0;
  const localSmartGrain = data.localSmartGrain ?? 2;
  const localSkinDetail = data.localSkinDetail ?? 80;
  const localOptimizedFor = data.localOptimizedFor || 'enhance_skin';

  const imageConn = conn('image-in');

  const handleEnhance = useCallback(async () => {
    const images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    setIsLoading(true);
    update({ outputImage: null, isLoading: true });

    try {
      const params = { image: stripBase64Prefix(images[0]) };
      if (localSharpen !== 0) params.sharpen = localSharpen;
      if (localSmartGrain !== 2) params.smart_grain = localSmartGrain;
      if (localMode === 'faithful' && localSkinDetail !== 80) params.skin_detail = localSkinDetail;
      if (localMode === 'flexible' && localOptimizedFor !== 'enhance_skin') params.optimized_for = localOptimizedFor;

      const result = await skinEnhancer(localMode, params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      if (result.data?.task_id) {
        const status = await pollSkinEnhancerStatus(result.data.task_id);
        const generated = status.data?.generated || [];
        update({ outputImage: generated[0] || null, outputImages: generated, isLoading: false, outputError: null });
      } else if (result.data?.generated?.length) {
        update({ outputImage: result.data.generated[0], outputImages: result.data.generated, isLoading: false, outputError: null });
      } else {
        update({ isLoading: false });
      }
    } catch (err) {
      console.error('Skin enhancer error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, resolve, localMode, localSharpen, localSmartGrain, localSkinDetail, localOptimizedFor]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleEnhance();
    }
  }, [data.triggerGenerate, handleEnhance]);

  return (
    <NodeShell label={data.label || 'Skin Enhancer'} dotColor={ACCENT} selected={selected}>

      {/* 1. Image */}
      <SectionHeader
        label="Image" handleId="image-in" handleType="target"
        color={getHandleColor('image-in')}
        extra={imageConn.connected ? <LinkedBadges nodeId={id} handleId="image-in" onUnlink={data.onUnlink} /> : null}
      />
      <ConnectedOrLocal connected={imageConn.connected} connInfo={imageConn.info}>
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Click or drag to upload portrait image"
        />
      </ConnectedOrLocal>

      {/* 2. Mode Selector */}
      <div style={{ marginTop: sp[4], marginBottom: sp[2] }}>
        <span style={font.label}>Enhancement Mode</span>
      </div>
      <div style={{ display: 'flex', gap: sp[3], marginBottom: sp[1] }}>
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => update({ localMode: m.value })}
            aria-pressed={localMode === m.value}
            style={{
              flex: 1, padding: `${sp[3]}px ${sp[2]}px`, fontSize: 11, textAlign: 'center',
              borderRadius: radius.lg, border: 'none', cursor: 'pointer',
              background: localMode === m.value ? `${ACCENT}26` : surface.sunken,
              borderLeft: localMode === m.value ? `3px solid ${ACCENT}` : '3px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            <div style={{
              fontWeight: localMode === m.value ? 600 : 400,
              color: localMode === m.value ? text.primary : text.secondary,
              marginBottom: 2,
            }}>
              {m.label}
            </div>
            <div style={{ fontSize: 9, color: text.muted }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* 3. Common Controls */}
      <SettingsPanel title="Enhancement Controls">
        <Slider
          label="Sharpen" value={localSharpen}
          onChange={(v) => update({ localSharpen: v })}
          min={0} max={100} accentColor={ACCENT}
        />
        <Slider
          label="Smart Grain" value={localSmartGrain}
          onChange={(v) => update({ localSmartGrain: v })}
          min={0} max={100} accentColor={ACCENT}
        />

        {/* Faithful-only: Skin Detail */}
        {localMode === 'faithful' && (
          <Slider
            label="Skin Detail" value={localSkinDetail}
            onChange={(v) => update({ localSkinDetail: v })}
            min={0} max={100} accentColor={ACCENT}
          />
        )}

        {/* Flexible-only: Optimized For */}
        {localMode === 'flexible' && (
          <>
            <div style={{ ...font.sublabel, marginTop: sp[3], marginBottom: sp[2] }}>
              Optimized For
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: sp[1] }}>
              {OPTIMIZED_FOR.map((o) => (
                <Pill
                  key={o.value}
                  label={o.label}
                  isActive={localOptimizedFor === o.value}
                  onClick={() => update({ localOptimizedFor: o.value })}
                  accentColor={ACCENT}
                />
              ))}
            </div>
          </>
        )}
      </SettingsPanel>

      {/* 4. Output */}
      <OutputPreview
        isLoading={isLoading}
        output={data.outputImage}
        error={data.outputError}
        accentColor={ACCENT}
        label="Enhanced Output"
        emptyText="Enhanced portrait will appear here"
      />

      <SecondaryOutputHandle id="output" />

    </NodeShell>
  );
}
