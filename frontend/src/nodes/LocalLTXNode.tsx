import { useState, useRef, useEffect, useCallback, type FC } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHandleColor } from '../utils/handleTypes';
import {
  CATEGORY_COLORS, sp, font, text, surface, border, radius,
  useNodeConnections, OutputPreview, OutputHandle,
  NodeGenerateButton, NodeShell
} from './shared';
import axios from 'axios';

/**
 * LocalLTXNode interfaces with the LTX-Desktop CLI/Backend.
 * It allows triggering local video generations directly from the Node Layer.
 */
const LocalLTXNode: FC<NodeProps<Node<any>>> = ({ id, data, selected }) => {
  const { update, disconnectNode } = useNodeConnections(id, data);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isNodeHovered, setIsNodeHovered] = useState(false);
  const lastTrigger = useRef<number | null>(null);

  const handleGenerate = useCallback(async () => {
    const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
    if (!prompt || isGenerating) return;

    setIsGenerating(true);
    update({ outputVideo: null, outputError: null });

    try {
      // Interfacing with the FastAPI backend of LTX Desktop
      const response = await axios.post('http://127.0.0.1:8000/generation/video', {
        prompt,
        width: data.width || 768,
        height: data.height || 512,
        num_frames: data.frames || 121,
      });

      if (response.data?.job_id) {
        // TODO: replace mock polling
        // Since it's local and async, we'd normally poll. 
        // For the MVP, we assume the backend handles the job.
        update({ outputJobId: response.data.job_id });
      }
    } catch (err: any) {
      update({ outputError: err.message });
    } finally {
      setIsGenerating(false);
    }
  }, [id, data, update, isGenerating]);

  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <div onMouseEnter={() => setIsNodeHovered(true)} onMouseLeave={() => setIsNodeHovered(false)}>
      <NodeShell
        label={data.label || 'Local LTX Generator'}
        dotColor={CATEGORY_COLORS.videoGeneration}
        selected={selected || false}
        onDisconnect={disconnectNode}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        data={data}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Handle type="target" position={Position.Left} id="prompt-in" style={{ background: getHandleColor('prompt-in') }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: text.muted, marginRight: -12 }}>output</span>
              <OutputHandle label="" id="output" />
            </div>
          </div>

          <div style={{ background: surface.deep, border: `1px solid ${border.default}`, borderRadius: radius.md, padding: 12 }}>
             <textarea
              value={data.inputPrompt || ''}
              onChange={e => update({ inputPrompt: e.target.value })}
              placeholder="Local LTX prompt..."
              rows={3}
              style={{ width: '100%', background: 'transparent', border: 'none', color: text.primary, fontSize: 13, outline: 'none', resize: 'none' }}
            />
          </div>

          <div style={{ fontSize: 10, color: text.muted }}>
            Target: <code>http://127.0.0.1:8000</code>
          </div>

          <OutputPreview 
            output={data.outputVideo} 
            isLoading={isGenerating} 
            error={data.outputError} 
            type="video" 
            accentColor={CATEGORY_COLORS.videoGeneration} 
            label="Local Output" 
          />
        </div>
      </NodeShell>
    </div>
  );
};

export default LocalLTXNode;
