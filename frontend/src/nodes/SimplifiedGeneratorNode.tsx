import React, { useCallback, useState, useEffect, useRef, type FC } from 'react';
import { Position, Handle, type Node, type NodeProps } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UniversalSimplifiedNodeChrome,
  useNodeConnections,
  getHandleColor,
  text,
  surface,
  border,
  radius,
  sp,
  font,
} from './shared';
// @ts-ignore
import useNodeProgress from '../hooks/useNodeProgress';
// @ts-ignore
import { generateImage, pollStatus } from '../utils/api';
import type { GeneratorNodeData } from '../types';
import NodeGenerateButton from './NodeGenerateButton';

const SimplifiedGeneratorNode: FC<NodeProps<Node<GeneratorNodeData>>> = ({ id, data, selected }) => {
  const { update, resolve, disconnectNode } = useNodeConnections(id, data);
  const { progress, status, message, start, setProgress, complete, fail, isActive } = useNodeProgress({
    onProgress: (state: any) => { update({ executionProgress: state.progress, executionStatus: state.status, executionMessage: state.message }); },
  });

  const [isHovered, setIsHovered] = useState(false);

  const handleGenerate = useCallback(async () => {
    const prompt = resolve.text('prompt-in', data.inputPrompt);
    if (!prompt) return;
    start('Generating...');
    update({ outputImage: null, outputError: null });
    try {
      const result = await generateImage({ prompt, model: 'Nano Banana 2 Pro', aspect_ratio: data.localAspectRatio || '1:1' });
      if (result.data?.generated?.length) {
        complete('Done');
        update({ outputImage: result.data.generated[0], inputPrompt: prompt });
      }
    } catch (err: any) {
      fail(err);
      update({ outputError: err.message });
    }
  }, [id, data, update, start, complete, fail, resolve]);

  const lastTrigger = useRef<any>(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <UniversalSimplifiedNodeChrome
        title={(data.label as string) || 'Nano Banana 2 Pro'}
        selected={selected}
        onRun={handleGenerate}
        isRunning={isActive}
        width={280}
        onDownload={data.outputImage ? () => {} : undefined}
      >
        <div style={{ position: 'relative' }}>
          <AnimatePresence>
            {(isHovered || isActive) && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }} transition={{ duration: 0.15 }}
                style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: 10, zIndex: 100 }}
              >
                <div style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', border: `1.5px solid ${border.active}80`, borderRadius: radius.md, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 12px 32px rgba(0,0,0,0.6)', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>RUN NODE</span>
                  <NodeGenerateButton onGenerate={handleGenerate} isGenerating={isActive} size="sm" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Handle type="target" position={Position.Left} id="prompt-in" style={{ width: 12, height: 12, borderRadius: '50%', background: getHandleColor('prompt-in'), border: '2px solid #000', position: 'absolute', left: -22, top: 20 }} />
          <Handle type="source" position={Position.Right} id="output" style={{ width: 12, height: 12, borderRadius: '50%', background: getHandleColor('output'), border: '2px solid #000', position: 'absolute', right: -22, top: 20 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: 'rgba(0,0,0,0.2)', padding: 8, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ ...font.xs, color: text.secondary, fontWeight: 600 }}>PROMPT</span>
              <textarea className="nodrag nopan" value={(data.inputPrompt as string) || ''} onChange={(e) => update({ inputPrompt: e.target.value })} placeholder="What do you want to generate?" style={{ width: '100%', background: 'transparent', border: 'none', color: text.primary, ...font.sm, padding: 0, outline: 'none', resize: 'none', minHeight: 60 }} />
            </div>
            {data.outputImage && (
              <div style={{ borderRadius: 8, overflow: 'hidden', border: `1px solid ${border.subtle}`, position: 'relative', aspectRatio: '1', background: surface.sunken }}>
                <img src={data.outputImage as string} alt="Generated" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        </div>
      </UniversalSimplifiedNodeChrome>
    </div>
  );
};

export default SimplifiedGeneratorNode;
