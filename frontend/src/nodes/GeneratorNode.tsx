import React, { useCallback, useState, useEffect, useRef, type FC } from 'react';
import { Position, Handle, type Node, type NodeProps } from '@xyflow/react';
import {
  NodeShell, SectionHeader, ConnectedOrLocal, PromptInput, OutputHandle, OutputPreview, useNodeConnections, CATEGORY_COLORS, getHandleColor, text, radius,
} from './shared';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';
import { generateImage, generateKora } from '../utils/api';
import type { GeneratorNodeData } from '../types';
import { NodeCapabilities } from './nodeCapabilities';

const GeneratorNode: FC<NodeProps<Node<GeneratorNodeData>>> = ({ id, data, selected }) => {
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);
  const { progress, status, message, start, complete, fail, isActive } = useNodeProgress({
    onProgress: (state: any) => { update({ executionProgress: state.progress, executionStatus: state.status, executionMessage: state.message }); },
  });

  const isKora = data.generatorType === 'kora';

  const handleGenerate = useCallback(async () => {
    const prompt = resolve.text('prompt-in', data.inputPrompt);
    if (!prompt) return;
    start('Submitting request...');
    update({ outputImage: null, outputError: null });
    try {
      const genFn = isKora ? generateKora : generateImage;
      const result = await genFn({ prompt });
      if (result.data?.generated?.length) {
        complete('Done');
        update({ outputImage: result.data.generated[0], inputPrompt: prompt });
      }
    } catch (err: any) {
      fail(err);
      update({ outputError: err.message });
    }
  }, [id, data, update, isKora, start, complete, fail, resolve]);

  const lastTrigger = useRef<any>(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  const ACCENT = isKora ? CATEGORY_COLORS.vision : CATEGORY_COLORS.imageGeneration;

  return (
    <div>
      <NodeShell data={data} label={(data.label as string) || (isKora ? 'Kora Reality' : 'Nano Banana 2 Edit')} dotColor={ACCENT} selected={selected} onDisconnect={disconnectNode} onGenerate={handleGenerate} isGenerating={isActive} hasError={!!data.outputError && !isActive} downloadUrl={data.outputImage || undefined} capabilities={[NodeCapabilities.IMAGE_GENERATE, NodeCapabilities.OUTPUT_IMAGE]}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Handles Area */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Handle type="target" position={Position.Left} id="image-in" style={{ position: 'relative', left: -22, top: 0, background: getHandleColor('image-in') }} />
              <span style={{ fontSize: 10, color: text.muted, marginLeft: -12 }}>image-in</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: text.muted, marginRight: -12 }}>output</span>
              <OutputHandle label="" id="output" style={{ position: 'relative', right: -22, top: 0 }} />
            </div>
          </div>

          <SectionHeader label="Prompt" handleId="prompt-in" handleType="target" color={getHandleColor('prompt-in')} isConnected={conn('prompt-in').connected} onUnlink={() => data.onUnlink?.(id, 'prompt-in')}
            extra={<div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><ImprovePromptButton id={id} data={data} update={update} type="image" /></div>}
          />
          
          <div style={{ position: 'relative' }}>
            <ConnectedOrLocal connected={conn('prompt-in').connected} connInfo={conn('prompt-in').info}>
              <PromptInput value={(data.inputPrompt as string) || ''} onChange={(v) => update({ inputPrompt: v })} placeholder="Enter prompt..." rows={2} />
            </ConnectedOrLocal>
          </div>

          <NodeProgress progress={progress} status={status} message={message} />
          <OutputPreview isLoading={isActive} output={data.outputImage} error={data.outputError} accentColor={ACCENT} label="Generation Output" />
        </div>
      </NodeShell>
    </div>
  );
};

export default GeneratorNode;
