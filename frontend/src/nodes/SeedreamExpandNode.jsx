import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  PromptInput,
  DirectionSlider,
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
import { seedreamExpand, pollSeedreamExpandStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import useNodeProgress from '../hooks/useNodeProgress';

export default function SeedreamExpandNode({ id, data, selected }) {
  const { isActive, start, complete, fail } = useNodeProgress();
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localLeft = data.localLeft ?? 0;
  const localRight = data.localRight ?? 0;
  const localTop = data.localTop ?? 0;
  const localBottom = data.localBottom ?? 0;

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

      const result = await seedreamExpand(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail();
        return;
      }

      if (result.data?.task_id) {
        const status = await pollSeedreamExpandStatus(result.data.task_id);
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
      console.error('Seedream expand error:', err);
      update({ isLoading: false, outputError: err.message });
      fail();
    }
  }, [id, data, update, localLeft, localRight, localTop, localBottom, start, complete, fail, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleExpand();
    }
  }, [data.triggerGenerate, handleExpand]);

  const ACCENT = '#14b8a6';

  return (
    <NodeShell data={data} label={data.label || 'Seedream Expand'} dotColor={ACCENT} selected={selected} onGenerate={handleExpand} isGenerating={isActive}>
      <OutputHandle id="output" label="image" color={getHandleColor('output')} />

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

      {/* ── 3. Directional Controls ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
        padding: 12, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          Expansion Pixels (0–2048)
        </div>

        <DirectionSlider label="Left" value={localLeft} onChange={(v) => update({ localLeft: v })} accentColor={ACCENT} />
        <DirectionSlider label="Right" value={localRight} onChange={(v) => update({ localRight: v })} accentColor={ACCENT} />
        <DirectionSlider label="Top" value={localTop} onChange={(v) => update({ localTop: v })} accentColor={ACCENT} />
        <DirectionSlider label="Bottom" value={localBottom} onChange={(v) => update({ localBottom: v })} accentColor={ACCENT} />
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

import NodeProgress from './NodeProgress';
