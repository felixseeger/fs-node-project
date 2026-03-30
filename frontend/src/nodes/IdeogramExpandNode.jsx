import { useCallback, useState, useEffect, useRef } from 'react';
import NodeShell from './NodeShell';
import { ideogramExpand, pollIdeogramExpandStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import {
  surface, border, text, sp, radius, font, summaryRowStyle,
  SectionHeader, LinkedBadges, ConnectedOrLocal,
  OutputHandle, OutputPreview, SecondaryOutputHandle,
  DirectionSlider, PromptInput, TextInput,
  SettingsPanel,
  useNodeConnections, stripBase64Prefix,
} from './shared';
import { getHandleColor } from '../utils/handleTypes';

const ACCENT = '#14b8a6';

const PRESETS = [
  { label: 'Widen', left: 256, right: 256, top: 0, bottom: 0 },
  { label: 'Extend Top', left: 0, right: 0, top: 512, bottom: 0 },
  { label: 'Extend Bottom', left: 0, right: 0, top: 0, bottom: 512 },
  { label: 'Equal All', left: 128, right: 128, top: 128, bottom: 128 },
  { label: 'Banner', left: 512, right: 512, top: 0, bottom: 0 },
  { label: 'Reset', left: 0, right: 0, top: 0, bottom: 0 },
];

export default function IdeogramExpandNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localLeft = data.localLeft ?? 0;
  const localRight = data.localRight ?? 0;
  const localTop = data.localTop ?? 0;
  const localBottom = data.localBottom ?? 0;
  const localSeed = data.localSeed ?? '';

  const imageConn = conn('image-in');
  const promptConn = conn('prompt-in');

  const handleExpand = useCallback(async () => {
    const images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    setIsLoading(true);
    update({ outputImage: null, isLoading: true });

    try {
      const prompt = resolve.text('prompt-in', data.inputPrompt);
      const params = {
        image: stripBase64Prefix(images[0]),
        left: localLeft, right: localRight, top: localTop, bottom: localBottom,
      };
      if (prompt) params.prompt = prompt;
      if (localSeed !== '' && localSeed !== undefined && localSeed !== null) {
        params.seed = Number(localSeed);
      }

      const result = await ideogramExpand(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      if (result.data?.task_id) {
        const status = await pollIdeogramExpandStatus(result.data.task_id);
        const generated = status.data?.generated || [];
        update({ outputImage: generated[0] || null, outputImages: generated, isLoading: false, outputError: null });
      } else if (result.data?.generated?.length) {
        update({ outputImage: result.data.generated[0], outputImages: result.data.generated, isLoading: false, outputError: null });
      } else {
        update({ isLoading: false });
      }
    } catch (err) {
      console.error('Ideogram expand error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, resolve, localLeft, localRight, localTop, localBottom, localSeed]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleExpand();
    }
  }, [data.triggerGenerate, handleExpand]);

  return (
    <NodeShell label={data.label || 'Ideogram Expand'} dotColor={ACCENT} selected={selected}>

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

      {/* 2. Prompt */}
      <SectionHeader
        label="Prompt" handleId="prompt-in" handleType="target"
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
          placeholder='Optional: guide content (auto-generated if empty)'
          rows={2}
        />
      </ConnectedOrLocal>

      {/* 3. Presets */}
      <div style={{ marginTop: sp[4], marginBottom: sp[2] }}>
        <span style={font.sublabel}>Presets</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: sp[1], marginBottom: sp[1] }}>
        {PRESETS.map((p) => (
          <button key={p.label}
            onClick={() => update({ localLeft: p.left, localRight: p.right, localTop: p.top, localBottom: p.bottom })}
            style={{
              padding: `${sp[1]}px ${sp[4]}px`, fontSize: 10, fontWeight: 400,
              borderRadius: radius.pill, border: 'none', cursor: 'pointer',
              background: surface.sunken, color: text.secondary,
            }}
          >{p.label}</button>
        ))}
      </div>

      {/* 4. Directional Controls */}
      <SettingsPanel title="Expansion Pixels (0\u20132048)">
        <div style={{
          display: 'grid', gridTemplateColumns: '40px 1fr 40px',
          gridTemplateRows: 'auto auto auto',
          gap: 2, alignItems: 'center', marginBottom: sp[3],
        }}>
          <div />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: localTop > 0 ? ACCENT : text.muted }}>\u25b2 Top: {localTop}</span>
          </div>
          <div />
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 10, color: localLeft > 0 ? ACCENT : text.muted }}>\u25c0 {localLeft}</span>
          </div>
          <div style={{
            background: surface.deep, borderRadius: radius.sm, border: `1px solid ${border.subtle}`,
            padding: `${sp[3]}px ${sp[1]}px`, textAlign: 'center',
          }}>
            <span style={{ fontSize: 10, color: text.muted }}>Original</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: 10, color: localRight > 0 ? ACCENT : text.muted }}>{localRight} \u25b6</span>
          </div>
          <div />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: localBottom > 0 ? ACCENT : text.muted }}>\u25bc Bottom: {localBottom}</span>
          </div>
          <div />
        </div>

        <DirectionSlider label="Left" value={localLeft} onChange={(v) => update({ localLeft: v })} accentColor={ACCENT} />
        <DirectionSlider label="Right" value={localRight} onChange={(v) => update({ localRight: v })} accentColor={ACCENT} />
        <DirectionSlider label="Top" value={localTop} onChange={(v) => update({ localTop: v })} accentColor={ACCENT} />
        <DirectionSlider label="Bottom" value={localBottom} onChange={(v) => update({ localBottom: v })} accentColor={ACCENT} />

        <div style={{ ...summaryRowStyle, marginTop: sp[3] }}>
          <span style={{ fontSize: 10, color: text.muted }}>Total width added:</span>
          <span style={{ fontSize: 10, color: ACCENT, fontWeight: 600 }}>{localLeft + localRight}px</span>
        </div>
        <div style={{ ...summaryRowStyle, marginTop: 2 }}>
          <span style={{ fontSize: 10, color: text.muted }}>Total height added:</span>
          <span style={{ fontSize: 10, color: ACCENT, fontWeight: 600 }}>{localTop + localBottom}px</span>
        </div>
      </SettingsPanel>

      {/* 5. Seed */}
      <div style={{ marginTop: sp[4], marginBottom: sp[2] }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: sp[1] }}>
          <span style={font.sublabel}>Seed (optional)</span>
          {localSeed !== '' && (
            <button onClick={() => update({ localSeed: '' })}
              aria-label="Clear seed"
              style={{ fontSize: 9, color: text.secondary, background: 'transparent', border: 'none', cursor: 'pointer' }}
            >clear</button>
          )}
        </div>
        <TextInput value={localSeed} onChange={(v) => update({ localSeed: v })} placeholder="Random if empty (0\u20132147483647)" type="number" />
      </div>

      {/* 6. Output */}
      <OutputPreview
        isLoading={isLoading}
        output={data.outputImage}
        error={data.outputError}
        accentColor={ACCENT}
        label="Expanded Output"
        emptyText="Expanded image will appear here"
      />

      <SecondaryOutputHandle id="prompt-out" />
      <SecondaryOutputHandle id="output" />

    </NodeShell>
  );
}
