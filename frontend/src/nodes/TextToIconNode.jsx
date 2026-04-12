import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  PromptInput,
  TextInput,
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
import { textToIconGenerate, pollTextToIconStatus } from '../utils/api';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

export default function TextToIconNode({ id, data, selected }) {
  const { isActive, start, complete, fail } = useNodeProgress();
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);

  const localNumInferenceSteps = data.localNumInferenceSteps ?? 25;
  const localGuidanceScale = data.localGuidanceScale ?? 7.5;
  const localSeed = data.localSeed ?? '';

  const promptConn = conn('prompt-in');

  const handleGenerate = useCallback(async () => {
    const prompt = resolve.text('prompt-in', data.inputPrompt);
    if (!prompt) return;

    start();
    update({ outputImage: null, isLoading: true });

    try {
      const params = {
        prompt,
        num_inference_steps: localNumInferenceSteps,
        guidance_scale: localGuidanceScale,
      };
      if (localSeed !== '' && localSeed !== undefined && localSeed !== null) {
        params.seed = Number(localSeed);
      }

      const result = await textToIconGenerate(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail();
        return;
      }

      if (result.data?.task_id) {
        const status = await pollTextToIconStatus(result.data.task_id);
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
      console.error('Text to icon error:', err);
      update({ isLoading: false, outputError: err.message });
      fail();
    }
  }, [id, data, update, localNumInferenceSteps, localGuidanceScale, localSeed, start, complete, fail, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  const ACCENT = CATEGORY_COLORS.imageGeneration;

  return (
    <NodeShell data={data} label={data.label || 'Text to Icon'} dotColor={ACCENT} selected={selected} onGenerate={handleGenerate} isGenerating={isActive} downloadUrl={data.outputImage || undefined} onDisconnect={disconnectNode}>
      <OutputHandle id="output" label="image" color={getHandleColor('output')} />

      {/* ── 1. Prompt ── */}
      <SectionHeader 
        label="Prompt" 
        handleId="prompt-in" 
        handleType="target" 
        color={getHandleColor('prompt-in')}
        isConnected={promptConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'prompt-in')}
        extra={<ImprovePromptButton id={id} data={data} update={update} type="image" />}
      />
      <ConnectedOrLocal connected={promptConn.connected} connInfo={promptConn.info}>
        <PromptInput
          value={data.inputPrompt || ''}
          onChange={(v) => update({ inputPrompt: v })}
          placeholder="e.g. A minimalist vector icon of a paper plane"
          rows={3}
        />
      </ConnectedOrLocal>

      {/* ── 2. Settings ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
        padding: 12, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          Icon Settings
        </div>

        <Slider label="Steps" value={localNumInferenceSteps} onChange={(v) => update({ localNumInferenceSteps: v })} min={10} max={50} accentColor={ACCENT} />
        <Slider label="Guidance" value={localGuidanceScale} onChange={(v) => update({ localGuidanceScale: v })} min={0} max={10} step={0.5} accentColor={ACCENT} />

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
      </div>

      <NodeProgress isActive={isActive} />

      <OutputPreview
        isLoading={isActive}
        output={data.outputImage}
        error={data.outputError}
        accentColor={ACCENT}
        label="Generated Icon"
      />
    </NodeShell>
  );
}
