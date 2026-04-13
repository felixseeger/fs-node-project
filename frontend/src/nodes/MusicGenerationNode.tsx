import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { NodeCapabilities } from './nodeCapabilities';
import { musicGenerate, pollMusicStatus } from '../utils/api';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';
import useNodeConnections from './useNodeConnections';
import {
  CATEGORY_COLORS,
  border,
  radius,
  sp,
  text,
  ui,
  textareaStyle,
  settingsPanelStyle,
  settingsTitleStyle,
  outputBoxStyle,
} from './nodeTokens';
import type { AudioGenerationNodeData, NodeCanvasCallbacks } from '../types/nodes';

type MusicGenerationNodeData = AudioGenerationNodeData & NodeCanvasCallbacks;

type MusicGenerationFlowNode = Node<MusicGenerationNodeData, 'musicGeneration'>;

export default function MusicGenerationNode({
  id,
  data,
  selected,
}: NodeProps<MusicGenerationFlowNode>) {
  const {
    progress,
    status,
    message,
    start,
    setProgress,
    complete,
    fail,
    isActive,
  } = useNodeProgress();

  const { conn, disconnectNode } = useNodeConnections(id, data);
  const { connected: hasPromptConnection, info: promptConnection } = conn('prompt-in');

  const localDuration = data.localDuration ?? 30;

  const update = useCallback(
    (patch: Record<string, unknown>) => data.onUpdate?.(id, patch),
    [id, data]
  );

  const handleGenerate = useCallback(async () => {
    const prompt = String(
      data.resolveInput?.(id, 'prompt-in') ?? data.inputPrompt ?? ''
    );

    if (!prompt) return;

    start('Submitting music request...');
    update({ outputAudio: null, outputError: null });

    try {
      const params = {
        prompt,
        music_length_seconds: localDuration,
      };

      const result = await musicGenerate(params);

      if (result.error) {
        const errObj = result.error as { message?: string };
        const errMsg = errObj?.message || JSON.stringify(result.error);
        fail(new Error(errMsg));
        update({ outputError: errMsg });
        return;
      }

      const taskId =
        (result as { task_id?: string }).task_id ||
        (result as { data?: { task_id?: string } }).data?.task_id;
      let finalAudio: string | null = null;
      if (taskId) {
        setProgress(20, 'Waiting for music generation...');
        const statusRes = await pollMusicStatus(taskId, 90, 2000, (p: number, msg: string) => {
          // p is attempt/total in [0, 1] from api onProgress
          setProgress(20 + p * 70, msg);
        });
        const generated =
          (statusRes as { data?: { generated?: string[] } }).data?.generated || [];
        complete('Music generation complete');
        finalAudio = generated[0] ?? null;
        update({
          outputAudio: finalAudio,
          outputError: null,
        });
      } else if (
        (result as { data?: { generated?: string[] } }).data?.generated?.length
      ) {
        complete('Music generation complete');
        finalAudio =
          (result as { data?: { generated?: string[] } }).data!.generated![0]!;
        update({
          outputAudio: finalAudio,
          outputError: null,
        });
      } else {
        fail(new Error('No music generated'));
      }

      if (finalAudio && data.onCreateNode) {
        data.onCreateNode(
          'soundOutput',
          { outputAudio: finalAudio },
          'output-audio',
          'audio-in'
        );
      }
    } catch (err) {
      console.error('Music generation error:', err);
      fail(err instanceof Error ? err : new Error(String(err)));
      update({
        outputError: err instanceof Error ? err.message : String(err),
      });
    }
  }, [id, data, localDuration, start, setProgress, complete, fail, update]);

  const lastTrigger = useRef<string | number | null | undefined>(null);
  useEffect(() => {
    if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
      lastTrigger.current = data.triggerGenerate;
      void handleGenerate();
    }
  }, [data.triggerGenerate, handleGenerate]);

  const ACCENT = CATEGORY_COLORS.vision;

  const sectionHeader = (
    sectionLabel: string,
    handleId: string,
    handleType: 'target' | 'source',
    color: string,
    extra?: ReactNode
  ) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: sp[2],
        marginTop: sp[4],
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: sp[2] }}>
        <Handle
          type={handleType}
          position={handleType === 'target' ? Position.Left : Position.Right}
          id={handleId}
          style={{
            width: 10,
            height: 10,
            borderRadius: radius.full,
            background: color,
            border: 'none',
            position: 'relative',
            left: handleType === 'target' ? -12 : 'auto',
            right: handleType === 'source' ? -12 : 'auto',
            transform: 'none',
          }}
        />
        <span style={{ fontSize: 12, fontWeight: 600, color: text.primary }}>
          {sectionLabel}
        </span>
      </div>
      {extra ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: sp[1] }}>{extra}</div>
      ) : null}
    </div>
  );

  const linkedBadges = (onUnlinkHandle: string) => (
    <>
      <span
        style={{
          fontSize: 9,
          color: ui.link,
          padding: '2px 6px',
          background: ui.linkBg,
          borderRadius: radius.sm,
        }}
      >
        linked
      </span>
      <button
        type="button"
        onClick={() => data.onUnlink?.(id, onUnlinkHandle)}
        style={{
          fontSize: 9,
          color: ui.error,
          padding: '2px 6px',
          background: ui.errorBg,
          borderRadius: radius.sm,
          border: `1px solid ${ui.errorBorder}`,
          cursor: 'pointer',
        }}
      >
        unlink
      </button>
    </>
  );

  const connectionInfoBox = (
    connInfo: { nodeLabel?: string; handle?: string } | null | undefined
  ) => (
    <div
      style={{
        background: ui.linkBg,
        border: `1px solid ${ui.linkBorder}`,
        borderRadius: radius.md,
        padding: `${sp[2]}px ${sp[4]}px`,
        marginBottom: sp[1],
        display: 'flex',
        alignItems: 'center',
        gap: sp[2],
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: radius.full,
          background: ui.link,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 11, color: ui.linkText }}>
        {connInfo
          ? `Linked from ${connInfo.nodeLabel} → ${connInfo.handle}`
          : 'Linked from upstream node'}
      </span>
    </div>
  );

  return (
    <NodeShell
      data={data}
      label={data.label || 'ElevenLabs Music'}
      editableTitle={{
        value: String(data.label ?? ''),
        onCommit: (next) => update({ label: next }),
        placeholder: 'Generate Audio',
      }}
      dotColor={ACCENT}
      selected={selected}
      onGenerate={handleGenerate}
      isGenerating={isActive}
      onDisconnect={disconnectNode}
      hasError={!!data.outputError && !isActive}
      downloadUrl={data.outputAudio || undefined}
      downloadType="audio"
      capabilities={[NodeCapabilities.AUDIO_MUSIC_GENERATE, NodeCapabilities.OUTPUT_AUDIO]}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 10, color: text.muted, marginRight: sp[1] }}>audio</span>
        <Handle
          type="source"
          position={Position.Right}
          id="output-audio"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: getHandleColor('output-audio'),
            border: 'none',
            position: 'relative',
            right: -12,
            transform: 'none',
          }}
        />
      </div>

      {sectionHeader(
        'Prompt (Required)',
        'prompt-in',
        'target',
        getHandleColor('prompt-in'),
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <ImprovePromptButton id={id} data={data} update={update} type="video" />
          {hasPromptConnection ? linkedBadges('prompt-in') : null}
        </div>
      )}
      {hasPromptConnection ? (
        connectionInfoBox(promptConnection)
      ) : (
        <textarea
          className="nodrag nopan"
          value={data.inputPrompt || ''}
          onChange={(e) => update({ inputPrompt: e.target.value })}
          placeholder="e.g. Upbeat jazz with piano and brushed drums"
          rows={4}
          style={{ 
            ...textareaStyle, 
            minHeight: 88,
            transition: 'border-color 0.2s, box-shadow 0.2s',
          } as CSSProperties}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = ACCENT;
            e.currentTarget.style.boxShadow = `0 0 0 2px ${ACCENT}33`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = border.input;
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      )}

      <div style={settingsPanelStyle as CSSProperties}>
        <div style={settingsTitleStyle as CSSProperties}>Music Settings</div>

        <div style={{ marginBottom: sp[4] }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: sp[1],
            }}
          >
            <span style={{ fontSize: 11, color: text.muted }}>Duration (sec)</span>
            <span style={{ fontSize: 11, color: text.primary, fontWeight: 600 }}>
              {localDuration}
            </span>
          </div>
          <div className="nodrag nopan" style={{ display: 'flex', alignItems: 'center', gap: sp[2] }} onMouseDown={e => e.stopPropagation()}>
            <span
              style={{
                fontSize: 9,
                color: text.muted,
                minWidth: 14,
                textAlign: 'right',
              }}
            >
              10
            </span>
            <input
              type="range"
              min={10}
              max={240}
              step={1}
              value={localDuration}
              onChange={(e) => update({ localDuration: Number(e.target.value) })}
              onMouseDown={e => e.stopPropagation()}
              style={{ flex: 1, accentColor: ACCENT }}
            />
            <span style={{ fontSize: 9, color: text.muted, minWidth: 14 }}>240</span>
          </div>
        </div>
      </div>

      <NodeProgress progress={progress} status={status} message={message} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: sp[2],
          marginTop: sp[4],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: sp[2] }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: radius.full,
              background: ACCENT,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: text.primary }}>
            Generated Music
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp[1] }}>
          <span style={{ fontSize: 10, color: text.muted }}>prompt</span>
          <Handle
            type="source"
            position={Position.Right}
            id="prompt-out"
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: getHandleColor('prompt-out'),
              border: 'none',
              position: 'relative',
              right: -12,
              transform: 'none',
            }}
          />
        </div>
      </div>
      <div
        style={
          {
            ...outputBoxStyle,
            minHeight: 120,
            padding: sp[4],
          } as CSSProperties
        }
      >
        {isActive ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: sp[4],
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                border: `3px solid ${border.subtle}`,
                borderTop: `3px solid ${ACCENT}`,
                borderRadius: radius.full,
                animation: 'spin 1s linear infinite',
              }}
            />
            <span style={{ fontSize: 10, color: text.muted }}>Composing music...</span>
          </div>
        ) : data.outputAudio ? (
          <audio
            src={data.outputAudio}
            controls
            style={{ width: '100%', borderRadius: radius.md, height: 40 }}
          />
        ) : data.outputError ? (
          <span
            style={{
              fontSize: 10,
              color: text.error,
              textAlign: 'center',
              wordBreak: 'break-word',
            }}
          >
            {data.outputError}
          </span>
        ) : (
          <span style={{ fontSize: 11, color: text.muted, textAlign: 'center' }}>
            Generated audio will appear here
          </span>
        )}
      </div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </NodeShell>
  );
}
