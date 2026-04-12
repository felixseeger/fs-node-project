import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  PromptInput,
  Pill,
  OutputHandle,
  OutputPreview,
  useNodeConnections,
  getHandleColor,
} from './shared';
import { reimagineFlux } from '../utils/api';
import ImageUploadBox from './ImageUploadBox';
import AutoPromptButton from './AutoPromptButton';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
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
  const { isActive, start, complete, fail, progress, status, message } = useNodeProgress();
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);

  const localImagination = data.localImagination || 'vivid';
  const localAspect = data.localAspect || 'original';

  const imageConn = conn('image-in');
  const promptConn = conn('prompt-in');
  const imaginationConn = conn('imagination-in');
  const aspectConn = conn('aspect-ratio-in');

  const handleReimagine = useCallback(async () => {
    let images = resolve.image('image-in', data.localImage);
    if (!images?.length) return;

    start('Reimagining image...');
    update({ outputImage: null, outputError: null });

    try {
      let imageBase64 = images[0];
      if (imageBase64.startsWith('data:')) imageBase64 = imageBase64.split(',')[1];

      const prompt = resolve.text('prompt-in', data.inputPrompt);

      const params = { image: imageBase64 };
      if (prompt) params.prompt = prompt;

      const imagination = resolve.text('imagination-in', localImagination);
      if (imagination) params.imagination = imagination;

      const aspectRatio = resolve.text('aspect-ratio-in', localAspect);
      if (aspectRatio && aspectRatio !== 'original') params.aspect_ratio = aspectRatio;

      const result = await reimagineFlux(params);

      if (result.error) {
        fail(new Error(result.error?.message || 'Reimagine failed'));
        update({ outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

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
  }, [id, data, update, localImagination, localAspect, start, complete, fail, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleReimagine();
    }
  }, [data.triggerGenerate, handleReimagine]);

  const ACCENT = '#10b981';

  return (
    <NodeShell data={data} label={data.label || 'Flux Reimagine'} dotColor={ACCENT} selected={selected} onGenerate={handleReimagine} isGenerating={isActive} downloadUrl={data.outputImage || undefined} onDisconnect={disconnectNode}>
      <OutputHandle id="output" label="image" color={getHandleColor('output')} />
      <OutputHandle id="prompt-out" label="prompt" color={getHandleColor('prompt-out')} />

      {/* ── 1. Image ── */}
      <SectionHeader 
        label="Image" 
        handleId="image-in" 
        handleType="target" 
        color={getHandleColor('image-in')}
        isConnected={imageConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'image-in')}
      />
      <ConnectedOrLocal connected={imageConn.connected} connInfo={imageConn.info}>
        <ImageUploadBox
          image={data.localImage || data.inputImagePreview || null}
          onImageChange={(img) => update({ localImage: img })}
          placeholder="Click or drag to upload image"
        />
      </ConnectedOrLocal>

      {/* ── 2. Prompt ── */}
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
          value={data.inputPrompt || ''}
          onChange={(v) => update({ inputPrompt: v })}
          placeholder="Optional: guide the reimagination (e.g., 'cyberpunk city at night')"
          rows={2}
        />
      </ConnectedOrLocal>

      {/* ── 3. Imagination ── */}
      <SectionHeader 
        label="Imagination" 
        handleId="imagination-in" 
        handleType="target" 
        color={getHandleColor('aspect-ratio-in')}
        isConnected={imaginationConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'imagination-in')}
      />
      <ConnectedOrLocal connected={imaginationConn.connected} connInfo={imaginationConn.info}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
          {IMAGINATIONS.map((im) => (
            <button 
              key={im.value} 
              className="nodrag nopan"
              onClick={() => update({ localImagination: im.value })} 
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                flex: 1, padding: '8px 6px', fontSize: 11, textAlign: 'center',
                borderRadius: 8, border: 'none', cursor: 'pointer',
                background: localImagination === im.value ? 'rgba(16,185,129,0.15)' : '#1a1a1a',
                borderLeft: localImagination === im.value ? `3px solid ${ACCENT}` : '3px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontWeight: localImagination === im.value ? 600 : 400, color: localImagination === im.value ? '#e0e0e0' : '#999', marginBottom: 2 }}>
                {im.label}
              </div>
              <div style={{ fontSize: 9, color: '#666' }}>{im.desc}</div>
            </button>
          ))}
        </div>
      </ConnectedOrLocal>

      {/* ── 4. Aspect Ratio ── */}
      <SectionHeader 
        label="Aspect Ratio" 
        handleId="aspect-ratio-in" 
        handleType="target" 
        color={getHandleColor('aspect-ratio-in')}
        isConnected={aspectConn.connected}
        onUnlink={() => data.onUnlink?.(id, 'aspect-ratio-in')}
      />
      <ConnectedOrLocal connected={aspectConn.connected} connInfo={aspectConn.info}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4,
          maxHeight: 60, overflowY: 'auto',
        }}>
          {ASPECT_RATIOS.map((a) => (
            <Pill key={a.value} label={a.label} isActive={localAspect === a.value} onClick={() => update({ localAspect: a.value })} accentColor={ACCENT} />
          ))}
        </div>
      </ConnectedOrLocal>

      <NodeProgress progress={progress} status={status} message={message} />

      <OutputPreview
        isLoading={isActive}
        output={data.outputImage}
        error={data.outputError}
        accentColor={ACCENT}
        label="Reimagined Output"
      />
    </NodeShell>
  );
}
