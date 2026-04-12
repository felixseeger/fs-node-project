import { useCallback } from 'react';
import NodeShell from './NodeShell';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';
import { imageExpandFluxPro, pollImageExpandStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import {
  // Tokens
  CATEGORY_COLORS, surface, border, text, sp, radius, font, summaryRowStyle,
  // Section & connection
  SectionHeader, LinkedBadges, ConnectedOrLocal,
  // Controls
  DirectionSlider, PromptInput,
  // Output
  OutputHandle, SecondaryOutputHandle, OutputPreview,
  // Hooks
  useNodeConnections, useNodeExecution,
  stripBase64Prefix,
} from './shared';
import { getHandleColor } from '../utils/handleTypes';

const ACCENT = CATEGORY_COLORS.imageEditing; // #f97316

const PRESETS = [
  { label: 'Widen', left: 256, right: 256, top: 0, bottom: 0 },
  { label: 'Extend Top', left: 0, right: 0, top: 512, bottom: 0 },
  { label: 'Extend Bottom', left: 0, right: 0, top: 0, bottom: 512 },
  { label: 'Equal All', left: 128, right: 128, top: 128, bottom: 128 },
  { label: 'Banner', left: 512, right: 512, top: 0, bottom: 0 },
  { label: 'Reset', left: 0, right: 0, top: 0, bottom: 0 },
];

export default function FluxImageExpandNode({ id, data, selected }) {
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);

  const localLeft = data.localLeft ?? 0;
  const localRight = data.localRight ?? 0;
  const localTop = data.localTop ?? 0;
  const localBottom = data.localBottom ?? 0;

  const imageConn = conn('image-in');
  const promptConn = conn('prompt-in');

  const { isActive, start, complete, fail } = useNodeProgress();

  const handleExpand = useCallback(async () => {
    let images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    update({ outputImage: null });
    start();

    try {
      const imageBase64 = stripBase64Prefix(images[0]);
      const prompt = resolve.text('prompt-in', data.inputPrompt);

      const params = { image: imageBase64 };
      if (prompt) params.prompt = prompt;
      if (localLeft > 0) params.left = localLeft;
      if (localRight > 0) params.right = localRight;
      if (localTop > 0) params.top = localTop;
      if (localBottom > 0) params.bottom = localBottom;

      const result = await imageExpandFluxPro(params);

      if (result.error) {
        fail(result.error?.message || JSON.stringify(result.error));
        update({ outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      if (result.data?.task_id) {
        const status = await pollImageExpandStatus(result.data.task_id);
        const generated = status.data?.generated || [];
        complete();
        update({
          outputImage: generated[0] || null,
          outputImages: generated,
          outputError: null,
        });
      } else if (result.data?.generated?.length) {
        complete();
        update({
          outputImage: result.data.generated[0],
          outputImages: result.data.generated,
          outputError: null,
        });
      } else {
        complete();
      }
    } catch (err) {
      console.error('Image expand error:', err);
      fail(err.message);
      update({ outputError: err.message });
    }
  }, [data, update, resolve, localLeft, localRight, localTop, localBottom, start, complete, fail]);

  useNodeExecution(data, handleExpand);

  return (
    <NodeShell data={data}
      label={data.label || 'Flux Image Expand'}
      dotColor={ACCENT}
      selected={selected}
      onGenerate={handleExpand}
      isGenerating={isActive} onDisconnect={disconnectNode}
    >

      {/* ── Image Output Handle (top) ── */}
      <OutputHandle id="output" label="image" type="image" />

      {/* ── 1. Image ── */}
      <SectionHeader
        label="Image"
        handleId="image-in"
        handleType="target"
        color={getHandleColor('image-in')}
        extra={imageConn.connected
          ? <LinkedBadges nodeId={id} handleId="image-in" onUnlink={data.onUnlink} />
          : null}
      />
      <ConnectedOrLocal connected={imageConn.connected} connInfo={imageConn.info}>
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Click or drag to upload image"
        />
      </ConnectedOrLocal>

      {/* ── 2. Prompt ── */}
      <SectionHeader
        label="Prompt"
        handleId="prompt-in"
        handleType="target"
        color={getHandleColor('prompt-in')}
        extra={
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <AutoPromptButton id={id} data={data} update={update} imageKey="image-in" localImageKey="localImage" />
            <ImprovePromptButton id={id} data={data} update={update} type="image" />
            {promptConn.connected ? <LinkedBadges nodeId={id} handleId="prompt-in" onUnlink={data.onUnlink} /> : null}
          </div>
        }
      />
      <ConnectedOrLocal connected={promptConn.connected} connInfo={promptConn.info}>
        <PromptInput
          value={data.inputPrompt}
          onChange={(v) => update({ inputPrompt: v })}
          placeholder='Optional: guide expanded content (e.g., "sunset sky", "forest")'
          rows={2}
        />
      </ConnectedOrLocal>

      {/* ── 3. Expansion Presets ── */}
      <div style={{ marginTop: sp[4], marginBottom: sp[2] }}>
        <span style={font.sublabel}>Presets</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: sp[1], marginBottom: sp[1] }}>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => update({ localLeft: p.left, localRight: p.right, localTop: p.top, localBottom: p.bottom })}
            style={{
              padding: `${sp[1]}px ${sp[4]}px`, fontSize: 10, fontWeight: 400,
              borderRadius: radius.pill, border: 'none', cursor: 'pointer',
              background: surface.sunken, color: text.secondary,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ── 4. Directional Controls ── */}
      <div style={{
        background: surface.sunken, borderRadius: radius.lg, border: `1px solid ${border.subtle}`,
        padding: sp[5], marginTop: sp[2],
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: text.primary, marginBottom: sp[4], textAlign: 'center' }}>
          Expansion Pixels (0-2048)
        </div>

        {/* Visual direction indicator (unique to this node) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 40px',
          gridTemplateRows: 'auto auto auto',
          gap: 2, alignItems: 'center', marginBottom: sp[3],
        }}>
          <div />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: localTop > 0 ? ACCENT : text.muted }}>
              &#9650; Top: {localTop}
            </span>
          </div>
          <div />

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 10, color: localLeft > 0 ? ACCENT : text.muted }}>
              &#9664; {localLeft}
            </span>
          </div>
          <div style={{
            background: surface.deep, borderRadius: radius.sm, border: `1px solid ${border.subtle}`,
            padding: `${sp[3]}px ${sp[1]}px`, textAlign: 'center',
          }}>
            <span style={{ fontSize: 10, color: text.muted }}>Original</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: 10, color: localRight > 0 ? ACCENT : text.muted }}>
              {localRight} &#9654;
            </span>
          </div>

          <div />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: localBottom > 0 ? ACCENT : text.muted }}>
              &#9660; Bottom: {localBottom}
            </span>
          </div>
          <div />
        </div>

        {/* Sliders */}
        <DirectionSlider label="Left" value={localLeft} onChange={(v) => update({ localLeft: v })} accentColor={ACCENT} />
        <DirectionSlider label="Right" value={localRight} onChange={(v) => update({ localRight: v })} accentColor={ACCENT} />
        <DirectionSlider label="Top" value={localTop} onChange={(v) => update({ localTop: v })} accentColor={ACCENT} />
        <DirectionSlider label="Bottom" value={localBottom} onChange={(v) => update({ localBottom: v })} accentColor={ACCENT} />

        {/* Total expansion summary */}
        <div style={{ ...summaryRowStyle, marginTop: sp[3] }}>
          <span style={{ fontSize: 10, color: text.muted }}>Total width added:</span>
          <span style={{ fontSize: 10, color: ACCENT, fontWeight: 600 }}>{localLeft + localRight}px</span>
        </div>
        <div style={{ ...summaryRowStyle, marginTop: 2 }}>
          <span style={{ fontSize: 10, color: text.muted }}>Total height added:</span>
          <span style={{ fontSize: 10, color: ACCENT, fontWeight: 600 }}>{localTop + localBottom}px</span>
        </div>
      </div>

      {/* ── 5. Progress ── */}
      <NodeProgress isActive={isActive} />

      {/* ── 6. Output ── */}
      <OutputPreview
        isActive={isActive}
        output={data.outputImage}
        error={data.outputError}
        accentColor="#ec4899"
        label="Expanded Output"
        emptyText="Expanded image will appear here"
      />

      {/* ── Secondary output handle ── */}
      <SecondaryOutputHandle id="prompt-out" />
    </NodeShell>
  );
}
