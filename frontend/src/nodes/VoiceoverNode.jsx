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
  getHandleColor,
} from './shared';
import { NodeCapabilities } from './nodeCapabilities';
import { voiceoverGenerate, pollVoiceoverStatus } from '../utils/api';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

const COMMON_VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Female, Soft)' },
  { id: 'AZnzlk1XvdvUeBnXmlS6', name: 'Nicole (Female, Whisper)' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Female, Soft)' },
  { id: 'ErXwSzhRrr21m0C4v38i', name: 'Antoni (Male, Deep)' },
  { id: 'GBv7mTt0atIp3Y8iX6jw', name: 'Thomas (Male, Calm)' },
  { id: 'Lcf7u9D97U3IhS5l8p7V', name: 'Adam (Male, Deep)' },
  { id: 'onw9f4m8nuOe6m6Lp88i', name: 'Josh (Male, Casual)' },
];

export default function VoiceoverNode({ id, data, selected }) {
  const { isActive, start, complete, fail } = useNodeProgress();
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);

  const localVoiceId = data.localVoiceId || '21m00Tcm4TlvDq8ikWAM';
  const localStability = data.localStability ?? 0.5;
  const localSimilarityBoost = data.localSimilarityBoost ?? 0.75;
  const localStyle = data.localStyle ?? 0;
  const localUseSpeakerBoost = data.localUseSpeakerBoost ?? true;
  const localSpeed = data.localSpeed ?? 1.0;

  const promptConn = conn('prompt-in');

  const handleGenerate = useCallback(async () => {
    const prompt = resolve.text('prompt-in', data.inputPrompt);
    if (!prompt) return;

    start();
    update({ outputAudio: null, isLoading: true });

    try {
      const params = {
        text: prompt,
        voice_id: localVoiceId,
        voice_settings: {
          stability: localStability,
          similarity_boost: localSimilarityBoost,
          style: localStyle,
          use_speaker_boost: localUseSpeakerBoost,
        },
      };

      const result = await voiceoverGenerate(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail();
        return;
      }

      if (result.data?.task_id) {
        const status = await pollVoiceoverStatus(result.data.task_id);
        const generated = status.data?.generated || [];
        update({
          outputAudio: generated[0] || null,
          isLoading: false,
          outputError: null,
        });
        complete();
      } else if (result.data?.generated?.length) {
        update({
          outputAudio: result.data.generated[0],
          isLoading: false,
          outputError: null,
        });
        complete();
      } else {
        update({ isLoading: false });
        complete();
      }
    } catch (err) {
      console.error('Voiceover error:', err);
      update({ isLoading: false, outputError: err.message });
      fail();
    }
  }, [id, data, update, localVoiceId, localStability, localSimilarityBoost, localStyle, localUseSpeakerBoost, start, complete, fail, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  const ACCENT = '#a855f7';

  return (
    <NodeShell data={data} label={data.label || 'Voiceover'} dotColor={ACCENT} selected={selected} onGenerate={handleGenerate} isGenerating={isActive} downloadUrl={data.outputAudio || undefined} downloadType="audio" onDisconnect={disconnectNode} capabilities={[NodeCapabilities.AUDIO_VOICEOVER, NodeCapabilities.OUTPUT_AUDIO]}>
      <OutputHandle id="output" label="audio" color={getHandleColor('audio-out')} />

      {/* ── 1. Prompt ── */}
      <SectionHeader 
        label="Prompt" 
        handleId="prompt-in" 
        handleType="target" 
        color={getHandleColor('prompt-in')}
        isConnected={promptConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'prompt-in')}
        extra={<ImprovePromptButton id={id} data={data} update={update} type="audio" />}
      />
      <ConnectedOrLocal connected={promptConn.connected} connInfo={promptConn.info}>
        <PromptInput
          value={data.inputPrompt || ''}
          onChange={(v) => update({ inputPrompt: v })}
          placeholder="e.g. Welcome to the presentation! Today we will learn..."
          rows={4}
        />
      </ConnectedOrLocal>

      {/* ── 2. Settings ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
        padding: 12, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          Voice Settings
        </div>

        {/* Voice Selection */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Select Voice</div>
          <select 
            className="nodrag nopan"
            value={localVoiceId} 
            onChange={(e) => update({ localVoiceId: e.target.value })}
            style={{
              width: '100%', background: '#111', border: '1px solid #3a3a3a',
              borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '6px 8px', outline: 'none'
            }}>
            {COMMON_VOICES.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          <TextInput 
            value={localVoiceId} 
            onChange={(v) => update({ localVoiceId: v })}
            placeholder="Or enter custom Voice ID"
          />
        </div>

        <Slider label="Stability" value={localStability} onChange={(v) => update({ localStability: v })} min={0} max={1} step={0.05} accentColor={ACCENT} />
        <Slider label="Similarity Boost" value={localSimilarityBoost} onChange={(v) => update({ localSimilarityBoost: v })} min={0} max={1} step={0.05} accentColor={ACCENT} />
        <Slider label="Speed" value={localSpeed} onChange={(v) => update({ localSpeed: v })} min={0.7} max={1.2} step={0.05} accentColor={ACCENT} />
      </div>

      <NodeProgress isActive={isActive} />

      <OutputPreview
        isLoading={isActive}
        output={data.outputAudio}
        error={data.outputError}
        type="audio"
        accentColor={ACCENT}
        label="Generated Audio"
      />
    </NodeShell>
  );
}
