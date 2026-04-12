import React, { useCallback, useState, useEffect, useRef, type FC } from 'react';
import { Position, Handle, type NodeProps } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  PromptInput,
  useNodeConnections,
  getHandleColor,
  text,
  surface,
  border,
  radius,
} from './shared';
// @ts-ignore
import { sendChat } from '../utils/api';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'strudel-repl': any;
    }
  }
}

const STRUDEL_SYSTEM_PROMPT = `You are a Strudel (Tidal Cycles port) live coding expert.
Translate the user's natural language prompt into valid JavaScript Strudel code.
DO NOT provide any markdown formatting, no \`\`\`javascript wrappers, no explanations. 
Output ONLY the raw JavaScript Strudel code.

# Strudel Basics:
- sound("bd hh sd hh"): Play drum samples sequentially
- note("c2 e3 g4").sound("piano"): Play piano notes
- n("0 1 2").scale("C:minor").sound("piano"): Play scale degrees
- lpf(800), vowel("a e i o"), gain("0.5 1"), delay(".5:.125:.8"), room(2): Audio effects
- rev(), jux(rev), slow(2), fast(2), ply(2), off(1/16, x => x.add(4)): Pattern effects
- $: note("c2 c3").sound("gm_synth_bass_1"): Parallel patterns (use $: for multiple tracks)
- setcpm(bpm/4): Set tempo

# Example Output for "Create a fast house beat with high hats and a driving bassline":
setcpm(120/4);
$: sound("bd*4, [- cp]*2, [- hh]*4").bank("RolandTR909");
$: note("c2 c3").sound("gm_synth_bass_1").lpf(saw.range(500, 2000).slow(4));
`;

const StrudelNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { update, resolve, conn, disconnectNode } = useNodeConnections(id, data);
  const [isGenerating, setIsGenerating] = useState(false);
  const replRef = useRef<any>(null);
  
  const promptConn = conn('prompt-in');

  const handleRun = useCallback(async () => {
    const prompt = resolve.text('prompt-in', data.localPrompt);
    
    if (!prompt) return;

    setIsGenerating(true);
    update({ resultCode: '' });

    try {
      const result = await sendChat(prompt, [], STRUDEL_SYSTEM_PROMPT, []);
      
      if (result.error) {
        update({ resultCode: `// Error: ${result.error}` });
      } else {
        const code = result.response || '';
        // Strip markdown backticks if Claude included them anyway
        const cleanCode = code.replace(/```(?:javascript|js|strudel)?\s*\n?/ig, '').replace(/```\s*$/g, '').trim();
        update({ resultCode: cleanCode });
      }
    } catch (err: any) {
      update({ resultCode: `// Error: ${err.message}` });
    } finally {
      setIsGenerating(false);
    }
  }, [data.localPrompt, resolve, update]);

  // Listen for external trigger
  const lastTrigger = useRef<any>(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleRun();
    }
  }, [data.triggerGenerate, handleRun]);
  
  // Sync the generated code with the repl
  useEffect(() => {
    if (replRef.current && data.resultCode) {
      // Small delay to ensure the web component has initialized its internal state
      setTimeout(() => {
         if (replRef.current) replRef.current.code = data.resultCode;
      }, 100);
    }
  }, [data.resultCode]);

  return (
    <NodeShell data={data}
      label={(data.label as string) || 'Strudel Code to Sound'}
      dotColor="#a855f7" // Audio color
      selected={selected}
      onDisconnect={disconnectNode}
      onGenerate={handleRun}
      isGenerating={isGenerating}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        
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
            placeholder="E.g. Create a fast house beat with high hats and a driving bassline"
            rows={3}
          />
        </ConnectedOrLocal>

        {/* Output Audio Handle */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 4,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#a855f7',
            }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: text.secondary }}>AUDIO OUT</span>
          </div>
          <Handle
            type="source"
            position={Position.Right}
            id="audio-out"
            style={{
              width: 10, height: 10, borderRadius: '50%',
              background: '#a855f7', border: 'none',
              position: 'relative', right: -12, transform: 'none',
            }}
          />
        </div>
        
        {/* REPL Embed */}
        <div style={{
          background: surface.sunken,
          borderRadius: radius.md,
          overflow: 'hidden',
          border: `1px solid ${border.subtle}`,
          minHeight: 120,
        }}>
          {isGenerating ? (
            <div style={{ padding: 12, color: '#3b82f6', fontSize: 12 }}>Generating pattern...</div>
          ) : (
            <strudel-repl 
               ref={replRef} 
               theme="dark"
               style={{ width: '100%', height: '100%', minHeight: '150px' }}
            >
              {(data.resultCode as string) || '// Strudel pattern will appear here'}
            </strudel-repl>
          )}
        </div>
      </div>
    </NodeShell>
  );
};

export default StrudelNode;
