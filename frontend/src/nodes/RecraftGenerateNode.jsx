import { useCallback, useRef, useEffect, useState } from 'react';
import {
  NodeShell, SectionHeader, ConnectedOrLocal, PromptInput, OutputHandle, OutputPreview, useNodeConnections, CATEGORY_COLORS, getHandleColor,
} from './shared';
import { NodeCapabilities } from './nodeCapabilities';
import { generateRecraftImage } from '../utils/api';

export default function RecraftGenerateNode({ id, data, selected }) {
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(async () => {
    const prompt = resolve.text('prompt-in', data.inputPrompt);
    if (!prompt) return;
    setIsGenerating(true);
    update({ outputImage: null, outputError: null });
    try {
      const result = await generateRecraftImage({ prompt, model: data.model || 'recraftv4', size: data.size || '1:1' });
      if (result.data?.length) {
        update({ outputImage: result.data[0].url, inputPrompt: prompt });
      }
    } catch (err) {
      update({ outputError: err.message });
    } finally {
      setIsGenerating(false);
    }
  }, [id, data, update, resolve]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  const ACCENT = CATEGORY_COLORS.imageGeneration;

  return (
    <div>
      <NodeShell data={data} label="Recraft Gen" dotColor={ACCENT} selected={selected} onGenerate={handleGenerate} isGenerating={isGenerating} downloadUrl={data.outputImage || undefined} onDisconnect={disconnectNode} capabilities={[NodeCapabilities.IMAGE_GENERATE, NodeCapabilities.OUTPUT_IMAGE]}>
        <OutputHandle label="image" id="output" color={getHandleColor('output')} />
        <SectionHeader label="Prompt" handleId="prompt-in" handleType="target" color={getHandleColor('prompt-in')} isConnected={conn('prompt-in').connected} onUnlink={() => data.onUnlink?.(id, 'prompt-in')} />
        
        <div style={{ position: 'relative' }}>
          <ConnectedOrLocal connected={conn('prompt-in').connected} connInfo={conn('prompt-in').info}>
            <PromptInput value={data.inputPrompt || ''} onChange={(v) => update({ inputPrompt: v })} placeholder="Describe your image..." />
          </ConnectedOrLocal>
        </div>

        <OutputPreview output={data.outputImage} label="Recraft Output" accentColor={ACCENT} isLoading={isGenerating} />
      </NodeShell>
    </div>
  );
}
