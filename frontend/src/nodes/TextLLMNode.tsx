import React, { useCallback, useState, useEffect, useRef, type FC } from 'react';
import { Position, Handle, type Node, type NodeProps } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  PromptInput,
  useNodeConnections,
  CATEGORY_COLORS,
  getHandleColor,
  text,
  surface,
  border,
  radius,
  sp,
  font,
} from './shared';
// @ts-ignore
import { sendChat } from '../utils/api';

/**
 * TextLLMNode - Text analysis and generation using Claude
 */
const TextLLMNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { update, resolve, conn, disconnectNode } = useNodeConnections(id, data);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const promptConn = conn('prompt-in');
  const systemConn = conn('system-in');

  const handleRun = useCallback(async () => {
    const prompt = resolve.text('prompt-in', data.localPrompt);
    const system = resolve.text('system-in', data.systemDirections);
    
    if (!prompt) return;

    setIsGenerating(true);
    update({ resultText: '' });

    try {
      const result = await sendChat(prompt, [], system);
      
      if (result.error) {
        update({ resultText: `Error: ${result.error}` });
      } else {
        update({ resultText: result.response || 'No response returned.' });
      }
    } catch (err: any) {
      update({ resultText: `Error: ${err.message}` });
    } finally {
      setIsGenerating(false);
    }
  }, [data.localPrompt, data.systemDirections, resolve, update]);

  // Listen for external trigger
  const lastTrigger = useRef<any>(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleRun();
    }
  }, [data.triggerGenerate, handleRun]);

  return (
    <NodeShell data={data}
      label={(data.label as string) || 'Claude Sonnet 4'}
      dotColor="#f97316"
      selected={selected}
      onDisconnect={disconnectNode}
      onGenerate={handleRun}
      isGenerating={isGenerating}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        
        {/* System Prompt */}
        <SectionHeader 
          label="System" 
          handleId="system-in" 
          handleType="target" 
          color={getHandleColor('system-in')}
          isConnected={systemConn.connected}
        />
        <ConnectedOrLocal connected={systemConn.connected} connInfo={systemConn.info}>
          <PromptInput
            value={(data.systemDirections as string) || ''}
            onChange={(v) => update({ systemDirections: v })}
            placeholder="You are a helpful assistant..."
            rows={2}
          />
        </ConnectedOrLocal>

        {/* User Prompt */}
        <SectionHeader 
          label="Prompt" 
          handleId="prompt-in" 
          handleType="target" 
          color={getHandleColor('prompt-in')}
          isConnected={promptConn.connected}
        />
        <ConnectedOrLocal connected={promptConn.connected} connInfo={promptConn.info}>
          <PromptInput
            value={(data.localPrompt as string) || ''}
            onChange={(v) => update({ localPrompt: v })}
            placeholder="Enter your prompt..."
            rows={3}
          />
        </ConnectedOrLocal>

        {/* Output */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 4,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: getHandleColor('text-out'),
            }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: text.secondary }}>RESPONSE</span>
          </div>
          <Handle
            type="source"
            position={Position.Right}
            id="text-out"
            style={{
              width: 10, height: 10, borderRadius: '50%',
              background: getHandleColor('text-out'), border: 'none',
              position: 'relative', right: -12, transform: 'none',
            }}
          />
        </div>
        
        <div style={{
          background: surface.sunken,
          borderRadius: radius.md,
          padding: 8,
          fontSize: 12,
          color: text.primary,
          minHeight: 60,
          maxHeight: 200,
          overflowY: 'auto',
          border: `1px solid ${border.subtle}`,
          whiteSpace: 'pre-wrap',
        }}>
          {isGenerating ? (
            <span style={{ color: '#3b82f6' }}>Thinking...</span>
          ) : (
            (data.resultText as string) || <span style={{ color: text.muted }}>Response will appear here...</span>
          )}
        </div>
      </div>
    </NodeShell>
  );
};

export default TextLLMNode;
