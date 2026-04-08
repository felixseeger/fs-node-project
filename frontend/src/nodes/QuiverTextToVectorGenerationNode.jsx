import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import {
  SectionHeader,
  ConnectedOrLocal,
  PromptInput,
  OutputHandle,
  OutputPreview
} from './shared';
import useNodeConnections from './useNodeConnections';
import { quiverTextToSvg } from '../utils/api';
import { CATEGORY_COLORS } from './nodeTokens';
import { addToHistory } from '../services/historyService';

export default function QuiverTextToVectorGenerationNode({ id, data, selected }) {
  const { hasConnection, getConnInfo } = useNodeConnections(id, data);

  const update = useCallback((patch) => {
    data.onUpdate?.(id, patch);
  }, [id, data]);

  const [localPrompt, setLocalPrompt] = useState(data.localPrompt || '');

  const handleGenerate = useCallback(async () => {
    let prompt = data.resolveInput?.(id, 'prompt-in');
    if (!prompt) prompt = localPrompt;
    if (!prompt) return;

    update({ outputImage: null, isLoading: true, outputError: null });

    try {
      const params = {
        model: 'arrow-preview', // currently the only model documented
        stream: false,
        prompt: prompt,
      };

      const result = await quiverTextToSvg(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        return;
      }

      const generatedData = result.data?.data?.[0];
      if (generatedData?.svg) {
        const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(generatedData.svg)}`;
        update({
          outputImage: svgDataUri,
          isLoading: false,
          outputError: null,
        });
        // Register in history
        addToHistory({
          type: 'svg',
          url: svgDataUri,
          prompt: prompt,
          nodeType: 'quiverTextToVector',
          nodeLabel: data.label || 'Quiver Text to Vector',
        });
      } else {
        update({ isLoading: false });
      }
    } catch (err) {
      console.error('Quiver text to svg error:', err);
      update({ isLoading: false, outputError: err.message });
    }
  }, [id, data, localPrompt, update]);

  const lastTrigger = useRef(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  const primaryColor = CATEGORY_COLORS.imageGeneration;

  return (
    <NodeShell data={data}
      label={data.label || 'Quiver Text to Vector'}
      dotColor={primaryColor}
      selected={selected}
      onGenerate={handleGenerate}
      isGenerating={data.isLoading}
      onDisconnect={(h) => data.onUnlink?.(id, h)}
      downloadUrl={data.outputImage}
      downloadType="svg"
    >
      <OutputHandle id="image-out" label="svg out" color={primaryColor} />

      <SectionHeader
        label="Prompt (Required)"
        handleId="prompt-in"
        handleType="target"
        color={CATEGORY_COLORS.vision} // usually orange/text
        isConnected={hasConnection('prompt-in')}
        onUnlink={() => data.onUnlink?.(id, 'prompt-in')}
      />
      <ConnectedOrLocal
        isConnected={hasConnection('prompt-in')}
        connLabel={getConnInfo('prompt-in') ? `Linked from ${getConnInfo('prompt-in').nodeLabel}` : ''}
      >
        <PromptInput
          value={localPrompt}
          onChange={(v) => { setLocalPrompt(v); update({ localPrompt: v }); }}
          placeholder="Describe your SVG..."
        />
      </ConnectedOrLocal>

      <OutputPreview
        isLoading={data.isLoading}
        output={data.outputImage}
        error={data.outputError}
        accentColor={primaryColor}
        label="Generated SVG"
      />
    </NodeShell>
  );
}
