import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  PromptInput,
  TextInput,
  DirectionSlider,
  Pill,
  OutputHandle,
  OutputPreview,
  useNodeConnections,
  getHandleColor,
} from './shared';
import { ideogramExpand, pollIdeogramExpandStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

const PRESETS = [
  { label: 'Widen', left: 256, right: 256, top: 0, bottom: 0 },
  { label: 'Extend Top', left: 0, right: 0, top: 512, bottom: 0 },
  { label: 'Extend Bottom', left: 0, right: 0, top: 0, bottom: 512 },
  { label: 'Equal All', left: 128, right: 128, top: 128, bottom: 128 },
  { label: 'Banner', left: 512, right: 512, top: 0, bottom: 0 },
  { label: 'Reset', left: 0, right: 0, top: 0, bottom: 0 },
];

export default function IdeogramExpandNode({ id, data, selected }) {
  const { isActive, start, complete, fail } = useNodeProgress();
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localLeft = data.localLeft ?? 0;
  const localRight = data.localRight ?? 0;
  const localTop = data.localTop ?? 0;
  const localBottom = data.localBottom ?? 0;
  const localSeed = data.localSeed ?? '';

  const imageConn = conn('image-in');
  const promptConn = conn('prompt-in');

  const handleExpand = useCallback(async () => {
    let images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    start();
    update({ outputImage: null, isLoading: true });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) imageBase64 = imageBase64.split(',')[1];

      const prompt = resolve.text('prompt-in', data.inputPrompt);

      const params = {
        image: imageBase64,
        left: localLeft,
        right: localRight,
        top: localTop,
        bottom: localBottom,
      };
      if (prompt) params.prompt = prompt;
      if (localSeed !== '' && localSeed !== undefined && localSeed !== null) {
        params.seed = Number(localSeed);
      }

      const result = await ideogramExpand(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail();
        return;
      }

      if (result.data?.task_id) {
        const status = await pollIdeogramExpandStatus(result.data.task_id);
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
      complete();
    } catch (err) {
      console.error('Ideogram expand error:', err);
      update({ isLoading: false, outputError: err.message });
      fail();
    }
  }, [id, data, update, localLeft, localRight, localTop, localBottom, localSeed, start, complete, fail, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleExpand();
    }
  }, [data.triggerGenerate, handleExpand]);

  const ACCENT = '#14b8a6';

  return (
    <NodeShell data={data} label={data.label || 'Ideogram Expand'} dotColor={ACCENT} selected={selected} onGenerate={handleExpand} isGenerating={isActive} downloadUrl={data.outputImage || undefined}>
      <OutputHandle id="output" label="image" color={getHandleColor('output')} />
      <OutputHandle id="prompt-out" label="prompt" color={getHandleColor('prompt-out')} />

      {/* ── 1. Image ── */}
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

      {/* ── 2. Prompt ── */}
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
          placeholder="Optional: guide content (auto-generated if empty)"
          rows={2}
        />
      </ConnectedOrLocal>

      {/* ── 3. Expansion Presets ── */}
      <div style={{ marginTop: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Presets</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
        {PRESETS.map((p) => (
          <Pill 
            key={p.label} 
            label={p.label} 
            isActive={localLeft === p.left && localRight === p.right && localTop === p.top && localBottom === p.bottom}
            onClick={() => update({ localLeft: p.left, localRight: p.right, localTop: p.top, localBottom: p.bottom })}
            accentColor={ACCENT}
          />
        ))}
      </div>

      {/* ── 4. Directional Controls ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
        padding: 12, marginTop: 6,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          Expansion Pixels (0–2048)
        </div>

        {/* Visual direction indicator */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 40px',
          gridTemplateRows: 'auto auto auto',
          gap: 2, alignItems: 'center', marginBottom: 8,
        }}>
          <div />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: localTop > 0 ? ACCENT : '#555' }}>▲ Top: {localTop}</span>
          </div>
          <div />

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 10, color: localLeft > 0 ? ACCENT : '#555' }}>◀ {localLeft}</span>
          </div>
          <div style={{
            background: '#0e0e0e', borderRadius: 4, border: '1px solid #333',
            padding: '8px 4px', textAlign: 'center',
          }}>
            <span style={{ fontSize: 10, color: '#666' }}>Original</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: 10, color: localRight > 0 ? ACCENT : '#555' }}>{localRight} ▶</span>
          </div>

          <div />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: localBottom > 0 ? ACCENT : '#555' }}>▼ Bottom: {localBottom}</span>
          </div>
          <div />
        </div>

        {/* Sliders */}
        <DirectionSlider label="Left" value={localLeft} onChange={(v) => update({ localLeft: v })} accentColor={ACCENT} />
        <DirectionSlider label="Right" value={localRight} onChange={(v) => update({ localRight: v })} accentColor={ACCENT} />
        <DirectionSlider label="Top" value={localTop} onChange={(v) => update({ localTop: v })} accentColor={ACCENT} />
        <DirectionSlider label="Bottom" value={localBottom} onChange={(v) => update({ localBottom: v })} accentColor={ACCENT} />

        {/* Total expansion summary */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 8,
          padding: '6px 8px', background: '#111', borderRadius: 6,
        }}>
          <span style={{ fontSize: 10, color: '#666' }}>Total width added:</span>
          <span style={{ fontSize: 10, color: ACCENT, fontWeight: 600 }}>{localLeft + localRight}px</span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 2,
          padding: '6px 8px', background: '#111', borderRadius: 6,
        }}>
          <span style={{ fontSize: 10, color: '#666' }}>Total height added:</span>
          <span style={{ fontSize: 10, color: ACCENT, fontWeight: 600 }}>{localTop + localBottom}px</span>
        </div>
      </div>

      {/* ── 5. Seed ── */}
      <div style={{ marginTop: 10, marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>Seed (optional)</span>
        </div>
        <TextInput
          type="number"
          value={String(localSeed)}
          onChange={(v) => update({ localSeed: v })}
          placeholder="Random if empty"
        />
      </div>

      <NodeProgress isActive={isActive} />

      <OutputPreview
        isLoading={isActive}
        output={data.outputImage}
        error={data.outputError}
        accentColor={ACCENT}
        label="Expanded Output"
      />
    </NodeShell>
  );
}
