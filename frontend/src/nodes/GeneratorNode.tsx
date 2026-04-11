import React, { useCallback, useState, useEffect, useRef, FC, ReactNode } from 'react';
import { Position, Handle, NodeProps } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  PromptInput,
  Pill,
  Slider,
  OutputHandle,
  OutputPreview,
  useNodeConnections,
  CATEGORY_COLORS,
  getHandleColor,
  sp,
  font,
  text,
  surface,
  border,
  radius,
  textareaStyle,
} from './shared';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
// @ts-ignore
import useNodeProgress from '../hooks/useNodeProgress';
// @ts-ignore
import { generateImage, generateKora, pollStatus } from '../utils/api';

const KORA_ASPECTS = ['Auto', '1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'];
const NANO_ASPECTS = ['Auto', '1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'];
const KORA_RESOLUTIONS = ['HD', '2K'];
const NANO_RESOLUTIONS = ['1K', '2K', '4K'];

/**
 * GeneratorNode - Core image generation node
 */
const GeneratorNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);
  
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

  const promptConn = conn('prompt-in');
  const imageConn = conn('image-in');
  const aspectConn = conn('aspect-ratio-in');
  const resolutionConn = conn('resolution-in');
  const numImagesConn = conn('num-images-in');

  const handleGenerate = useCallback(async () => {
    const prompt = resolve.text('prompt-in', data.inputPrompt);
    if (!prompt) return;

    start('Submitting generation request...');
    update({ outputImage: null, outputError: null });

    try {
      const params: any = { prompt };

      if (showImageIn) {
        let images = resolve.image('image-in', data.localImage);
        if (images?.length) params.image_urls = images;
      }

      const ar = resolve.text('aspect-ratio-in', localAspect);
      if (ar && ar !== 'Auto') params.aspect_ratio = ar;

      const res = resolve.text('resolution-in', localResolution);
      if (res) params.resolution = res;

      const num = resolve.text('num-images-in', localNumImages);
      if (num) params.num_images = Number(num);

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
  }, [id, data, update, isKora, showImageIn, localAspect, localResolution, localNumImages, start, setProgress, complete, fail, resolve]);

  const lastTrigger = useRef<any>(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  const ACCENT = isKora ? CATEGORY_COLORS.vision : CATEGORY_COLORS.imageGeneration;

  return (
    <NodeShell data={data}
      label={(data.label as string) || (isKora ? 'Kora Reality' : 'Nano Banana 2 Edit')}
      dotColor={ACCENT}
      selected={selected}
      onDisconnect={disconnectNode}
      onGenerate={handleGenerate}
      isGenerating={isActive}
      hasError={!!data.outputError && !isActive}
    >
      <OutputHandle id="output" label="image" color={getHandleColor('output')} />
      <OutputHandle id="prompt-out" label="prompt" color={getHandleColor('prompt-out')} />

      {/* ── 1. Prompt Section ── */}
      <SectionHeader 
        label="Prompt" 
        handleId="prompt-in" 
        handleType="target" 
        color={getHandleColor('prompt-in')}
        isConnected={promptConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'prompt-in')}
        extra={<div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <AutoPromptButton id={id} data={data} update={update} imageKey="image-in" localImageKey="localImage" />
          <ImprovePromptButton id={id} data={data} update={update} type="image" />
        </div>}
      />
      <ConnectedOrLocal connected={promptConn.connected} connInfo={promptConn.info}>
        <PromptInput
          value={(data.inputPrompt as string) || ''}
          onChange={(v) => update({ inputPrompt: v })}
          placeholder="Enter prompt..."
          rows={2}
        />
      </ConnectedOrLocal>

      {/* ── 2. Aspect Ratio Section ── */}
      <SectionHeader 
        label="Aspect Ratio" 
        handleId="aspect-ratio-in" 
        handleType="target" 
        color={getHandleColor('aspect-ratio-in')}
        isConnected={aspectConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'aspect-ratio-in')}
      />
      <ConnectedOrLocal connected={aspectConn.connected} connInfo={aspectConn.info}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
          {aspects.map((a) => (
            <Pill key={a} label={a} isActive={localAspect === a} onClick={() => update({ localAspectRatio: a })} accentColor={text.accent} />
          ))}
        </div>
      </ConnectedOrLocal>

      {/* ── 3. Images Section (Nano Banana only) ── */}
      {showImageIn && (
        <>
          <SectionHeader 
            label="Images" 
            handleId="image-in" 
            handleType="target" 
            color={getHandleColor('image-in')}
            isConnected={imageConn.connected}
            onUnlink={() => data.onUnlink?.(id, 'image-in')}
            onAdd={() => (data.onAddToInput as Function)?.('image_urls', id, 'image-in')}
          />
          {imageConn.connected && <ConnectedOrLocal connected={true} connInfo={imageConn.info} children={null} />}
        </>
      )}

      {/* ── 4. Resolution Section ── */}
      <SectionHeader 
        label="Resolution" 
        handleId="resolution-in" 
        handleType="target" 
        color={getHandleColor('resolution-in')}
        isConnected={resolutionConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'resolution-in')}
      />
      <ConnectedOrLocal connected={resolutionConn.connected} connInfo={resolutionConn.info}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          {resolutions.map((r) => (
            <Pill key={r} label={r} isActive={localResolution === r} onClick={() => update({ localResolution: r })} accentColor={text.accent} />
          ))}
        </div>
      </ConnectedOrLocal>

      {/* ── 5. Num Images Section ── */}
      <SectionHeader 
        label="Num Images" 
        handleId="num-images-in" 
        handleType="target" 
        color={getHandleColor('num-images-in')}
        isConnected={numImagesConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'num-images-in')}
      />
      <ConnectedOrLocal connected={numImagesConn.connected} connInfo={numImagesConn.info}>
        <Slider label="Images" value={localNumImages} onChange={(v) => update({ localNumImages: v })} min={1} max={4} accentColor={text.accent} />
      </ConnectedOrLocal>

      <NodeProgress progress={progress} status={status} message={message} />

      <OutputPreview
        isLoading={isActive}
        output={data.outputImage}
        error={data.outputError}
        accentColor={text.accent}
        label="Generation Output"
      />
    </NodeShell>
  );
};

export default GeneratorNode;
