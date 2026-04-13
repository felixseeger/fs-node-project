import { useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  NodeShell,
  PromptInput,
  TextInput,
  OutputHandle,
  OutputPreview,
  useNodeConnections,
  CATEGORY_COLORS,
  getHandleColor,
  sp,
  font,
  text,
} from './shared';
import { NodeCapabilities } from './nodeCapabilities';
import { useAsyncPolling } from '../hooks/useAsyncPolling';

export default function LtxVideoNode({ id, data, selected }: any) {
  const { resolve, update } = useNodeConnections(id, data);
  
  const { status, resultUrl, error, execute } = useAsyncPolling(
    '/api/vfx/ltx/generate',
    '/api/vfx/job/:id/status'
  );

  const incomingImages = resolve.image('image-in') || [];
  const sourceImage = incomingImages[0];

  const handleGenerate = async () => {
    const prompt = data.prompt || '';
    if (!prompt) return;

    const payload: any = {
      prompt,
      width: Number(data.width) || 768,
      height: Number(data.height) || 512,
      frames: Number(data.frames) || 121,
    };

    if (sourceImage) {
      payload.image_url = sourceImage;
    }

    await execute(payload);
  };

  // Update node data when polling completes
  useEffect(() => {
    if (status === 'completed' && resultUrl) {
      update({ outputVideo: resultUrl });
    }
    if (status === 'failed' && error) {
      update({ outputError: error });
    }
  }, [status, resultUrl, error, update]);

  // Trigger generation from external source
  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate]);

  const isExecuting = status === 'loading';
  const hasError = status === 'failed';

  const capabilities = [NodeCapabilities.VIDEO_GENERATE, NodeCapabilities.OUTPUT_VIDEO];

  return (
    <NodeShell
      label="LTX Video AI"
      selected={selected}
      // @ts-ignore
      capabilities={capabilities}
      dotColor={CATEGORY_COLORS.videoGeneration}
      isGenerating={isExecuting}
      hasError={hasError}
      onGenerate={handleGenerate}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        id="image-in" 
        style={{ 
          background: getHandleColor('image'),
          width: 12,
          height: 12,
          border: '2px solid #000',
          left: -6
        }} 
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: sp[3], padding: `${sp[2]}px 0` }}>
        <PromptInput
          value={data.prompt || ''}
          onChange={(v) => update({ prompt: v })}
          placeholder="A futuristic city with flying cars..."
          rows={3}
        />

        <div style={{ display: 'flex', gap: sp[2] }}>
          <div style={{ flex: 1 }}>
            <span style={{ ...font.xs, color: text.secondary, marginBottom: 4, display: 'block' }}>Width</span>
            <TextInput
              type="number"
              value={data.width || '768'}
              onChange={(v) => update({ width: v })}
              placeholder="768"
            />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ ...font.xs, color: text.secondary, marginBottom: 4, display: 'block' }}>Height</span>
            <TextInput
              type="number"
              value={data.height || '512'}
              onChange={(v) => update({ height: v })}
              placeholder="512"
            />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ ...font.xs, color: text.secondary, marginBottom: 4, display: 'block' }}>Frames</span>
            <TextInput
              type="number"
              value={data.frames || '121'}
              onChange={(v) => update({ frames: v })}
              placeholder="121"
            />
          </div>
        </div>

        <OutputPreview
          output={data.outputVideo}
          isLoading={isExecuting}
          error={data.outputError || error}
          type="video"
          label="Generated Video"
          accentColor={CATEGORY_COLORS.videoGeneration}
        />
      </div>

      <OutputHandle id="video-out" type="video" />
    </NodeShell>
  );
}
