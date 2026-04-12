import React, { useCallback, useState, useEffect, useRef, type FC } from 'react';
import { Position, Handle, type Node, type NodeProps } from '@xyflow/react';
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
import { 
  musicGenerate, pollMusicStatus,
  soundEffectsGenerate, pollSoundEffectsStatus,
  voiceoverGenerate, pollVoiceoverStatus,
  sendChat 
} from '../utils/api';

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

const FRIENDLY_MODEL_LABELS: Record<string, string> = {
  'strudelNode': 'Strudel',
  'musicGeneration': 'Music Gen',
  'soundEffects': 'Sound Effects',
  'voiceover': 'Voiceover',
};

const AudioUniversalGeneratorNode: FC<NodeProps> = ({ id, data, selected }) => {
  const { update, resolve, disconnectNode } = useNodeConnections(id, data);
  const replRef = useRef<any>(null);
  
  // Progress tracking
  const {
    progress,
    status,
    message,
    start,
    setProgress,
    complete,
    fail,
    isActive,
  } = useNodeProgress({
    onProgress: (state: any) => {
      update({
        executionProgress: state.progress,
        executionStatus: state.status,
        executionMessage: state.message,
      });
    },
  });

  const models = (data.models as string[]) || ['strudelNode'];
  const activeModel = models[0] === 'Auto' ? 'strudelNode' : models[0];

  const handleGenerate = useCallback(async () => {
    const prompt = resolve.text('prompt-in', data.inputPrompt);
    if (!prompt) return;

    start(`Generating with ${FRIENDLY_MODEL_LABELS[activeModel] || activeModel}...`);
    update({ outputAudio: null, outputError: null, resultCode: '' });

    try {
      if (activeModel === 'strudelNode') {
        const result = await sendChat(prompt, [], STRUDEL_SYSTEM_PROMPT, []);
        if (result.error) {
          fail(new Error(result.error));
          update({ outputError: result.error, resultCode: `// Error: ${result.error}` });
        } else {
          const code = result.response || '';
          const cleanCode = code.replace(/```(?:javascript|js|strudel)?\s*\n?/ig, '').replace(/```\s*$/g, '').trim();
          complete('Generated code');
          update({ resultCode: cleanCode });
        }
      } else if (activeModel === 'musicGeneration') {
        const result = await musicGenerate({ prompt, music_length_seconds: data.localDuration || 15 });
        if (result.error) throw new Error(result.error.message || JSON.stringify(result.error));
        const taskId = result.task_id || result.data?.task_id;
        if (taskId) {
          const statusResult = await pollMusicStatus(taskId, 120, 3000, (p: number, msg: string) => {
            setProgress(p, msg);
          });
          complete('Done');
          update({ outputAudio: statusResult.data?.generated?.[0] || null });
        } else {
          complete('Done');
          update({ outputAudio: result.data?.generated?.[0] || null });
        }
      } else if (activeModel === 'soundEffects') {
        const result = await soundEffectsGenerate({ 
          text: prompt, 
          duration_seconds: data.localDuration || 5,
          loop: data.localLoop || false,
          prompt_influence: data.localPromptInfluence || 0.3
        });
        if (result.error) throw new Error(result.error.message || JSON.stringify(result.error));
        const taskId = result.task_id || result.data?.task_id;
        if (taskId) {
          const statusResult = await pollSoundEffectsStatus(taskId);
          complete('Done');
          update({ outputAudio: statusResult.data?.generated?.[0] || null });
        } else {
          complete('Done');
          update({ outputAudio: result.data?.generated?.[0] || null });
        }
      } else if (activeModel === 'voiceover') {
        const result = await voiceoverGenerate({
          text: prompt,
          voice_id: data.localVoiceId || '21m00Tcm4TlvDq8ikWAM',
          voice_settings: {
            stability: data.localStability || 0.5,
            similarity_boost: data.localSimilarityBoost || 0.2,
            style: data.localStyle || 0.0,
            use_speaker_boost: data.localUseSpeakerBoost !== false,
          }
        });
        if (result.error) throw new Error(result.error.message || JSON.stringify(result.error));
        const taskId = result.data?.task_id;
        if (taskId) {
          const statusResult = await pollVoiceoverStatus(taskId);
          complete('Done');
          update({ outputAudio: statusResult.data?.generated?.[0] || null });
        }
      } else {
        throw new Error(`Unsupported model: ${activeModel}`);
      }
    } catch (err: any) {
      console.error('[AudioUniversalGeneratorNode] Generation error:', err);
      fail(err);
      update({ outputError: err.message || String(err) });
    }
  }, [id, data, update, start, setProgress, complete, fail, resolve, activeModel]);

  const lastTrigger = useRef<any>(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  // Sync the generated code with the repl
  useEffect(() => {
    if (replRef.current && data.resultCode) {
      setTimeout(() => {
         if (replRef.current) replRef.current.code = data.resultCode;
      }, 100);
    }
  }, [data.resultCode]);

  return (
    <UniversalSimplifiedNodeChrome
      title={(data.label as string) || 'Universal Audio'}
      selected={selected}
      onRun={handleGenerate}
      isRunning={isActive}
      width={280}
      onDownload={data.outputAudio ? () => {
        const a = document.createElement('a');
        a.href = data.outputAudio as string;
        a.download = `audio-${Date.now()}.mp3`;
        a.click();
      } : undefined}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#a855f7' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: text.secondary, textTransform: 'uppercase' }}>
              AUDIO OUT
            </span>
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

        {/* Audio Output Player */}
        {data.outputAudio && activeModel !== 'strudelNode' && (
          <div style={{ marginTop: 8 }}>
            <audio controls src={data.outputAudio as string} style={{ width: '100%', height: 32 }} />
          </div>
        )}

        {/* REPL Embed for Strudel */}
        {activeModel === 'strudelNode' && (
          <div style={{
            background: surface.sunken,
            borderRadius: radius.md,
            overflow: 'hidden',
            border: `1px solid ${border.subtle}`,
            minHeight: 120,
            marginTop: 8,
          }}>
            {isActive ? (
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
        )}
      </div>
    </UniversalSimplifiedNodeChrome>
  );
};

export default AudioUniversalGeneratorNode;
