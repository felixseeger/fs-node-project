import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { pixVerseV5TransitionGenerate, pollPixVerseV5TransitionStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

const RESOLUTIONS = [
  { value: '360p', label: '360p' },
  { value: '540p', label: '540p' },
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
];

const DURATIONS = [
  { value: 5, label: '5s' },
  { value: 8, label: '8s' },
];

export default function PixVerseV5TransitionNode({ id, data, selected }) {
  const { progress, status, message, start, complete, fail, isActive } = useNodeProgress();

  const localResolution = data.localResolution || '720p';
  const localDuration = data.localDuration || 5;
  const localSeed = data.localSeed || -1;

  const update = useCallback(
    (patch) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback((handleId) => {
    return data.getConnectionInfo?.(id, handleId) || null;
  }, [id, data]);

  const startImageConnection = getConnInfo('start-image-in');
  const hasStartImageConnection = data.hasConnection?.(id, 'start-image-in');
  const endImageConnection = getConnInfo('end-image-in');
  const hasEndImageConnection = data.hasConnection?.(id, 'end-image-in');
  const promptConnection = getConnInfo('prompt-in');
  const hasPromptConnection = data.hasConnection?.(id, 'prompt-in');

  const handleGenerate = useCallback(async () => {
    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
    if (!prompt) return;

    let startImages = data.resolveInput?.(id, 'start-image-in');
    if (!startImages?.length && data.localStartImage) startImages = [data.localStartImage];

    let endImages = data.resolveInput?.(id, 'end-image-in');
    if (!endImages?.length && data.localEndImage) endImages = [data.localEndImage];

    if (!startImages?.length || !endImages?.length) return;

    start('Generating video...');
    update({ outputVideo: null, isLoading: true });

    try {
      const params = {
        prompt,
        first_image_url: startImages[0],
        last_image_url: endImages[0],
        resolution: localResolution,
        duration: localDuration,
      };

      if (data.inputNegativePrompt) {
        params.negative_prompt = data.inputNegativePrompt;
      }

      if (localSeed !== -1) {
        params.seed = localSeed;
      }

      const result = await pixVerseV5TransitionGenerate(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail(new Error(result.error?.message || 'Generation failed'));
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const pollResult = await pollPixVerseV5TransitionStatus(taskId, {
          onProgress: (progressData) => {
            if (progressData.progress !== undefined) {
              update({ isLoading: true });
            }
          }
        });
        const generated = pollResult.data?.generated || [];
        update({
          outputVideo: generated[0] || null,
          outputVideos: generated,
          isLoading: false,
          outputError: null,
        });
        complete('Video generated successfully');
      } else if (result.data?.generated?.length) {
        update({
          outputVideo: result.data.generated[0],
          outputVideos: result.data.generated,
          isLoading: false,
          outputError: null,
        });
        complete('Video generated successfully');
      } else {
        update({ isLoading: false });
        complete('Done');
      }
    } catch (err) {
      console.error('PixVerse V5 Transition error:', err);
      update({ isLoading: false, outputError: err.message });
      fail(err);
    }
  }, [id, data, update, localResolution, localDuration, localSeed, start, complete, fail]);

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
      background: isActive ? (activeColor || '#14b8a6') : '#1a1a1a',
      color: isActive ? '#fff' : '#999',
      border: `1px solid ${isActive ? (activeColor || '#14b8a6') : '#3a3a3a'}`,
    }}>{label}</button>
  );

  const ACCENT = '#14b8a6'; // Teal for video

  // ── Render ──

  return (
    <NodeShell data={data} label={data.label || 'PixVerse V5 Transition'} dotColor={ACCENT} selected={selected} onGenerate={handleGenerate} isGenerating={isActive}>

      {/* ── Video Output Handle (top) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        marginBottom: 4,
      }}>
        <span style={{ fontSize: 10, color: '#999', marginRight: 4 }}>video</span>
        <Handle type="source" position={Position.Right} id="output-video" style={{
          width: 10, height: 10, borderRadius: '50%',
          background: getHandleColor('output-video'), border: 'none',
          position: 'relative', right: -12, transform: 'none',
        }} />
      </div>

      {/* ── 1. Start Image (Required) ── */}
      {sectionHeader('First Frame (Required)', 'start-image-in', 'target', getHandleColor('image-in'),
        hasStartImageConnection ? linkedBadges('start-image-in') : null
      )}
      {hasStartImageConnection ? connectionInfoBox(startImageConnection) : (
        <ImageUploadBox
          image={data.localStartImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localStartImage: img })}
          placeholder="Upload first frame"
          minHeight={60}
        />
      )}

      {/* ── 2. End Image (Required) ── */}
      {sectionHeader('Last Frame (Required)', 'end-image-in', 'target', getHandleColor('image-in'),
        hasEndImageConnection ? linkedBadges('end-image-in') : null
      )}
      {hasEndImageConnection ? connectionInfoBox(endImageConnection) : (
        <ImageUploadBox
          image={data.localEndImage || null}
          onImageChange={(img) => update({ localEndImage: img })}
          placeholder="Upload last frame"
          minHeight={60}
        />
      )}

      {/* ── 3. Prompt (Required) ── */}
      {sectionHeader('Prompt (Required)', 'prompt-in', 'target', getHandleColor('prompt-in'),
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><AutoPromptButton id={id} data={data} update={update} imageKey="start-image-in" localImageKey="localStartImage" />
            <ImprovePromptButton id={id} data={data} update={update} type="video" />{hasPromptConnection ? linkedBadges('prompt-in') : null}</div>
      )}
      {hasPromptConnection ? connectionInfoBox(promptConnection) : (
        <textarea value={data.inputPrompt || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder="Describe the transition..."
          rows={3}
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
          }} />
      )}

      {/* ── 4. Negative Prompt ── */}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 11, color: '#999', marginBottom: 4, fontWeight: 600 }}>Negative Prompt</div>
        <input type="text" value={data.inputNegativePrompt || ''}
          onChange={(e) => update({ inputNegativePrompt: e.target.value })}
          placeholder="blurry, low quality..."
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '6px 8px',
            outline: 'none', boxSizing: 'border-box',
          }} />
      </div>

      {/* ── 5. Settings ── */}
      <div style={{
        background: '#1a1a1a', borderRadius: 8, border: '1px solid #3a3a3a',
        padding: 12, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          Video Settings
        </div>

        {/* Resolution */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Resolution</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {RESOLUTIONS.map((r) => pill(r.label, localResolution === r.value, () => update({ localResolution: r.value }), ACCENT))}
          </div>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Duration</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {DURATIONS.map((d) => pill(d.label, localDuration === d.value, () => update({ localDuration: d.value }), ACCENT))}
          </div>
        </div>

        {/* Seed */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>Seed</div>
          <input type="number" value={localSeed}
            onChange={(e) => update({ localSeed: Number(e.target.value) })}
            placeholder="-1 for random"
            style={{
              width: '100%', background: '#111', border: '1px solid #3a3a3a',
              borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '4px 8px',
              outline: 'none', boxSizing: 'border-box',
            }} />
        </div>
      </div>

      {/* ── Progress ── */}
      {isActive && (
        <NodeProgress progress={progress} status={status} message={message} />
      )}

      {/* ── 6. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Generated Video</span>
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
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        {isActive ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, border: '3px solid #3a3a3a',
              borderTop: `3px solid ${ACCENT}`, borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <span style={{ fontSize: 10, color: '#999' }}>Generating video...</span>
          </div>
        ) : data.outputVideo ? (
          <video src={data.outputVideo} autoPlay loop muted controls style={{ width: '100%', display: 'block', borderRadius: 6 }} />
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', padding: 12, textAlign: 'center', wordBreak: 'break-word' }}>{data.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', padding: 16, textAlign: 'center' }}>Generated video will appear here</span>
        )}
      </div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </NodeShell>
  );
}
