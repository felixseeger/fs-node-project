import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import NodeProgress from './NodeProgress';
import { getHandleColor } from '../utils/handleTypes';
import { reimagineFlux } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import useNodeProgress from '../hooks/useNodeProgress';

const IMAGINATIONS = [
  { value: 'subtle', label: 'Subtle', desc: 'Close to original' },
  { value: 'vivid', label: 'Vivid', desc: 'Balanced creativity' },
  { value: 'wild', label: 'Wild', desc: 'Maximum creativity' },
];

const ASPECT_RATIOS = [
  { value: 'original', label: 'Original' },
  { value: 'square_1_1', label: '1:1' },
  { value: 'classic_4_3', label: '4:3' },
  { value: 'traditional_3_4', label: '3:4' },
  { value: 'widescreen_16_9', label: '16:9' },
  { value: 'social_story_9_16', label: '9:16' },
  { value: 'standard_3_2', label: '3:2' },
  { value: 'portrait_2_3', label: '2:3' },
  { value: 'horizontal_2_1', label: '2:1' },
  { value: 'vertical_1_2', label: '1:2' },
  { value: 'social_post_4_5', label: '4:5' },
];

export default function FluxReimagineNode({ id, data, selected }) {
  // Progress tracking
  const {
    progress,
    status,
    message,
    start,
    complete,
    fail,
    isActive,
  } = useNodeProgress();

  const localImagination = data.localImagination || 'vivid';
  const localAspect = data.localAspect || 'original';

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

  const handleReimagine = useCallback(async () => {
    let images = data.resolveInput?.(id, 'image-in');
    if (!images?.length && data.localImage) images = [data.localImage];
    if (!images?.length) return;

    start('Reimagining image...');
    update({ outputImage: null, outputError: null });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) imageBase64 = imageBase64.split(',')[1];

      const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';

      const params = { image: imageBase64 };
      if (prompt) params.prompt = prompt;

      const imagination = data.resolveInput?.(id, 'imagination-in') || localImagination;
      if (imagination) params.imagination = imagination;

      const aspectRatio = data.resolveInput?.(id, 'aspect-ratio-in') || localAspect;
      if (aspectRatio && aspectRatio !== 'original') params.aspect_ratio = aspectRatio;

      const result = await reimagineFlux(params);

      if (result.error) {
        fail(new Error(result.error?.message || 'Reimagine failed'));
        update({ outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      // Synchronous — results come back directly
      const generated = result.data?.generated || result.generated || [];
      complete('Reimagine complete');
      update({
        outputImage: generated[0] || null,
        outputImages: generated,
        outputError: null,
      });
    } catch (err) {
      console.error('Reimagine error:', err);
      fail(err);
      update({ outputError: err.message });
    }
  }, [id, data, update, localImagination, localAspect, start, complete, fail]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleReimagine();
    }
  }, [data.triggerGenerate, handleReimagine]);

  // ── Helpers ──

  const sectionHeader = (label, handleId, handleType, color, onAdd, extra) => (
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {extra}
        {onAdd && (
          <button onClick={onAdd} style={{
            width: 20, height: 20, borderRadius: '50%', background: 'transparent',
            border: '1px solid #3a3a3a', color: '#999', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 1,
          }}>+</button>
        )}
      </div>
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

  const pill = (label, isActive, onClick, color) => (
    <button key={label} onClick={onClick} style={{
      padding: '4px 10px', fontSize: 11, fontWeight: isActive ? 600 : 400,
      borderRadius: 14, border: 'none', cursor: 'pointer',
      background: isActive ? (color || '#10b981') : '#1a1a1a',
      color: isActive ? '#fff' : '#999',
    }}>{label}</button>
  );

  // ── Render ──

  return (
    <NodeShell 
      label={data.label || 'Flux Reimagine'} 
      dotColor="#10b981" 
      selected={selected}
      onGenerate={handleReimagine}
      isGenerating={isActive}
    >

      {/* ── Image Output Handle (top, aligned with image-in) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        marginBottom: 4,
      }}>
        <span style={{ fontSize: 10, color: '#999', marginRight: 4 }}>image</span>
        <Handle type="source" position={Position.Right} id="output" style={{
          width: 10, height: 10, borderRadius: '50%',
          background: getHandleColor('output'), border: 'none',
          position: 'relative', right: -12, transform: 'none',
        }} />
      </div>

      {/* ── 1. Image ── */}
      {sectionHeader('Image', 'image-in', 'target', getHandleColor('image-in'), null,
        hasImageConnection ? linkedBadges('image-in') : null
      )}
      {hasImageConnection ? connectionInfoBox(imageConnection) : (
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Click or drag to upload image"
        />
      )}

      {/* ── 2. Prompt ── */}
      {sectionHeader('Prompt', 'prompt-in', 'target', getHandleColor('prompt-in'), null,
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><AutoPromptButton id={id} data={data} update={update} imageKey="image-in" localImageKey="localImage" />
            <ImprovePromptButton id={id} data={data} update={update} type="image" />{hasPromptConnection ? linkedBadges('prompt-in') : null}</div>
      )}
      {hasPromptConnection ? connectionInfoBox(promptConnection) : (
        <textarea value={data.inputPrompt || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder="Optional: guide the reimagination (e.g., 'cyberpunk city at night')"
          rows={2}
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
          }} />
      )}

      {/* ── 3. Imagination ── */}
      {sectionHeader('Imagination', 'imagination-in', 'target', getHandleColor('aspect-ratio-in'),
        () => data.onAddToInput?.('imagination', id, 'imagination-in')
      )}
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        {IMAGINATIONS.map((im) => (
          <button key={im.value} onClick={() => update({ localImagination: im.value })} style={{
            flex: 1, padding: '8px 6px', fontSize: 11, textAlign: 'center',
            borderRadius: 8, border: 'none', cursor: 'pointer',
            background: localImagination === im.value ? 'rgba(16,185,129,0.15)' : '#1a1a1a',
            borderLeft: localImagination === im.value ? '3px solid #10b981' : '3px solid transparent',
            transition: 'all 0.15s',
          }}>
            <div style={{ fontWeight: localImagination === im.value ? 600 : 400, color: localImagination === im.value ? '#e0e0e0' : '#999', marginBottom: 2 }}>
              {im.label}
            </div>
            <div style={{ fontSize: 9, color: '#666' }}>{im.desc}</div>
          </button>
        ))}
      </div>

      {/* ── 4. Aspect Ratio ── */}
      {sectionHeader('Aspect Ratio', 'aspect-ratio-in', 'target', getHandleColor('aspect-ratio-in'),
        () => data.onAddToInput?.('aspect_ratio', id, 'aspect-ratio-in')
      )}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4,
        maxHeight: 60, overflowY: 'auto',
      }}>
        {ASPECT_RATIOS.map((a) => pill(a.label, localAspect === a.value,
          () => update({ localAspect: a.value }), '#10b981'
        ))}
      </div>

      {/* ── 5. Info badge ── */}
      <div style={{
        background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 8, padding: '8px 12px', marginTop: 8,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="1.5" fill="none" />
          <path d="M12 8v4M12 16h.01" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 10, color: '#6ee7b7', lineHeight: 1.4 }}>
          Synchronous — reimagined image returns instantly
        </span>
      </div>

      {/* ── 6. Output ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6, marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ec4899', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Reimagined Output</span>
        </div>
      </div>
      
      {/* Progress indicator */}
      {isActive && (
        <NodeProgress
          progress={progress}
          status={status}
          message={message}
        />
      )}
      
      <div style={{
        background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
        minHeight: 80, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        {isActive ? (
          <div style={{
            width: 28, height: 28, border: '3px solid #3a3a3a',
            borderTop: '3px solid #10b981', borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        ) : data.outputImage ? (
          <img src={data.outputImage} alt="reimagined" style={{ width: '100%', display: 'block', borderRadius: 6 }} />
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', padding: 12, textAlign: 'center' }}>{data.outputError}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', padding: 16, textAlign: 'center' }}>Reimagined image will appear here</span>
        )}
      </div>

      {/* Output handles */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6, gap: 4, alignItems: 'center' }}>
        <Handle type="source" position={Position.Right} id="prompt-out" style={{
          width: 10, height: 10, borderRadius: '50%',
          background: getHandleColor('prompt-out'), border: 'none',
          position: 'relative', right: -12, transform: 'none',
        }} />
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </NodeShell>
  );
}
