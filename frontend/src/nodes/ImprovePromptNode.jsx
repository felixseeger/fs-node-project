import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  PromptInput,
  Pill,
  OutputHandle,
  OutputPreview,
  useNodeConnections,
  getHandleColor,
} from './shared';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';
import { improvePromptGenerate, pollImprovePromptStatus } from '../utils/api';

const TYPES = [
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
];

export default function ImprovePromptNode({ id, data, selected }) {
  const { isActive, start, complete, fail } = useNodeProgress(id);
  const { update, conn, resolve } = useNodeConnections(id, data);

  const localType = data.localType || 'image';
  const localLanguage = data.localLanguage || 'en';

  const promptConn = conn('prompt-in');

  const handleGenerate = useCallback(async () => {
    const prompt = resolve.text('prompt-in', data.inputPrompt);

    start();
    update({ outputPrompt: null, isLoading: true });

    try {
      const params = {
        prompt,
        type: localType,
        language: localLanguage,
      };

      const result = await improvePromptGenerate(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail(result.error?.message || 'Failed to improve prompt');
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const status = await pollImprovePromptStatus(taskId);
        const generated = status.data?.generated || [];
        update({
          outputPrompt: generated[0] || null,
          isLoading: false,
          outputError: null,
        });
        complete();
      } else if (result.data?.generated?.length) {
        update({
          outputPrompt: result.data.generated[0],
          isLoading: false,
          outputError: null,
        });
        complete();
      } else {
        update({ isLoading: false });
        complete();
      }
    } catch (err) {
      console.error('Improve prompt error:', err);
      update({ isLoading: false, outputError: err.message });
      fail(err.message);
    }
  }, [id, data, update, localType, localLanguage, start, complete, fail, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  const ACCENT = '#f97316'; // Orange

  return (
    <NodeShell data={data} label={data.label || 'Improve Prompt'} dotColor={ACCENT} selected={selected} onGenerate={handleGenerate} isGenerating={isActive}>
      <OutputHandle id="prompt-out" label="prompt" color={getHandleColor('prompt-out')} />

      {/* ── 1. Prompt ── */}
      <SectionHeader 
        label="Input Prompt" 
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
          placeholder="e.g. A cute cat"
          rows={3}
        />
      </ConnectedOrLocal>

      {/* ── 2. Settings ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
        padding: 12, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          Prompt Settings
        </div>

        {/* Type */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Generation Type</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {TYPES.map((t) => (
              <Pill key={t.value} label={t.label} isActive={localType === t.value} onClick={() => update({ localType: t.value })} accentColor={ACCENT} />
            ))}
          </div>
        </div>

        {/* Language */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Language</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {LANGUAGES.map((l) => (
              <Pill key={l.value} label={l.label} isActive={localLanguage === l.value} onClick={() => update({ localLanguage: l.value })} accentColor={ACCENT} />
            ))}
          </div>
        </div>
      </div>

      <NodeProgress nodeId={id} />

      <OutputPreview
        isLoading={isActive}
        output={data.outputPrompt}
        error={data.outputError}
        type="text"
        accentColor={ACCENT}
        label="Improved Prompt"
      />
    </NodeShell>
  );
}
