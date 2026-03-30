import { useCallback, useState, useEffect, useRef } from 'react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { changeCamera, pollChangeCameraStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import {
  SectionHeader, LinkedBadges, ConnectedOrLocal,
  OutputHandle, OutputPreview,
  Slider, SettingsPanel, TextInput,
  useNodeConnections, stripBase64Prefix,
  CATEGORY_COLORS, surface, border, text, sp, radius, font,
} from './shared';

const ACCENT = '#f59e0b'; // amber for camera

const HORIZONTAL_PRESETS = [
  { label: 'Front', value: 0 },
  { label: 'Right', value: 90 },
  { label: 'Back', value: 180 },
  { label: 'Left', value: 270 },
];

const VERTICAL_PRESETS = [
  { label: 'Look Up', value: -30 },
  { label: 'Eye Level', value: 0 },
  { label: '45\u00b0', value: 45 },
  { label: "Bird's Eye", value: 90 },
];

const COMPASS_LABELS = [
  { deg: 0, label: 'F' },
  { deg: 90, label: 'R' },
  { deg: 180, label: 'B' },
  { deg: 270, label: 'L' },
];

export default function ChangeCameraNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localHorizontal = data.localHorizontalAngle ?? 0;
  const localVertical = data.localVerticalAngle ?? 0;
  const localZoom = data.localZoom ?? 5;
  const localSeed = data.localSeed ?? '';

  const imageConn = conn('image-in');

  const handleTransform = useCallback(async () => {
    const images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    setIsLoading(true);
    update({ outputImage: null, isLoading: true });

    try {
      const params = {
        image: stripBase64Prefix(images[0]),
        horizontal_angle: localHorizontal,
        vertical_angle: localVertical,
        zoom: localZoom,
      };
      if (localSeed !== '' && localSeed !== undefined && localSeed !== null) {
        params.seed = Number(localSeed);
      }

      const result = await changeCamera(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      if (result.data?.task_id) {
        const status = await pollChangeCameraStatus(result.data.task_id);
        const generated = status.data?.generated || [];
        update({ outputImage: generated[0] || null, outputImages: generated, isLoading: false, outputError: null });
      } else if (result.data?.generated?.length) {
        update({ outputImage: result.data.generated[0], outputImages: result.data.generated, isLoading: false, outputError: null });
      } else {
        update({ isLoading: false });
      }
    } catch (err) {
      console.error('Change camera error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, resolve, localHorizontal, localVertical, localZoom, localSeed]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleTransform();
    }
  }, [data.triggerGenerate, handleTransform]);

  // ── Preset button row ──
  const presetRow = (presets, currentValue, dataKey) => (
    <div style={{ display: 'flex', gap: sp[1], marginTop: sp[1] }}>
      {presets.map((p) => (
        <button
          key={p.label}
          onClick={() => update({ [dataKey]: p.value })}
          aria-pressed={currentValue === p.value}
          style={{
            flex: 1, padding: '3px 0', fontSize: 9,
            fontWeight: currentValue === p.value ? 600 : 400,
            borderRadius: radius.pill, border: 'none', cursor: 'pointer',
            background: currentValue === p.value ? `${ACCENT}26` : surface.deep,
            color: currentValue === p.value ? ACCENT : text.muted,
            transition: 'all 0.12s',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );

  // ── Render ──

  return (
    <NodeShell label={data.label || 'Change Camera'} dotColor={ACCENT} selected={selected}>

      <OutputHandle />

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
          placeholder="Click or drag to upload image"
        />
      </ConnectedOrLocal>

      {/* 2. Camera Controls */}
      <SettingsPanel title="Camera Controls">

        {/* Compass visual */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: sp[5] }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            border: `2px solid ${border.subtle}`, position: 'relative',
            background: surface.deep,
          }}>
            {COMPASS_LABELS.map((cl) => {
              const rad = (cl.deg - 90) * (Math.PI / 180);
              const cx = 50 + 38 * Math.cos(rad);
              const cy = 50 + 38 * Math.sin(rad);
              const isNear = Math.abs(localHorizontal - cl.deg) < 23 || Math.abs(localHorizontal - cl.deg) > 337;
              return (
                <span key={cl.label} style={{
                  position: 'absolute', left: cx - 6, top: cy - 6,
                  width: 12, height: 12, fontSize: 8, fontWeight: 600,
                  color: isNear ? ACCENT : text.muted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{cl.label}</span>
              );
            })}
            {(() => {
              const rad = (localHorizontal - 90) * (Math.PI / 180);
              return (
                <div style={{
                  position: 'absolute',
                  left: 50 + 26 * Math.cos(rad) - 5,
                  top: 50 + 26 * Math.sin(rad) - 5,
                  width: 10, height: 10, borderRadius: '50%',
                  background: ACCENT, boxShadow: `0 0 6px ${ACCENT}`,
                }} />
              );
            })()}
            <div style={{
              position: 'absolute', left: 46, top: 46,
              width: 8, height: 8, borderRadius: '50%', background: text.muted,
            }} />
            <div style={{
              position: 'absolute', bottom: -18, left: 0, right: 0,
              textAlign: 'center', fontSize: 10, color: ACCENT, fontWeight: 600,
            }}>{localHorizontal}\u00b0</div>
          </div>
        </div>

        {/* Horizontal Angle */}
        <Slider
          label="Horizontal Rotation" value={localHorizontal}
          onChange={(v) => update({ localHorizontalAngle: v })}
          min={0} max={360} unit="\u00b0" accentColor={ACCENT}
        />
        {presetRow(HORIZONTAL_PRESETS, localHorizontal, 'localHorizontalAngle')}

        <div style={{ height: sp[3] }} />

        {/* Vertical Angle */}
        <Slider
          label="Vertical Tilt" value={localVertical}
          onChange={(v) => update({ localVerticalAngle: v })}
          min={-30} max={90} unit="\u00b0" accentColor={ACCENT}
        />
        {presetRow(VERTICAL_PRESETS, localVertical, 'localVerticalAngle')}

        <div style={{ height: sp[3] }} />

        {/* Zoom */}
        <Slider
          label="Zoom" value={localZoom}
          onChange={(v) => update({ localZoom: v })}
          min={0} max={10} accentColor={ACCENT}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, padding: '0 22px' }}>
          <span style={{ fontSize: 8, color: text.muted }}>Wide</span>
          <span style={{ fontSize: 8, color: text.muted }}>Medium</span>
          <span style={{ fontSize: 8, color: text.muted }}>Close-up</span>
        </div>

        {/* Camera summary */}
        <div style={{ display: 'flex', gap: sp[2], marginTop: sp[4] }}>
          {[
            { label: 'H-Angle', val: `${localHorizontal}\u00b0` },
            { label: 'V-Tilt', val: `${localVertical}\u00b0` },
            { label: 'Zoom', val: localZoom },
          ].map((s) => (
            <div key={s.label} style={{
              flex: 1, padding: `${sp[2]}px ${sp[3]}px`,
              background: surface.deep, borderRadius: radius.md, textAlign: 'center',
            }}>
              <div style={{ fontSize: 8, color: text.muted, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: ACCENT, fontWeight: 600 }}>{s.val}</div>
            </div>
          ))}
        </div>
      </SettingsPanel>

      {/* 3. Seed */}
      <div style={{ marginTop: sp[4], marginBottom: sp[2] }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: sp[1] }}>
          <span style={font.sublabel}>Seed (optional)</span>
          {localSeed !== '' && (
            <button
              onClick={() => update({ localSeed: '' })}
              aria-label="Clear seed"
              style={{ fontSize: 9, color: text.secondary, background: 'transparent', border: 'none', cursor: 'pointer' }}
            >clear</button>
          )}
        </div>
        <TextInput
          value={localSeed}
          onChange={(v) => update({ localSeed: v })}
          placeholder="Random if empty (1-2147483647)"
          type="number"
        />
      </div>

      {/* 4. Output */}
      <OutputPreview
        isLoading={isLoading}
        output={data.outputImage}
        error={data.outputError}
        accentColor={ACCENT}
        label="Transformed Output"
        emptyText="Transformed image will appear here"
      />

    </NodeShell>
  );
}
