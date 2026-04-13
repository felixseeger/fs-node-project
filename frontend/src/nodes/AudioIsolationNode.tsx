import React, { useCallback, useEffect, useRef } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import {
  NodeShell,
  SectionHeader,
  ConnectedOrLocal,
  PromptInput,
  TextInput,
  Slider,
  Toggle,
  Pill,
  OutputHandle,
  OutputPreview,
  useNodeConnections,
  getHandleColor,
} from './shared';
import { NodeCapabilities } from './nodeCapabilities';
import { audioIsolationGenerate, pollAudioIsolationStatus } from '../utils/api';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';
import type { AudioIsolationNodeData } from '../types';

export default function AudioIsolationNode({ id, data, selected }: NodeProps<Node<AudioIsolationNodeData>>) {
  const nodeData = data;
  const progress = useNodeProgress();

  const localInputType = nodeData.localInputType || 'audio'; // 'audio' or 'video'
  const localRerankingCandidates = nodeData.localRerankingCandidates || 1;
  const localPredictSpans = nodeData.localPredictSpans ?? false;
  const localSampleFps = nodeData.localSampleFps || 2;
  const localX1 = nodeData.localX1 || 0;
  const localY1 = nodeData.localY1 || 0;
  const localX2 = nodeData.localX2 || 0;
  const localY2 = nodeData.localY2 || 0;

  const { update, conn, resolve, disconnectNode } = useNodeConnections(id, nodeData);

  const promptConn = conn('prompt-in');
  const mediaConn = conn(localInputType === 'audio' ? 'audio-in' : 'video-in');

  const handleGenerate = useCallback(async () => {
    const prompt = resolve.text('prompt-in', nodeData.inputPrompt);
    if (!prompt) return;

    let mediaUrls;
    if (localInputType === 'audio') {
      mediaUrls = resolve.audio('audio-in', nodeData.localAudio);
    } else {
      mediaUrls = resolve.video('video-in', nodeData.localVideo);
    }

    if (!mediaUrls?.length) return;

    progress.start('Initializing...');
    update({ outputAudio: null, isLoading: true });

    try {
      const params: any = {
        description: prompt,
        reranking_candidates: localRerankingCandidates,
        predict_spans: localPredictSpans,
      };

      if (localInputType === 'audio') {
        params.audio = mediaUrls[0];
      } else {
        params.video = mediaUrls[0];
        params.sample_fps = localSampleFps;
        if (localX1 > 0 || localX2 > 0 || localY1 > 0 || localY2 > 0) {
          params.x1 = localX1;
          params.y1 = localY1;
          params.x2 = localX2;
          params.y2 = localY2;
        }
      }

      const result: any = await audioIsolationGenerate(params);

      if (result.error) {
        update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
        progress.fail(result.error?.message || 'Failed');
        return;
      }

      const taskId = result.task_id || result.data?.task_id;
      if (taskId) {
        progress.setProgress(30, 'Processing...');
        const status: any = await pollAudioIsolationStatus(taskId, (p: number, message: string) => {
          progress.setProgress(30 + p * 0.6, message);
        });
        const generated = status.data?.generated || [];
        progress.complete('Complete');
        update({
          outputAudio: generated[0] || null,
          isLoading: false,
          outputError: null,
        });
      } else if (result.data?.generated?.length) {
        progress.complete('Complete');
        update({
          outputAudio: result.data.generated[0],
          isLoading: false,
          outputError: null,
        });
      } else {
        progress.complete('Complete');
        update({ isLoading: false });
      }
    } catch (err: any) {
      console.error('Audio isolation error:', err);
      progress.fail(err.message);
      update({ isLoading: false, outputError: err.message });
    }
  }, [id, nodeData, update, localInputType, localRerankingCandidates, localPredictSpans, localSampleFps, localX1, localY1, localX2, localY2, progress, resolve]);

  const lastTrigger = useRef<number | null>(null);
  useEffect(() => {
    if (nodeData.triggerGenerate && nodeData.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = nodeData.triggerGenerate;
      handleGenerate();
    }
  }, [nodeData.triggerGenerate, handleGenerate]);

  const ACCENT = '#a855f7'; // Purple for audio

  return (
    <NodeShell data={nodeData} label={nodeData.label || 'SAM Audio Isolation'} dotColor={ACCENT} selected={selected} onDisconnect={disconnectNode} onGenerate={handleGenerate} isGenerating={progress.isActive} downloadUrl={nodeData.outputAudio || undefined} downloadType="audio" capabilities={[NodeCapabilities.AUDIO_ISOLATION, NodeCapabilities.OUTPUT_AUDIO]}>
      <OutputHandle id="output" label="audio" type="audio" color={getHandleColor('audio-out')} />

      {/* ── Input Type Selection ── */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <Pill label="Audio Input" isActive={localInputType === 'audio'} onClick={() => update({ localInputType: 'audio' })} accentColor={getHandleColor('audio-in')} />
          <Pill label="Video Input" isActive={localInputType === 'video'} onClick={() => update({ localInputType: 'video' })} accentColor={getHandleColor('video-in')} />
        </div>
      </div>

      {/* ── 1. Media Input ── */}
      {localInputType === 'audio' ? (
        <>
          <SectionHeader 
            label="Input Audio (Required)" 
            handleId="audio-in" 
            handleType="target" 
            color={getHandleColor('audio-in')}
            isConnected={mediaConn.connected}
            onUnlink={() => nodeData.onUnlink?.(id, 'audio-in')}
          />
          <ConnectedOrLocal connected={mediaConn.connected} connInfo={mediaConn.info}>
            <TextInput
              value={nodeData.localAudio || ''}
              onChange={(v) => update({ localAudio: v })}
              placeholder="Audio URL (WAV, MP3...)"
            />
          </ConnectedOrLocal>
        </>
      ) : (
        <>
          <SectionHeader 
            label="Input Video (Required)" 
            handleId="video-in" 
            handleType="target" 
            color={getHandleColor('video-in')}
            isConnected={mediaConn.connected}
            onUnlink={() => nodeData.onUnlink?.(id, 'video-in')}
          />
          <ConnectedOrLocal connected={mediaConn.connected} connInfo={mediaConn.info}>
            <TextInput
              value={nodeData.localVideo || ''}
              onChange={(v) => update({ localVideo: v })}
              placeholder="Video URL (MP4, MOV...)"
            />
          </ConnectedOrLocal>
        </>
      )}

      {/* ── 2. Description ── */}
      <SectionHeader 
        label="Description (Required)" 
        handleId="prompt-in" 
        handleType="target" 
        color={getHandleColor('prompt-in')}
        isConnected={promptConn.connected}
        onUnlink={() => nodeData.onUnlink?.(id, 'prompt-in')}
        extra={<ImprovePromptButton id={id} data={nodeData} update={update as any} type="audio" />}
      />
      <ConnectedOrLocal connected={promptConn.connected} connInfo={promptConn.info}>
        <PromptInput
          value={nodeData.inputPrompt || ''}
          onChange={(v) => update({ inputPrompt: v })}
          placeholder="e.g. A person speaking, Dog barking..."
          rows={3}
        />
      </ConnectedOrLocal>

      {/* ── 3. Settings ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
        padding: 12, marginTop: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
          Isolation Settings
        </div>

        <Slider label="Quality (Reranking)" value={localRerankingCandidates} onChange={(v) => update({ localRerankingCandidates: v })} min={1} max={8} accentColor={ACCENT} />
        <Toggle label="Event Detection" value={localPredictSpans} onChange={(v) => update({ localPredictSpans: v })} accentColor={ACCENT} />

        {localInputType === 'video' && (
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 11, color: '#999', marginBottom: 6, fontWeight: 600 }}>Video Settings</div>
            <Slider label="Sample FPS" value={localSampleFps} onChange={(v) => update({ localSampleFps: v })} min={1} max={5} accentColor={getHandleColor('video-in')} />

            <div style={{ fontSize: 10, color: '#888', marginBottom: 4 }}>Bounding Box (0 = full frame)</div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              <TextInput type="number" value={String(localX1)} onChange={(v) => update({ localX1: Number(v) })} placeholder="X1" />
              <TextInput type="number" value={String(localY1)} onChange={(v) => update({ localY1: Number(v) })} placeholder="Y1" />
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <TextInput type="number" value={String(localX2)} onChange={(v) => update({ localX2: Number(v) })} placeholder="X2" />
              <TextInput type="number" value={String(localY2)} onChange={(v) => update({ localY2: Number(v) })} placeholder="Y2" />
            </div>
          </div>
        )}
      </div>

      <NodeProgress 
        progress={progress.progress} 
        status={progress.status} 
        message={progress.message} 
      />


      <OutputPreview
        isLoading={progress.isActive}
        output={nodeData.outputAudio}
        error={nodeData.outputError}
        type="audio"
        accentColor={ACCENT}
        label="Isolated Audio"
      />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
        <OutputHandle id="prompt-out" label="prompt" type="text" color={getHandleColor('prompt-out')} />
      </div>
    </NodeShell>
  );
}
