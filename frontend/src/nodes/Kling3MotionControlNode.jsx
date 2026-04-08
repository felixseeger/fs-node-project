import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { kling3MotionGenerate, pollKling3MotionStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

const MODELS = [
  { value: 'std', label: 'Standard' },
  { value: 'pro', label: 'Pro' },
];

const ORIENTATIONS = [
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Image' },
];

export default function Kling3MotionControlNode({ id, data, selected }) {
  const { isActive, start, fail, complete, progress } = useNodeProgress();

  const localModel = data.localModel || 'std';
  const localOrientation = data.localOrientation || 'video';
  const localCfgScale = data.localCfgScale ?? 0.5;

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
  const videoConnection = getConnInfo('video-in');
  const hasVideoConnection = data.hasConnection?.(id, 'video-in');

  const handleGenerate = useCallback(async () => {
    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
    
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];
    
    let referenceVideos = data.resolveInput?.(id, 'video-in');
    if (!referenceVideos?.length && data.localVideo) referenceVideos = [data.localVideo];

    if (!images?.length || !referenceVideos?.length) return;

    start();
    update({ outputVideo: null, isLoading: true });

    try {
      const params = {
        image_url: images[0],
        video_url: referenceVideos[0],
        character_orientation: localOrientation,
        cfg_scale: localCfgScale,
      };
      
      if (prompt) {
        params.prompt = prompt;
      }

      const result = await kling3MotionGenerate(localModel, params);

      if (result.error) {
        fail(result.error?.message || JSON.stringify(result.error));
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const onProgress = (p) => {
          if (p && typeof p.percent === 'number') {
            // Progress is tracked implicitly through polling
          }
        };
        const status = await pollKling3MotionStatus(localModel, taskId, 90, 2000, onProgress);
        const generated = status.data?.generated || [];
        complete();
        update({
          outputVideo: generated[0] || null,
          outputVideos: generated,
          isLoading: false,
          outputError: null,
        });
      } else if (result.data?.generated?.length) {
        complete();
        update({
          outputVideo: result.data.generated[0],
          outputVideos: result.data.generated,
          isLoading: false,
          outputError: null,
        });
      } else {
        complete();
        update({ isLoading: false });
      }
    } catch (err) {
      console.error('Kling 3 Motion Control generation error:', err);
      fail(err.message);
      update({ isLoading: false, outputError: err.message });
    }
  }, [id, data, update, localModel, localOrientation, localCfgScale, start, fail, complete]);

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
    <NodeShell data={data} label={data.label || 'Kling 3 Motion Control'} dotColor={ACCENT} selected={selected} onGenerate={handleGenerate} isGenerating={isActive}>

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
      
      {/* ── 1. Character Image Input (Required) ── */}
      {sectionHeader('Character Image (Required)', 'image-in', 'target', getHandleColor('image-in'),
        hasImageConnection ? linkedBadges('image-in') : null
      )}
      {hasImageConnection ? connectionInfoBox(imageConnection) : (
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Upload character image"
          minHeight={60}
        />
      )}

      {/* ── 2. Reference Video Input (Required) ── */}
      {sectionHeader('Reference Video (Required)', 'video-in', 'target', getHandleColor('video-in'),
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

      {/* ── 3. Prompt (Optional) ── */}
      {sectionHeader('Prompt (Optional)', 'prompt-in', 'target', getHandleColor('prompt-in'),
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><AutoPromptButton id={id} data={data} update={update} imageKey="image-in" localImageKey="localImage" />
            <ImprovePromptButton id={id} data={data} update={update} type="video" />{hasPromptConnection ? linkedBadges('prompt-in') : null}</div>
      )}
      {hasPromptConnection ? connectionInfoBox(promptConnection) : (
        <textarea value={data.inputPrompt || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder="Guide the motion transfer..."
          rows={2}
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
          }} />
      )}

      {/* ── 4. Settings ── */}
      <div style={{
        background: '#1a1a1a', borderRadius: 8, border: '1px solid #3a3a3a',
        padding: 12, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          Motion Settings
        </div>

        {/* Model */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Model Tier</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {MODELS.map((m) => pill(m.label, localModel === m.value, () => update({ localModel: m.value }), ACCENT))}
          </div>
        </div>

        {/* Orientation */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Orientation</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {ORIENTATIONS.map((o) => pill(o.label, localOrientation === o.value, () => update({ localOrientation: o.value }), ACCENT))}
          </div>
        </div>

        {/* CFG Scale */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#999' }}>CFG Scale</span>
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
      </div>

      {/* ── Progress ── */}
      {isActive && <NodeProgress progress={progress} status="Generating video..." />}

      {/* ── 5. Output ── */}
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
