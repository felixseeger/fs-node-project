import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { runwayActTwoGenerate, pollRunwayActTwoStatus } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

const RATIOS = [
  { value: '1280:720', label: '16:9' },
  { value: '720:1280', label: '9:16' },
  { value: '1104:832', label: '4:3' },
  { value: '832:1104', label: '3:4' },
  { value: '960:960', label: '1:1' },
  { value: '1584:672', label: '21:9' },
];

export default function RunwayActTwoNode({ id, data, selected }) {
  const { isActive, start, fail, complete } = useNodeProgress();

  const localRatio = data.localRatio || '1280:720';
  const localBodyControl = data.localBodyControl !== undefined ? data.localBodyControl : true;
  const localExpressionIntensity = data.localExpressionIntensity || 3;
  const localSeed = data.localSeed || 0;

  const update = useCallback(
    (patch) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const getConnInfo = useCallback((handleId) => {
    return data.getConnectionInfo?.(id, handleId) || null;
  }, [id, data]);

  const characterConnection = getConnInfo('character-in');
  const hasCharacterConnection = data.hasConnection?.(id, 'character-in');
  
  const referenceConnection = getConnInfo('reference-in');
  const hasReferenceConnection = data.hasConnection?.(id, 'reference-in');

  const handleGenerate = useCallback(async () => {
    let characterImages = data.resolveInput?.(id, 'character-in');
    if (!characterImages?.length && data.localCharacter) characterImages = [data.localCharacter];

    let referenceVideos = data.resolveInput?.(id, 'reference-in');
    if (!referenceVideos?.length && data.localReference) referenceVideos = [data.localReference];

    if (!characterImages?.length || !referenceVideos?.length) return;

    start();
    update({ outputVideo: null, isLoading: true });

    try {
      const characterUrl = characterImages[0];
      const referenceUrl = referenceVideos[0];
      
      const characterType = characterUrl.match(/\.(mp4|webm|mov|mkv)(\?.*)?$/i) ? 'video' : 'image';
      
      const params = {
        character: {
          type: characterType,
          uri: characterUrl
        },
        reference: {
          type: 'video',
          uri: referenceUrl
        },
        ratio: localRatio,
        body_control: localBodyControl,
        expression_intensity: localExpressionIntensity,
      };

      if (localSeed !== 0) {
        params.seed = localSeed;
      }

      const result = await runwayActTwoGenerate(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        fail();
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        const status = await pollRunwayActTwoStatus(taskId);
        const generated = status.data?.generated || [];
        update({
          outputVideo: generated[0] || null,
          outputVideos: generated,
          isLoading: false,
          outputError: null,
        });
        complete();
      } else if (result.data?.generated?.length) {
        update({
          outputVideo: result.data.generated[0],
          outputVideos: result.data.generated,
          isLoading: false,
          outputError: null,
        });
        complete();
      } else {
        update({ isLoading: false });
        fail();
      }
    } catch (err) {
      console.error('Runway Act Two generation error:', err);
      update({ isLoading: false, outputError: err.message });
      fail();
    }
  }, [id, data, update, localRatio, localBodyControl, localExpressionIntensity, localSeed, start, fail, complete]);

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
  const IMG_ACCENT = '#f59e0b'; // Orange for image

  // ── Render ──

  return (
    <NodeShell data={data}
      label={data.label || 'Runway Act Two'}
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

      {/* ── 1. Character (Required) ── */}
      {sectionHeader('Character Image/Video', 'character-in', 'target', IMG_ACCENT,
        hasCharacterConnection ? linkedBadges('character-in') : null
      )}
      {hasCharacterConnection ? connectionInfoBox(characterConnection) : (
        <ImageUploadBox
          image={data.localCharacter || null}
          onImageChange={(img) => update({ localCharacter: img })}
          placeholder="Upload character"
          minHeight={60}
        />
      )}

      {/* ── 2. Reference (Required) ── */}
      {sectionHeader('Reference Video', 'reference-in', 'target', ACCENT,
        hasReferenceConnection ? linkedBadges('reference-in') : null
      )}
      {hasReferenceConnection ? connectionInfoBox(referenceConnection) : (
        <div style={{ padding: '8px', background: '#1a1a1a', borderRadius: '6px', border: '1px dashed #3a3a3a', textAlign: 'center' }}>
          <span style={{ fontSize: 11, color: '#999' }}>Must be connected to a video source</span>
        </div>
      )}

      {/* ── 3. Settings ── */}
      <div style={{
        background: '#1a1a1a', borderRadius: 8, border: '1px solid #3a3a3a',
        padding: 12, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          Performance Settings
        </div>

        {/* Aspect Ratio */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Aspect Ratio</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {RATIOS.map((r) => pill(r.label, localRatio === r.value, () => update({ localRatio: r.value }), ACCENT))}
          </div>
        </div>

        {/* Expression Intensity */}
        <div style={{ marginBottom: 10 }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#999' }}>Expression Intensity</span>
            <span style={{ fontSize: 11, color: '#e0e0e0', fontWeight: 600 }}>{localExpressionIntensity}</span>
          </div>
          <input type="range" min="1" max="5" step="1" value={localExpressionIntensity}
            onChange={(e) => update({ localExpressionIntensity: parseInt(e.target.value) })}
            style={{ width: '100%', accentColor: ACCENT }} />
           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
             <span style={{ fontSize: 9, color: '#666' }}>Subtle</span>
             <span style={{ fontSize: 9, color: '#666' }}>Exaggerated</span>
           </div>
        </div>

        {/* Body Control Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '4px 0' }}>
            <span style={{ fontSize: 11, color: '#999' }}>Body Control</span>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={localBodyControl} onChange={(e) => update({ localBodyControl: e.target.checked })} style={{ display: 'none' }} />
              <div style={{ width: 28, height: 16, background: localBodyControl ? ACCENT : '#3a3a3a', borderRadius: 8, position: 'relative', transition: 'background 0.2s' }}>
                <div style={{ width: 12, height: 12, background: '#fff', borderRadius: '50%', position: 'absolute', top: 2, left: localBodyControl ? 14 : 2, transition: 'left 0.2s' }} />
              </div>
            </label>
        </div>

        {/* Seed */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>Seed</div>
          <input type="number" value={localSeed}
            onChange={(e) => update({ localSeed: Number(e.target.value) })}
            placeholder="0-4294967295 (optional)"
            style={{
              width: '100%', background: '#111', border: '1px solid #3a3a3a',
              borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '4px 8px',
              outline: 'none', boxSizing: 'border-box',
            }} />
        </div>
      </div>

      {/* ── Progress ── */}
      <NodeProgress nodeId={id} />

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
            <span style={{ fontSize: 10, color: '#999' }}>Generating performance...</span>
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
