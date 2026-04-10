import React, { useCallback, useState, useEffect, useRef, FC, ReactNode } from 'react';
import { Position, Handle, NodeProps } from '@xyflow/react';
import NodeShell from './NodeShell';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeConnections from './useNodeConnections';
// @ts-ignore
import useNodeProgress from '../hooks/useNodeProgress';
import { getHandleColor } from '../utils/handleTypes';
// @ts-ignore
import { generateImage, generateKora, pollStatus } from '../utils/api';
import {
  CATEGORY_COLORS,
  border,
  control,
  radius,
  sp,
  surface,
  text,
  textareaStyle,
} from './nodeTokens';

const KORA_ASPECTS = ['Auto', '1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'];
const NANO_ASPECTS = ['Auto', '1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'];
const KORA_RESOLUTIONS = ['HD', '2K'];
const NANO_RESOLUTIONS = ['1K', '2K', '4K'];

/**
 * GeneratorNode - Core image generation node
 */
const GeneratorNode: FC<NodeProps> = ({ id, data, selected }) => {
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
    onProgress: (state: any) => {
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

  const localAspect = (data.localAspectRatio as string) || aspects[0];
  const localResolution = (data.localResolution as string) || resolutions[0];
  const localNumImages = (data.localNumImages as number) || 1;

  // Find the source node info for a given handle
  const getConnInfo = useCallback((handleId: string) => {
    if (typeof data.getConnectionInfo === 'function') {
      return data.getConnectionInfo(id, handleId) || null;
    }
    return null;
  }, [id, data]);

  const promptConnection = getConnInfo('prompt-in');
  const hasPromptConnection = typeof data.hasConnection === 'function' && data.hasConnection(id, 'prompt-in');
  const imageConnection = getConnInfo('image-in');
  const hasImageConnection = typeof data.hasConnection === 'function' && data.hasConnection(id, 'image-in');

  const handleGenerate = useCallback(async () => {
    const prompt = (typeof data.resolveInput === 'function' ? data.resolveInput(id, 'prompt-in') : null) || data.inputPrompt || '';
    if (!prompt) return;

    start('Submitting generation request...');
    update({ outputImage: null, outputError: null });

    try {
      const params: any = { prompt };

      if (showImageIn) {
        let images = typeof data.resolveInput === 'function' ? data.resolveInput(id, 'image-in') : null;
        if (!images?.length && data.localImage) images = [data.localImage];
        if (images?.length) params.image_urls = images;
      }

      const ar = (typeof data.resolveInput === 'function' ? data.resolveInput(id, 'aspect-ratio-in') : null) || localAspect;
      if (ar && ar !== 'Auto') params.aspect_ratio = ar;

      const res = (typeof data.resolveInput === 'function' ? data.resolveInput(id, 'resolution-in') : null) || localResolution;
      if (res) params.resolution = res;

      const num = (typeof data.resolveInput === 'function' ? data.resolveInput(id, 'num-images-in') : null) || localNumImages;
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
        const statusResult = await pollStatus(result.data.task_id, isKora ? 'realism' : 'fluid', 90, 2000, (attempt: number, maxAttempts: number) => {
          const p = 10 + Math.min(85, (attempt / maxAttempts) * 85);
          setProgress(p, `Generating... (${attempt}/${maxAttempts})`);
        });
        
        const generated = statusResult.data?.generated || [];
        complete('Generation complete');
        update({
          outputImage: generated[0] || null,
          outputImages: generated,
          inputPrompt: prompt,
        });

        // Spawn and connect ImageOutputNode
        if (generated.length > 0 && typeof data.onCreateNode === 'function') {
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
        if (generated.length > 0 && typeof data.onCreateNode === 'function') {
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
    } catch (err: any) {
      console.error('[GeneratorNode] Generation error:', err);
      fail(err);
      update({ outputError: err.message });
    }
  }, [id, data, update, isKora, showImageIn, localAspect, localResolution, localNumImages, start, setProgress, complete, fail]);

  const lastTrigger = useRef<any>(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  const sectionHeader = (label: string, handleId: string, handleType: 'target' | 'source', color: string, onAdd?: () => void, extra?: ReactNode) => (
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
        <span style={{ fontSize: 12, fontWeight: 600, color: text.primary }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {extra}
        {onAdd && (
          <button
            onClick={onAdd}
            style={{
              width: 20, height: 20, borderRadius: radius.full,
              background: 'transparent', border: `1px solid ${border.input}`,
              color: text.muted, fontSize: 14, cursor: 'pointer',
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

  const linkedBadges = (onUnlinkHandle: string) => (
    <>
      <span style={{
        fontSize: 9, color: '#3b82f6', padding: '2px 6px',
        background: 'rgba(59,130,246,0.1)', borderRadius: radius.sm,
      }}>linked</span>
      <button
        onClick={() => (data.onUnlink as Function)?.(id, onUnlinkHandle)}
        style={{
          fontSize: 9, color: '#ef4444', padding: '2px 6px',
          background: 'rgba(239,68,68,0.1)', borderRadius: radius.sm,
          border: `1px solid rgba(239,68,68,0.3)`, cursor: 'pointer',
        }}
      >
        unlink
      </button>
    </>
  );

  const connectionInfoBox = (connInfo: any) => (
    <div style={{
      background: 'rgba(59,130,246,0.1)', border: `1px solid rgba(59,130,246,0.2)`,
      borderRadius: radius.md, padding: `${sp[2]}px ${sp[4]}px`, marginBottom: sp[1],
      display: 'flex', alignItems: 'center', gap: sp[2],
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: radius.full,
        background: '#3b82f6', flexShrink: 0,
      }} />
      <span style={{ fontSize: 11, color: '#60a5fa' }}>
        {connInfo
          ? `Linked from ${connInfo.nodeLabel} \u2192 ${connInfo.handle}`
          : 'Linked from upstream node'}
      </span>
    </div>
  );

  const pill = (label: string, isActive: boolean, onClick: () => void, activeColor?: string) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        padding: '4px 12px', fontSize: 11, fontWeight: isActive ? 600 : 400,
        borderRadius: radius.pill, border: 'none', cursor: 'pointer',
        background: isActive ? (activeColor || text.accent) : control.pillInactiveBg,
        color: isActive ? text.primary : control.pillInactiveText,
      }}
    >
      {label}
    </button>
  );

  return (
    <NodeShell data={data}
      label={(data.label as string) || (isKora ? 'Kora Reality' : 'Nano Banana 2 Edit')}
      dotColor={isKora ? CATEGORY_COLORS.vision : CATEGORY_COLORS.imageGeneration}
      selected={selected}
      onDisconnect={disconnectNode}
      onGenerate={handleGenerate}
      isGenerating={isActive}
      hasError={!!data.outputError && !isActive}
    >

      {/* ── Image Output Handle (top, aligned with image-in) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        marginBottom: 4,
      }}>
        <span style={{ fontSize: 10, color: text.muted, marginRight: sp[1] }}>image</span>
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
      {sectionHeader('Prompt', 'prompt-in', 'target', getHandleColor('prompt-in'), undefined,
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <AutoPromptButton id={id} data={data} update={update} imageKey="image-in" localImageKey="localImage" />
          <ImprovePromptButton id={id} data={data} update={update} type="image" />
          {hasPromptConnection ? linkedBadges('prompt-in') : null}
        </div>
      )}
      {hasPromptConnection ? (
        connectionInfoBox(promptConnection)
      ) : (
        <textarea
          value={(data.inputPrompt as string) || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder="Enter prompt..."
          rows={2}
          style={textareaStyle as any}
        />
      )}

      {/* ── 2. Aspect Ratio Section ── */}
      {sectionHeader('Aspect Ratio', 'aspect-ratio-in', 'target', getHandleColor('aspect-ratio-in'),
        () => (data.onAddToInput as Function)?.('aspect_ratio', id, 'aspect-ratio-in')
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
        {aspects.map((a) => pill(a, localAspect === a, () => update({ localAspectRatio: a }), text.accent))}
      </div>

      {/* ── 3. Images Section (Nano Banana only) ── */}
      {showImageIn && (
        <>
          {sectionHeader('Images', 'image-in', 'target', getHandleColor('image-in'), undefined,
            hasImageConnection ? linkedBadges('image-in') : (
              <button
                onClick={() => (data.onAddToInput as Function)?.('image_urls', id, 'image-in')}
                style={{
                  width: 20, height: 20, borderRadius: radius.full,
                  background: 'transparent', border: `1px solid ${border.input}`,
                  color: text.muted, fontSize: 14, cursor: 'pointer',
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
        () => (data.onAddToInput as Function)?.('resolution', id, 'resolution-in')
      )}
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {resolutions.map((r) => pill(r, localResolution === r, () => update({ localResolution: r }), text.accent))}
      </div>

      {/* ── 5. Num Images Section ── */}
      {sectionHeader('Num Images', 'num-images-in', 'target', getHandleColor('num-images-in'),
        () => (data.onAddToInput as Function)?.('num_images', id, 'num-images-in')
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <input
          type="range"
          min={1}
          max={4}
          value={localNumImages}
          onChange={(e) => update({ localNumImages: Number(e.target.value) })}
          style={{ flex: 1, accentColor: text.accent }}
        />
        <span style={{ fontSize: 12, color: text.primary, minWidth: 14, textAlign: 'right' }}>
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
            width: 10, height: 10, borderRadius: radius.full,
            background: isKora ? CATEGORY_COLORS.vision : CATEGORY_COLORS.imageGeneration, flexShrink: 0,
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: text.primary }}>Generated Output</span>
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
        background: surface.sunken,
        borderRadius: radius.md,
        border: `1px solid ${border.subtle}`,
        minHeight: 80,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {isActive ? (
          <div style={{
            width: 28, height: 28, border: `3px solid ${border.subtle}`,
            borderTop: `3px solid ${text.accent}`, borderRadius: radius.full,
            animation: 'spin 1s linear infinite',
          }} />
        ) : data.outputImage ? (
          <img
            src={data.outputImage as string}
            alt="generated"
            style={{ width: '100%', display: 'block', borderRadius: radius.md }}
          />
        ) : data.outputError ? (
          <div style={{ padding: sp[3], textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: text.error, lineHeight: 1.4, wordBreak: 'break-word' }}>
              {data.outputError as string}
            </div>
            <div style={{ fontSize: 9, color: text.muted, marginTop: sp[2] }}>
              Check browser console for full error details
            </div>
          </div>
        ) : (
          <span style={{ fontSize: 11, color: text.muted, padding: sp[4], textAlign: 'center' }}>
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
};

export default GeneratorNode;
