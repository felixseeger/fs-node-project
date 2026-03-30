import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { wan26Generate, pollWan26Status } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';

const RESOLUTIONS = [
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
];

const DURATIONS = [
  { value: '5', label: '5s' },
  { value: '10', label: '10s' },
  { value: '15', label: '15s' },
];

const RATIOS = [
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '1:1', label: '1:1' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
];

const SHOT_TYPES = [
  { value: 'single', label: 'Single' },
  { value: 'multi', label: 'Multi' },
];

const SIZE_MAP = {
  '720p': {
    '16:9': '1280*720',
    '9:16': '720*1280',
    '1:1': '960*960',
    '4:3': '1088*832',
    '3:4': '832*1088',
  },
  '1080p': {
    '16:9': '1920*1080',
    '9:16': '1080*1920',
    '1:1': '1440*1440',
    '4:3': '1632*1248',
    '3:4': '1248*1632',
  }
};

export default function Wan26VideoNode({ id, data, selected }) {
  const [isLoading, setIsLoading] = useState(false);

  const localResolution = data.localResolution || '720p';
  const localDuration = data.localDuration || '5';
  const localRatio = data.localRatio || '16:9';
  const localShotType = data.localShotType || 'single';
  const localPromptExpansion = data.localPromptExpansion || false;
  const localSeed = data.localSeed || -1;

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

    setIsLoading(true);
    update({ outputVideo: null, isLoading: true });

    try {
      const mode = images?.length ? 'image-to-video' : 'text-to-video';
      const size = SIZE_MAP[localResolution][localRatio];

      const params = {
        prompt,
        size,
        duration: localDuration,
        shot_type: localShotType,
        enable_prompt_expansion: localPromptExpansion,
        seed: localSeed,
      };

      if (data.inputNegativePrompt) {
        params.negative_prompt = data.inputNegativePrompt;
      }

      if (images?.length) {
        params.image = images[0];
      }

      const result = await wan26Generate(mode, localResolution, params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        setIsLoading(false);
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const status = await pollWan26Status(mode, localResolution, taskId);
        const generated = status.data?.generated || [];
        update({
          outputVideo: generated[0] || null,
          outputVideos: generated,
          isLoading: false,
          outputError: null,
        });
      } else if (result.data?.generated?.length) {
        update({
          outputVideo: result.data.generated[0],
          outputVideos: result.data.generated,
          isLoading: false,
          outputError: null,
        });
      } else {
        update({ isLoading: false });
      }
    } catch (err) {
      console.error('WAN 2.6 generation error:', err);
      update({ isLoading: false, outputError: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [id, data, update, localResolution, localDuration, localRatio, localShotType, localPromptExpansion, localSeed]);

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
    <NodeShell label={data.label || 'WAN 2.6 Video'} dotColor={ACCENT} selected={selected}>

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
          placeholder="Upload keyframe (optional)"
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
          placeholder="Scene description, camera moves..."
          rows={3}
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
          }} />
      )}

      {/* ── 3. Negative Prompt ── */}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 11, color: '#999', marginBottom: 4, fontWeight: 600 }}>Negative Prompt</div>
        <input type="text" value={data.inputNegativePrompt || ''}
          onChange={(e) => update({ inputNegativePrompt: e.target.value })}
          placeholder="blurry, low quality, watermark..."
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '6px 8px',
            outline: 'none', boxSizing: 'border-box',
          }} />
      </div>

      {/* ── 4. Settings ── */}
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
          <div style={{ display: 'flex', gap: 4 }}>
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

        {/* Aspect Ratio */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Aspect Ratio</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {RATIOS.map((r) => pill(r.label, localRatio === r.value, () => update({ localRatio: r.value }), ACCENT))}
          </div>
        </div>

        {/* Shot Type */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Shot Type</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {SHOT_TYPES.map((s) => pill(s.label, localShotType === s.value, () => update({ localShotType: s.value }), ACCENT))}
          </div>
        </div>

        {toggle('Prompt Expansion', localPromptExpansion, (v) => update({ localPromptExpansion: v }))}

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
        {isLoading ? (
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