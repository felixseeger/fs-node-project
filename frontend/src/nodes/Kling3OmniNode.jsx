import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { kling3OmniGenerate, pollKling3OmniStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

const MODELS = [
  { value: 'std', label: 'Standard' },
  { value: 'pro', label: 'Pro' },
];

const ASPECT_RATIOS = [
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '1:1', label: '1:1' },
  { value: 'auto', label: 'Auto' },
];

const DURATIONS = [
  { value: 5, label: '5s' },
  { value: 10, label: '10s' },
];

export default function Kling3OmniNode({ id, data, selected }) {
  const {
    progress, status, message, start, setProgress, complete, fail, isActive,
  } = useNodeProgress();

  const localModel = data.localModel || 'std';
  const localDuration = data.localDuration || 5;
  const localAspectRatio = data.localAspectRatio || '16:9';
  const localCfgScale = data.localCfgScale ?? 0.5;
  const localGenerateAudio = data.localGenerateAudio ?? false;

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
  const videoConnection = getConnInfo('video-in');
  const hasVideoConnection = data.hasConnection?.(id, 'video-in');

  const handleGenerate = useCallback(async () => {
    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
    
    let startImages = data.resolveInput?.(id, 'start-image-in');
    if (!startImages?.length && data.localStartImage) startImages = [data.localStartImage];

    let endImages = data.resolveInput?.(id, 'end-image-in');
    if (!endImages?.length && data.localEndImage) endImages = [data.localEndImage];
    
    let referenceVideos = data.resolveInput?.(id, 'video-in');
    if (!referenceVideos?.length && data.localVideo) referenceVideos = [data.localVideo];

    if (!prompt && !referenceVideos?.length) return;

    start('Submitting video request...');
    update({ outputVideo: null, outputError: null });

    try {
      const params = {
        aspect_ratio: localAspectRatio,
        duration: localDuration.toString(),
        cfg_scale: localCfgScale,
        generate_audio: localGenerateAudio,
      };
      
      if (prompt) {
        params.prompt = prompt;
      }

      if (data.inputNegativePrompt) {
        params.negative_prompt = data.inputNegativePrompt;
      }

      if (startImages?.length) {
        params.start_image_url = startImages[0];
      }

      if (endImages?.length) {
        params.end_image_url = endImages[0];
      }
      
      if (referenceVideos?.length) {
        params.video_url = referenceVideos[0];
      }

      const result = await kling3OmniGenerate(localModel, params);

      if (result.error) {
        fail(result.error?.message || JSON.stringify(result.error));
        update({ outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      const isReferenceVideo = !!referenceVideos?.length;
      
      if (taskId) {
        // Custom polling with progress updates
        setProgress(20, 'Initializing video generation...');
        const maxAttempts = 120;
        const intervalMs = 3000;
        
        for (let i = 0; i < maxAttempts; i++) {
          setProgress(20 + Math.min(75, (i / maxAttempts) * 75), `Processing video... (${i + 1}/${maxAttempts})`);
          
          const statusData = await pollKling3OmniStatus(taskId, isReferenceVideo, 1, intervalMs);
          
          if (statusData.data?.status === 'COMPLETED') {
            const generated = statusData.data?.generated || [];
            complete('Video generation complete');
            update({
              outputVideo: generated[0] || null,
              outputVideos: generated,
              outputError: null,
            });
            return;
          }
          
          if (statusData.data?.status === 'FAILED') {
            throw new Error('Kling 3 Omni generation failed');
          }
        }
        
        throw new Error('Polling timeout');
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
      console.error('Kling 3 Omni generation error:', err);
      fail(err.message || 'Generation failed');
      update({ outputError: err.message });
    }
  }, [id, data, update, localModel, localDuration, localAspectRatio, localCfgScale, localGenerateAudio, start, setProgress, complete, fail]);

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

  const ACCENT = '#14b8a6'; // Teal for video

  // ── Render ──

  return (
    <NodeShell data={data} label={data.label || 'Kling 3 Omni'} dotColor={ACCENT} selected={selected} onGenerate={handleGenerate} isGenerating={isActive}>

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
      
      {/* ── 0. Video Input (Optional, for Reference) ── */}
      {sectionHeader('Reference Video (Optional)', 'video-in', 'target', getHandleColor('video-in'),
        hasVideoConnection ? linkedBadges('video-in') : null
      )}
      {hasVideoConnection ? connectionInfoBox(videoConnection) : (
        <input type="text" value={data.localVideo || ''}
          onChange={(e) => update({ localVideo: e.target.value })}
          placeholder="Reference Video URL..."
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '6px 8px',
            outline: 'none', boxSizing: 'border-box',
          }} />
      )}

      {/* ── 1. Start Image (Optional) ── */}
      {sectionHeader('Start Frame (Optional)', 'start-image-in', 'target', getHandleColor('image-in'),
        hasStartImageConnection ? linkedBadges('start-image-in') : null
      )}
      {hasStartImageConnection ? connectionInfoBox(startImageConnection) : (
        <ImageUploadBox
          image={data.localStartImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localStartImage: img })}
          placeholder="Click or drag to upload start frame"
          minHeight={60}
        />
      )}

      {/* ── 2. End Image (Optional) ── */}
      {sectionHeader('End Frame (Optional)', 'end-image-in', 'target', getHandleColor('image-in'),
        hasEndImageConnection ? linkedBadges('end-image-in') : null
      )}
      {hasEndImageConnection ? connectionInfoBox(endImageConnection) : (
        <ImageUploadBox
          image={data.localEndImage || null}
          onImageChange={(img) => update({ localEndImage: img })}
          placeholder="Click or drag to upload end frame"
          minHeight={60}
        />
      )}

      {/* ── 3. Prompt ── */}
      {sectionHeader('Prompt', 'prompt-in', 'target', getHandleColor('prompt-in'),
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><AutoPromptButton id={id} data={data} update={update} imageKey="start-image-in" localImageKey="localStartImage" />
            <ImprovePromptButton id={id} data={data} update={update} type="video" />{hasPromptConnection ? linkedBadges('prompt-in') : null}</div>
      )}
      {hasPromptConnection ? connectionInfoBox(promptConnection) : (
        <textarea value={data.inputPrompt || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder="Describe the video... (Req. if no ref video)"
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
          placeholder="What to avoid..."
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

        {/* Model */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Model Tier</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {MODELS.map((m) => pill(m.label, localModel === m.value, () => update({ localModel: m.value }), ACCENT))}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Aspect Ratio</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {ASPECT_RATIOS.map((a) => pill(a.label, localAspectRatio === a.value, () => update({ localAspectRatio: a.value }), ACCENT))}
          </div>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#999' }}>Duration (seconds)</span>
            <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localDuration}s</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: '#555', minWidth: 14, textAlign: 'right' }}>3</span>
            <input type="range" min={3} max={15} step={1} value={localDuration}
              onChange={(e) => update({ localDuration: Number(e.target.value) })}
              style={{ flex: 1, accentColor: ACCENT }} />
            <span style={{ fontSize: 9, color: '#555', minWidth: 14 }}>15</span>
          </div>
        </div>

        {/* CFG Scale */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#999' }}>CFG Scale (Prompt Adherence)</span>
            <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localCfgScale}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: '#555', minWidth: 14, textAlign: 'right' }}>0</span>
            <input type="range" min={0} max={1} step={0.05} value={localCfgScale}
              onChange={(e) => update({ localCfgScale: Number(e.target.value) })}
              style={{ flex: 1, accentColor: ACCENT }} />
            <span style={{ fontSize: 9, color: '#555', minWidth: 14 }}>1</span>
          </div>
        </div>

        {toggle('Generate Audio', localGenerateAudio, (v) => update({ localGenerateAudio: v }))}
      </div>

      {/* ── 6. Progress ── */}
      {(isActive || status === 'failed' || status === 'completed') && (
        <NodeProgress progress={progress} status={status} message={message} />
      )}

      {/* ── 7. Output ── */}
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
            <span style={{ fontSize: 10, color: '#999' }}>Generating video (may take 1-2 mins)...</span>
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
