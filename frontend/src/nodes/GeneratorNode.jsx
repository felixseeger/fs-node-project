import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeConnections from './useNodeConnections';
import useNodeProgress from '../hooks/useNodeProgress';
import { getHandleColor } from '../utils/handleTypes';
import { generateImage, generateKora, pollStatus } from '../utils/api';

const KORA_ASPECTS = ['Auto', '1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'];
const NANO_ASPECTS = ['Auto', '1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'];
const KORA_RESOLUTIONS = ['HD', '2K'];
const NANO_RESOLUTIONS = ['1K', '2K', '4K'];

export default function GeneratorNode({ id, data, selected }) {
  const { update, disconnectNode } = useNodeConnections(id, data);
  
  // Progress tracking
  const {
    progress,
    status,
    message,
    start,
    setProgress,
    complete,
    fail,
    isActive,
  } = useNodeProgress({
    onProgress: (state) => {
      update({
        executionProgress: state.progress,
        executionStatus: state.status,
        executionMessage: state.message,
      });
    },
  });

  const isKora = data.generatorType === 'kora';
  const showImageIn = !isKora;

  const aspects = isKora ? KORA_ASPECTS : NANO_ASPECTS;
  const resolutions = isKora ? KORA_RESOLUTIONS : NANO_RESOLUTIONS;

  const localAspect = data.localAspectRatio || aspects[0];
  const localResolution = data.localResolution || resolutions[0];
  const localNumImages = data.localNumImages || 1;

  // Find the source node info for a given handle
  const getConnInfo = useCallback((handleId) => {
    return data.getConnectionInfo?.(id, handleId) || null;
  }, [id, data]);

  const promptConnection = getConnInfo('prompt-in');
  const hasPromptConnection = data.hasConnection?.(id, 'prompt-in');
  const imageConnection = getConnInfo('image-in');
  const hasImageConnection = data.hasConnection?.(id, 'image-in');

  const handleGenerate = useCallback(async () => {
    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
    if (!prompt) return;

    start('Submitting generation request...');
    update({ outputImage: null, outputError: null });

    try {
      const params = { prompt };

      if (showImageIn) {
        let images = data.resolveInput?.(id, 'image-in');
        if (!images?.length && data.localImage) images = [data.localImage];
        if (images?.length) params.image_urls = images;
      }

      const ar = data.resolveInput?.(id, 'aspect-ratio-in') || localAspect;
      if (ar && ar !== 'Auto') params.aspect_ratio = ar;

      const res = data.resolveInput?.(id, 'resolution-in') || localResolution;
      if (res) params.resolution = res;

      const num = data.resolveInput?.(id, 'num-images-in') || localNumImages;
      if (num) params.num_images = num;

      const genFn = isKora ? generateKora : generateImage;
      const result = await genFn(params);

      if (result.error) {
        fail(new Error(result.error?.message || 'Generation failed'));
        update({ outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      if (result.data?.task_id) {
        // Poll with progress tracking
        let lastProgress = 10;
        const statusResult = await pollStatus(result.data.task_id, isKora ? 'realism' : 'fluid', 90, 2000, (attempt, maxAttempts) => {
          // Calculate progress based on polling attempt
          lastProgress = 10 + Math.min(85, (attempt / maxAttempts) * 85);
          setProgress(lastProgress, `Generating... (${attempt}/${maxAttempts})`);
        });
        
        const generated = statusResult.data?.generated || [];
        complete('Generation complete');
        update({
          outputImage: generated[0] || null,
          outputImages: generated,
          inputPrompt: prompt,
        });

        // Spawn and connect ImageOutputNode
        if (generated.length > 0 && data.onCreateNode) {
          data.onCreateNode(
            'imageOutput',
            { outputImage: generated[0] },
            'output',
            'image-in'
          );
        }
      } else if (result.data?.generated?.length) {
        complete('Done');
        const generated = result.data.generated;
        update({
          outputImage: generated[0],
          outputImages: generated,
          inputPrompt: prompt,
        });

        // Spawn and connect ImageOutputNode
        if (generated.length > 0 && data.onCreateNode) {
          data.onCreateNode(
            'imageOutput',
            { outputImage: generated[0] },
            'output',
            'image-in'
          );
        }
      } else {
        complete('No images generated');
      }
    } catch (err) {
      console.error('Generation error:', err);
      fail(err);
      update({ outputError: err.message });
    }
  }, [id, data, update, isKora, showImageIn, localAspect, localResolution, localNumImages, start, setProgress, complete, fail]);

  // Listen for external trigger from global Generate button
  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  // ── Helpers ──

  const sectionHeader = (label, handleId, handleType, color, onAdd, extra) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 6, marginTop: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Handle
          type={handleType}
          position={handleType === 'target' ? Position.Left : Position.Right}
          id={handleId}
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: color, border: 'none',
            position: 'relative',
            left: handleType === 'target' ? -12 : 'auto',
            right: handleType === 'source' ? -12 : 'auto',
            transform: 'none',
          }}
        />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {extra}
        {onAdd && (
          <button
            onClick={onAdd}
            style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'transparent', border: '1px solid #3a3a3a',
              color: '#999', fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0, lineHeight: 1,
            }}
          >
            +
          </button>
        )}
      </div>
    </div>
  );

  const linkedBadges = (onUnlinkHandle) => (
    <>
      <span style={{
        fontSize: 9, color: '#3b82f6', padding: '2px 6px',
        background: 'rgba(59,130,246,0.1)', borderRadius: 4,
      }}>linked</span>
      <button
        onClick={() => data.onUnlink?.(id, onUnlinkHandle)}
        style={{
          fontSize: 9, color: '#ef4444', padding: '2px 6px',
          background: 'rgba(239,68,68,0.15)', borderRadius: 4,
          border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
        }}
      >
        unlink
      </button>
    </>
  );

  const connectionInfoBox = (connInfo) => (
    <div style={{
      background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
      borderRadius: 6, padding: '6px 10px', marginBottom: 4,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: '#3b82f6', flexShrink: 0,
      }} />
      <span style={{ fontSize: 11, color: '#93b4f5' }}>
        {connInfo
          ? `Linked from ${connInfo.nodeLabel} \u2192 ${connInfo.handle}`
          : 'Linked from upstream node'}
      </span>
    </div>
  );

  const pill = (label, isActive, onClick, activeColor) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        padding: '4px 12px', fontSize: 11, fontWeight: isActive ? 600 : 400,
        borderRadius: 14, border: 'none', cursor: 'pointer',
        background: isActive ? (activeColor || '#3b82f6') : '#1a1a1a',
        color: isActive ? '#fff' : '#999',
      }}
    >
      {label}
    </button>
  );

  // ── Render ──

  return (
    <NodeShell data={data}
      label={data.label || (isKora ? 'Kora Reality' : 'Nano Banana 2 Edit')}
      dotColor={isKora ? '#8b5cf6' : '#ec4899'}
      selected={selected}
      onDisconnect={disconnectNode}
      onGenerate={handleGenerate}
      isGenerating={isActive}
    >

      {/* ── Image Output Handle (top, aligned with image-in) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        marginBottom: 4,
      }}>
        <span style={{ fontSize: 10, color: '#999', marginRight: 4 }}>image</span>
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('output'), border: 'none',
            position: 'relative', right: -12, transform: 'none',
          }}
        />
      </div>

      {/* ── 1. Prompt Section ── */}
      {sectionHeader('Prompt', 'prompt-in', 'target', getHandleColor('prompt-in'), null,
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><AutoPromptButton id={id} data={data} update={update} imageKey="image-in" localImageKey="localImage" />
            <ImprovePromptButton id={id} data={data} update={update} type="image" />{hasPromptConnection ? linkedBadges('prompt-in') : null}</div>
      )}
      {hasPromptConnection ? (
        connectionInfoBox(promptConnection)
      ) : (
        <textarea
          value={data.inputPrompt || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder="Enter prompt..."
          rows={2}
          style={{
            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
          }}
        />
      )}

      {/* ── 2. Aspect Ratio Section ── */}
      {sectionHeader('Aspect Ratio', 'aspect-ratio-in', 'target', getHandleColor('aspect-ratio-in'),
        () => data.onAddToInput?.('aspect_ratio', id, 'aspect-ratio-in')
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
        {aspects.map((a) => pill(a, localAspect === a, () => update({ localAspectRatio: a }), '#3b82f6'))}
      </div>

      {/* ── 3. Images Section (Nano Banana only) ── */}
      {showImageIn && (
        <>
          {sectionHeader('Images', 'image-in', 'target', getHandleColor('image-in'), null,
            hasImageConnection ? linkedBadges('image-in') : (
              <button
                onClick={() => data.onAddToInput?.('image_urls', id, 'image-in')}
                style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'transparent', border: '1px solid #3a3a3a',
                  color: '#999', fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 0, lineHeight: 1,
                }}
              >
                +
              </button>
            )
          )}
          {hasImageConnection && connectionInfoBox(imageConnection)}
        </>
      )}

      {/* ── 4. Resolution Section ── */}
      {sectionHeader('Resolution', 'resolution-in', 'target', getHandleColor('resolution-in'),
        () => data.onAddToInput?.('resolution', id, 'resolution-in')
      )}
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {resolutions.map((r) => pill(r, localResolution === r, () => update({ localResolution: r }), '#3b82f6'))}
      </div>

      {/* ── 5. Num Images Section ── */}
      {sectionHeader('Num Images', 'num-images-in', 'target', getHandleColor('num-images-in'),
        () => data.onAddToInput?.('num_images', id, 'num-images-in')
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <input
          type="range"
          min={1}
          max={4}
          value={localNumImages}
          onChange={(e) => update({ localNumImages: Number(e.target.value) })}
          style={{ flex: 1, accentColor: '#3b82f6' }}
        />
        <span style={{ fontSize: 12, color: '#e0e0e0', minWidth: 14, textAlign: 'right' }}>
          {localNumImages}
        </span>
      </div>

      {/* ── 6. Generated Output Section ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 10, height: 10, borderRadius: '50%',
            background: '#ec4899', flexShrink: 0,
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Generated Output</span>
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
        background: '#1a1a1a', borderRadius: 6,
        border: '1px solid #3a3a3a',
        minHeight: 80, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {isActive ? (
          <div style={{
            width: 28, height: 28, border: '3px solid #3a3a3a',
            borderTop: '3px solid #3b82f6', borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        ) : data.outputImage ? (
          <img
            src={data.outputImage}
            alt="generated"
            style={{ width: '100%', display: 'block', borderRadius: 6 }}
          />
        ) : data.outputError ? (
          <span style={{ fontSize: 10, color: '#ef4444', padding: 12, textAlign: 'center' }}>
            {data.outputError}
          </span>
        ) : (
          <span style={{ fontSize: 11, color: '#555', padding: 16, textAlign: 'center' }}>
            Output will appear here after running the workflow
          </span>
        )}
      </div>

      {/* Output handles */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6, gap: 4, alignItems: 'center' }}>
        <Handle
          type="source"
          position={Position.Right}
          id="prompt-out"
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('prompt-out'), border: 'none',
            position: 'relative', right: -12, transform: 'none',
          }}
        />
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </NodeShell>
  );
}
