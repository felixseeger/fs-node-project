import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { audioIsolationGenerate, pollAudioIsolationStatus } from '../utils/api';
import ImprovePromptButton from './ImprovePromptButton';

export default function AudioIsolationNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);

  const localInputType = data.localInputType || 'audio'; // 'audio' or 'video'
  const localRerankingCandidates = data.localRerankingCandidates || 1;
  const localPredictSpans = data.localPredictSpans ?? false;
  const localSampleFps = data.localSampleFps || 2;
  const localX1 = data.localX1 || 0;
  const localY1 = data.localY1 || 0;
  const localX2 = data.localX2 || 0;
  const localY2 = data.localY2 || 0;

  const update = useCallback(
    (patch) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback((handleId) => {
    return data.getConnectionInfo?.(id, handleId) || null;
  }, [id, data]);

  const promptConnection = getConnInfo('prompt-in');
  const hasPromptConnection = data.hasConnection?.(id, 'prompt-in');

  const mediaConnection = getConnInfo(localInputType === 'audio' ? 'audio-in' : 'video-in');
  const hasMediaConnection = data.hasConnection?.(id, localInputType === 'audio' ? 'audio-in' : 'video-in');

  const handleGenerate = useCallback(async () => {
    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
    if (!prompt) return;

    let mediaUrls;
    if (localInputType === 'audio') {
        mediaUrls = data.resolveInput?.(id, 'audio-in');
        if (!mediaUrls?.length && data.localAudio) mediaUrls = [data.localAudio];
    } else {
        mediaUrls = data.resolveInput?.(id, 'video-in');
        if (!mediaUrls?.length && data.localVideo) mediaUrls = [data.localVideo];
    }

    if (!mediaUrls?.length) return;

    setIsLoading(true);
    update({ outputAudio: null, isLoading: true });

    try {
      const params = {
        description: prompt,
        reranking_candidates: localRerankingCandidates,
        predict_spans: localPredictSpans,
      };

      if (localInputType === 'audio') {
          params.audio = mediaUrls[0];
      } else {
          params.video = mediaUrls[0];
          params.sample_fps = localSampleFps;
          if (localX1 > 0 || localX2 > 0 || localY1 > 0 || localY2 > 0) {
              params.x1 = localX1;
              params.y1 = localY1;
              params.x2 = localX2;
              params.y2 = localY2;
          }
      }

      const result = await audioIsolationGenerate(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const status = await pollAudioIsolationStatus(taskId);
        const generated = status.data?.generated || [];
        update({
          outputAudio: generated[0] || null,
          isLoading: false,
          outputError: null,
        });
      } else if (result.data?.generated?.length) {
        update({
          outputAudio: result.data.generated[0],
          isLoading: false,
          outputError: null,
        });
      } else {
        update({ isLoading: false });
      }
    } catch (err) {
      console.error('Audio isolation error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, localInputType, localRerankingCandidates, localPredictSpans, localSampleFps, localX1, localY1, localX2, localY2]);

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

  const pill = (label, isActive, onClick, activeColor) => (
    <button key={label} onClick={onClick} style={{
      flex: 1, padding: '4px 0', fontSize: 11, fontWeight: isActive ? 600 : 400,
      borderRadius: 6, cursor: 'pointer',
      background: isActive ? (activeColor || '#a855f7') : '#1a1a1a',
      color: isActive ? '#fff' : '#999',
      border: `1px solid ${isActive ? (activeColor || '#a855f7') : '#3a3a3a'}`,
    }}>{label}</button>
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

  const numInput = (label, value, onChange) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 9, color: '#777', marginBottom: 2 }}>{label}</div>
      <input type="number" value={value} onChange={onChange}
        style={{
          width: '100%', background: '#111', border: '1px solid #3a3a3a',
          borderRadius: 4, color: '#e0e0e0', fontSize: 10, padding: '4px 6px',
          outline: 'none', boxSizing: 'border-box'
        }} />
    </div>
  );

  const ACCENT = '#a855f7'; // Purple for audio

  // ── Render ──

  return (
    <NodeShell label={data.label || 'SAM Audio Isolation'} dotColor={ACCENT} selected={selected}>

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

      {/* ── Input Type Selection ── */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {pill('Audio Input', localInputType === 'audio', () => update({ localInputType: 'audio' }), getHandleColor('audio-in'))}
          {pill('Video Input', localInputType === 'video', () => update({ localInputType: 'video' }), getHandleColor('video-in'))}
        </div>
      </div>

      {/* ── 1. Media Input (Required) ── */}
      {localInputType === 'audio' ? (
        <>
          {sectionHeader('Input Audio (Required)', 'audio-in', 'target', getHandleColor('audio-in'),
            hasMediaConnection ? linkedBadges('audio-in') : null
          )}
          {hasMediaConnection ? connectionInfoBox(mediaConnection) : (
            <input type="text" value={data.localAudio || ''}
              onChange={(e) => update({ localAudio: e.target.value })}
              placeholder="Audio URL (WAV, MP3...)"
              style={{
                width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
                borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '6px 8px',
                outline: 'none', boxSizing: 'border-box',
              }} />
          )}
        </>
      ) : (
        <>
          {sectionHeader('Input Video (Required)', 'video-in', 'target', getHandleColor('video-in'),
            hasMediaConnection ? linkedBadges('video-in') : null
          )}
          {hasMediaConnection ? connectionInfoBox(mediaConnection) : (
            <input type="text" value={data.localVideo || ''}
              onChange={(e) => update({ localVideo: e.target.value })}
              placeholder="Video URL (MP4, MOV...)"
              style={{
                width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
                borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '6px 8px',
                outline: 'none', boxSizing: 'border-box',
              }} />
          )}
        </>
      )}

      {/* ── 2. Description/Prompt (Required) ── */}
      {sectionHeader('Description (Required)', 'prompt-in', 'target', getHandleColor('prompt-in'),
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <ImprovePromptButton id={id} data={data} update={update} type="audio" />
          {hasPromptConnection ? linkedBadges('prompt-in') : null}
        </div>
      )}
      {hasPromptConnection ? connectionInfoBox(promptConnection) : (
        <textarea value={data.inputPrompt || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder="e.g. A person speaking, Dog barking..."
          rows={3}
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
          }} />
      )}

      {/* ── 3. Settings ── */}
      <div style={{
        background: '#1a1a1a', borderRadius: 8, border: '1px solid #3a3a3a',
        padding: 12, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          Isolation Settings
        </div>

        {/* Quality vs Speed */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#999' }}>Quality (Reranking)</span>
            <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localRerankingCandidates}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: '#555', minWidth: 14, textAlign: 'right' }}>1</span>
            <input type="range" min={1} max={8} step={1} value={localRerankingCandidates}
              onChange={(e) => update({ localRerankingCandidates: Number(e.target.value) })}
              style={{ flex: 1, accentColor: ACCENT }} />
            <span style={{ fontSize: 9, color: '#555', minWidth: 14 }}>8</span>
          </div>
        </div>

        {toggle('Event Detection (predict_spans)', localPredictSpans, (v) => update({ localPredictSpans: v }))}

        {/* Video Specific Settings */}
        {localInputType === 'video' && (
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #333' }}>
            <div style={{ fontSize: 11, color: '#999', marginBottom: 6, fontWeight: 600 }}>Video Settings</div>
            
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: '#888' }}>Sample FPS</span>
                <span style={{ fontSize: 10, color: '#e0e0e0', fontWeight: 600 }}>{localSampleFps}</span>
              </div>
              <input type="range" min={1} max={5} step={1} value={localSampleFps}
                onChange={(e) => update({ localSampleFps: Number(e.target.value) })}
                style={{ width: '100%', accentColor: getHandleColor('video-in') }} />
            </div>

            <div style={{ fontSize: 10, color: '#888', marginBottom: 4 }}>Bounding Box (0 = full frame)</div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              {numInput('X1', localX1, (e) => update({ localX1: Number(e.target.value) }))}
              {numInput('Y1', localY1, (e) => update({ localY1: Number(e.target.value) }))}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {numInput('X2', localX2, (e) => update({ localX2: Number(e.target.value) }))}
              {numInput('Y2', localY2, (e) => update({ localY2: Number(e.target.value) }))}
            </div>
          </div>
        )}
      </div>

      {/* ── 4. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Isolated Audio</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 10, color: '#999' }}>prompt</span>
          <Handle type="source" position={Position.Right} id="prompt-out" style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('prompt-out'), border: 'none',
            position: 'relative', right: -12, transform: 'none',
          }} />
        </div>
      </div>
      <div style={{
        background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
        minHeight: 120, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 12,
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, border: '3px solid #3a3a3a',
              borderTop: `3px solid ${ACCENT}`, borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <span style={{ fontSize: 10, color: '#999' }}>Isolating audio...</span>
          </div>
        ) : data.outputAudio ? (
          <audio src={data.outputAudio} controls style={{ width: '100%', borderRadius: 6, height: 40 }} />
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', textAlign: 'center', wordBreak: 'break-word' }}>{data.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', textAlign: 'center' }}>Extracted audio will appear here</span>
        )}
      </div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </NodeShell>
  );
}
