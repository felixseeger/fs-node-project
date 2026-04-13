import { useCallback, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Handle, Position } from '@xyflow/react';
import {
  NodeShell, SectionHeader, ConnectedOrLocal, PromptInput, OutputHandle, OutputPreview, useNodeConnections, CATEGORY_COLORS, getHandleColor, sp, font, text, surface, border, radius,
} from './shared';
import { generateRecraftImage } from '../utils/api';
import NodeGenerateButton from './NodeGenerateButton';

export default function RecraftGenerateNode({ id, data, selected }) {
  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, data);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <NodeShell data={data} label="Recraft Gen" dotColor={ACCENT} selected={selected} onGenerate={handleGenerate} isGenerating={isGenerating} downloadUrl={data.outputImage || undefined} onDisconnect={disconnectNode}>
        <OutputHandle label="image" id="output" color={getHandleColor('output')} />
        <SectionHeader label="Prompt" handleId="prompt-in" handleType="target" color={getHandleColor('prompt-in')} isConnected={conn('prompt-in').connected} onUnlink={() => data.onUnlink?.(id, 'prompt-in')} />
        
        <div style={{ position: 'relative' }}>
          <AnimatePresence>
            {(isHovered || isGenerating) && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }} transition={{ duration: 0.15 }}
                style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: 10, zIndex: 100 }}
              >
                <div style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', border: `1.5px solid ${border.active}80`, borderRadius: radius.md, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 12px 32px rgba(0,0,0,0.6)', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>RUN NODE</span>
                  <NodeGenerateButton onGenerate={handleGenerate} isGenerating={isGenerating} size="sm" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <ConnectedOrLocal connected={conn('prompt-in').connected} connInfo={conn('prompt-in').info}>
            <PromptInput value={data.inputPrompt || ''} onChange={(v) => update({ inputPrompt: v })} placeholder="Describe your image..." />
          </ConnectedOrLocal>
        </div>

        <OutputPreview output={data.outputImage} label="Recraft Output" accentColor={ACCENT} isLoading={isGenerating} />
      </NodeShell>
    </div>
  );
}
