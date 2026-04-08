import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { runwayGen45Generate, pollRunwayGen45Status } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

const DURATIONS = [
  { value: 5, label: '5s' },
  { value: 8, label: '8s' },
  { value: 10, label: '10s' },
];

const RATIOS = [
  { value: '1280:720', label: '16:9' },
  { value: '720:1280', label: '9:16' },
  { value: '1104:832', label: '4:3' },
  { value: '960:960', label: '1:1' },
  { value: '832:1104', label: '3:4' },
];

export default function RunwayGen45Node({ id, data, selected }) {
  const {
    progress, status, message, start, setProgress, complete, fail, isActive,
  } = useNodeProgress();

  const localDuration = data.localDuration || 5;
  const localRatio = data.localRatio || '1280:720';
  const localSeed = data.localSeed || 0; // Only works for I2V in API

  const update = useCallback(
    (patch) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback((handleId) => {
    return data.getConnectionInfo?.(id, handleId) || null;
  }, [id, data]);

  const imageConnection = getConnInfo('image-in');
  const hasImageConnection = data.hasConnection?.(id, 'image-in');
  const promptConnection = getConnInfo('prompt-in');
  const hasPromptConnection = data.hasConnection?.(id, 'prompt-in');

  const handleGenerate = useCallback(async () => {
    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
    if (!prompt) return;

    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];

    start('Submitting video request...');
    update({ outputVideo: null, outputError: null });

    try {
      const mode = images?.length ? 'image-to-video' : 'text-to-video';

      const params = {
        prompt,
        ratio: localRatio,
        duration: localDuration,
      };

      if (images?.length) {
        params.image = images[0];
        // Seed is only supported for I2V in Runway 4.5
        if (localSeed !== 0) {
           params.seed = localSeed;
        }
      }

      const result = await runwayGen45Generate(mode, params);

      if (result.error) {
        fail(new Error(result.error?.message || JSON.stringify(result.error)));
        update({ outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        setProgress(30, 'Processing video...');
        const statusResult = await pollRunwayGen45Status(mode, taskId);
        const generated = statusResult.data?.generated || [];
        complete('Video generation complete');
        update({
          outputVideo: generated[0] || null,
          outputVideos: generated,
          outputError: null,
        });
      } else if (result.data?.generated?.length) {
        complete('Video generation complete');
        update({
          outputVideo: result.data.generated[0],
          outputVideos: result.data.generated,
          outputError: null,
        });
      } else {
        complete('Video generation complete');
      }
    } catch (err) {
      console.error('Runway Gen 4.5 generation error:', err);
      fail(err);
      update({ outputError: err.message });
    }
  }, [id, data, update, localDuration, localRatio, localSeed, start, setProgress, complete, fail]);

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
    <NodeShell data={data}
      label={data.label || 'Runway Gen 4.5'}
      dotColor={ACCENT}
      selected={selected}
      onGenerate={handleGenerate}
      isGenerating={isActive}
    >

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

      {/* ── 1. Image (Optional, triggers I2V) ── */}
      {sectionHeader('Image (Optional)', 'image-in', 'target', getHandleColor('image-in'),
        hasImageConnection ? linkedBadges('image-in') : null
      )}
      {hasImageConnection ? connectionInfoBox(imageConnection) : (
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Upload source image (optional)"
          minHeight={60}
        />
      )}

      {/* ── 2. Prompt (Required) ── */}
      {sectionHeader('Prompt (Required)', 'prompt-in', 'target', getHandleColor('prompt-in'),
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><AutoPromptButton id={id} data={data} update={update} imageKey="image-in" localImageKey="localImage" />
            <ImprovePromptButton id={id} data={data} update={update} type="video" />{hasPromptConnection ? linkedBadges('prompt-in') : null}</div>
      )}
      {hasPromptConnection ? connectionInfoBox(promptConnection) : (
        <textarea value={data.inputPrompt || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder="Describe the video motion..."
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
          Video Settings
        </div>

        {/* Aspect Ratio */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Aspect Ratio</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {RATIOS.map((r) => pill(r.label, localRatio === r.value, () => update({ localRatio: r.value }), ACCENT))}
          </div>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Duration (seconds)</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {DURATIONS.map((d) => pill(d.label, localDuration === d.value, () => update({ localDuration: d.value }), ACCENT))}
          </div>
        </div>

        {/* Seed (Only for I2V) */}
        {(data.localImage || hasImageConnection) && (
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>Seed (I2V only)</div>
            <input type="number" value={localSeed}
              onChange={(e) => update({ localSeed: Number(e.target.value) })}
              placeholder="0-4294967295 (optional)"
              style={{
                width: '100%', background: '#111', border: '1px solid #3a3a3a',
                borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '4px 8px',
                outline: 'none', boxSizing: 'border-box',
              }} />
          </div>
        )}
      </div>

      {/* ── Progress Indicator ── */}
      {isActive && (
        <NodeProgress progress={progress} status={status} message={message} />
      )}

      {/* ── 4. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Generated Video</span>
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
