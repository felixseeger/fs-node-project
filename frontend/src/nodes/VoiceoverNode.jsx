import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { voiceoverGenerate, pollVoiceoverStatus } from '../utils/api';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

const COMMON_VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (American, Female)' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (American, Male)' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (American, Female)' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (American, Female)' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (American, Male)' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold (American, Male)' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam (American, Male)' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (American, Female)' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh (American, Male)' },
];

export default function VoiceoverNode({ id, data, selected }) {
  const { start, complete, fail, isActive, progress, status, message } = useNodeProgress();

  const localVoiceId = data.localVoiceId || '21m00Tcm4TlvDq8ikWAM';
  const localStability = data.localStability ?? 0.5;
  const localSimilarityBoost = data.localSimilarityBoost ?? 0.2;
  const localSpeed = data.localSpeed ?? 1.0;
  const localUseSpeakerBoost = data.localUseSpeakerBoost ?? true;

  const update = useCallback(
    (patch) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback((handleId) => {
    return data.getConnectionInfo?.(id, handleId) || null;
  }, [id, data]);

  const promptConnection = getConnInfo('prompt-in');
  const hasPromptConnection = data.hasConnection?.(id, 'prompt-in');

  const handleGenerate = useCallback(async () => {
    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';

    if (!prompt) return;

    start('Generating voiceover...');
    update({ outputAudio: null, isLoading: true });

    try {
      const params = {
        text: prompt,
        voice_id: localVoiceId,
        stability: localStability,
        similarity_boost: localSimilarityBoost,
        speed: localSpeed,
        use_speaker_boost: localUseSpeakerBoost,
      };

      const result = await voiceoverGenerate(params);

      if (result.error) {
        fail(new Error(result.error?.message || JSON.stringify(result.error)));
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const status = await pollVoiceoverStatus(taskId);
        const generated = status.data?.generated || [];
        complete('Voiceover generated');
        update({
          outputAudio: generated[0] || null,
          isLoading: false,
          outputError: null,
        });
      } else if (result.data?.generated?.length) {
        complete('Voiceover generated');
        update({
          outputAudio: result.data.generated[0],
          isLoading: false,
          outputError: null,
        });
      } else {
        complete('Voiceover generated');
        update({ isLoading: false });
      }
    } catch (err) {
      console.error('Voiceover error:', err);
      fail(err);
      update({ isLoading: false, outputError: err.message });
    }
  }, [id, data, update, localVoiceId, localStability, localSimilarityBoost, localSpeed, localUseSpeakerBoost, start, complete, fail]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  // ── Helpers ──

  const sectionHeader = (label, handleId, handleType, color, extra) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 6, marginTop: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Handle type={handleType} position={handleType === 'target' ? Position.Left : Position.Right}
          id={handleId} style={{
            width: 10, height: 10, borderRadius: '50%', background: color, border: 'none',
            position: 'relative', left: handleType === 'target' ? -12 : 'auto',
            right: handleType === 'source' ? -12 : 'auto', transform: 'none',
          }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>{label}</span>
      </div>
      {extra && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{extra}</div>}
    </div>
  );

  const linkedBadges = (onUnlinkHandle) => (
    <>
      <span style={{ fontSize: 9, color: '#3b82f6', padding: '2px 6px', background: 'rgba(59,130,246,0.1)', borderRadius: 4 }}>linked</span>
      <button onClick={() => data.onUnlink?.(id, onUnlinkHandle)} style={{
        fontSize: 9, color: '#ef4444', padding: '2px 6px', background: 'rgba(239,68,68,0.15)', borderRadius: 4,
        border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
      }}>unlink</button>
    </>
  );

  const connectionInfoBox = (connInfo) => (
    <div style={{
      background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
      borderRadius: 6, padding: '6px 10px', marginBottom: 4,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: '#93b4f5' }}>
        {connInfo ? `Linked from ${connInfo.nodeLabel} → ${connInfo.handle}` : 'Linked from upstream node'}
      </span>
    </div>
  );

  const toggle = (label, value, onChange) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 6, padding: '4px 0',
    }}>
      <span style={{ fontSize: 11, color: '#999' }}>{label}</span>
      <button onClick={() => onChange(!value)} style={{
        width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
        background: value ? ACCENT : '#333', position: 'relative', transition: 'background 0.15s',
      }}>
        <span style={{
          width: 14, height: 14, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3, left: value ? 19 : 3, transition: 'left 0.15s',
        }} />
      </button>
    </div>
  );

  const ACCENT = '#a855f7'; // Purple for audio

  // ── Render ──

  return (
    <NodeShell label={data.label || 'ElevenLabs Voiceover'} dotColor={ACCENT} selected={selected} onGenerate={handleGenerate} isGenerating={isActive}>

      {/* ── Audio Output Handle (top) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        marginBottom: 4,
      }}>
        <span style={{ fontSize: 10, color: '#999', marginRight: 4 }}>audio</span>
        <Handle type="source" position={Position.Right} id="output-audio" style={{
          width: 10, height: 10, borderRadius: '50%',
          background: getHandleColor('output-audio'), border: 'none',
          position: 'relative', right: -12, transform: 'none',
        }} />
      </div>

      {/* ── 1. Text/Prompt (Required) ── */}
      {sectionHeader('Text Content (Required)', 'prompt-in', 'target', getHandleColor('prompt-in'),
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <ImprovePromptButton id={id} data={data} update={update} type="audio" />
          {hasPromptConnection ? linkedBadges('prompt-in') : null}
        </div>
      )}
      {hasPromptConnection ? connectionInfoBox(promptConnection) : (
        <textarea value={data.inputPrompt || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder="e.g. Welcome to the presentation! Today we will learn..."
          rows={4}
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
          }} />
      )}

      {/* ── 2. Settings ── */}
      <div style={{
        background: '#1a1a1a', borderRadius: 8, border: '1px solid #3a3a3a',
        padding: 12, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          Voice Settings
        </div>

        {/* Voice Selection */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Select Voice</div>
          <select value={localVoiceId} onChange={(e) => update({ localVoiceId: e.target.value })}
            style={{
              width: '100%', background: '#111', border: '1px solid #3a3a3a',
              borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '6px 8px', outline: 'none'
            }}>
            {COMMON_VOICES.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          <input type="text" value={localVoiceId} onChange={(e) => update({ localVoiceId: e.target.value })}
            placeholder="Or enter custom Voice ID"
            style={{
              width: '100%', background: '#111', border: '1px solid #3a3a3a', marginTop: 4,
              borderRadius: 6, color: '#999', fontSize: 10, padding: '4px 8px', outline: 'none', boxSizing: 'border-box'
            }} />
        </div>

        {/* Stability */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#999' }}>Stability</span>
            <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localStability.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: '#555', minWidth: 14, textAlign: 'right' }}>0</span>
            <input type="range" min={0} max={1} step={0.05} value={localStability}
              onChange={(e) => update({ localStability: Number(e.target.value) })}
              style={{ flex: 1, accentColor: ACCENT }} />
            <span style={{ fontSize: 9, color: '#555', minWidth: 14 }}>1</span>
          </div>
        </div>

        {/* Similarity Boost */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#999' }}>Similarity Boost</span>
            <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localSimilarityBoost.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: '#555', minWidth: 14, textAlign: 'right' }}>0</span>
            <input type="range" min={0} max={1} step={0.05} value={localSimilarityBoost}
              onChange={(e) => update({ localSimilarityBoost: Number(e.target.value) })}
              style={{ flex: 1, accentColor: ACCENT }} />
            <span style={{ fontSize: 9, color: '#555', minWidth: 14 }}>1</span>
          </div>
        </div>

        {/* Speed */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#999' }}>Speed</span>
            <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localSpeed.toFixed(2)}x</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: '#555', minWidth: 14, textAlign: 'right' }}>0.7</span>
            <input type="range" min={0.7} max={1.2} step={0.05} value={localSpeed}
              onChange={(e) => update({ localSpeed: Number(e.target.value) })}
              style={{ flex: 1, accentColor: ACCENT }} />
            <span style={{ fontSize: 9, color: '#555', minWidth: 14 }}>1.2</span>
          </div>
        </div>

        {toggle('Speaker Boost', localUseSpeakerBoost, (v) => update({ localUseSpeakerBoost: v }))}
      </div>

      {/* ── Progress ── */}
      {isActive && (
        <NodeProgress progress={progress} status={status} message={message} />
      )}

      {/* ── 3. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Generated Audio</span>
        </div>
      </div>
      <div style={{
        background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
        minHeight: 120, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 12,
      }}>
        {isActive ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, border: '3px solid #3a3a3a',
              borderTop: `3px solid ${ACCENT}`, borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <span style={{ fontSize: 10, color: '#999' }}>Generating voiceover...</span>
          </div>
        ) : data.outputAudio ? (
          <audio src={data.outputAudio} controls style={{ width: '100%', borderRadius: 6, height: 40 }} />
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', textAlign: 'center', wordBreak: 'break-word' }}>{data.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', textAlign: 'center' }}>Voiceover audio will appear here</span>
        )}
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </NodeShell>
  );
}
