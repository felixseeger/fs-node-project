import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { CATEGORY_COLORS, border, sp, radius, surface, text, ui } from './nodeTokens';
import { hasEmbeddedWorkflow, createEmbeddedWorkflowBadge } from '../utils/workflowEmbedding';
import type { NodeCanvasCallbacks, OutputNodeData } from '../types/nodes';

type SoundOutputNodeData = OutputNodeData & NodeCanvasCallbacks;

type SoundOutputFlowNode = Node<SoundOutputNodeData, 'soundOutput'>;

export default function SoundOutputNode({
  id,
  data,
  selected,
}: NodeProps<SoundOutputFlowNode>) {
  const { disconnectNode } = useNodeConnections(id, data);
  const audioUrl =
    (data.resolveInput?.(id, 'audio-in') as string | undefined) || data.outputAudio;

  return (
    <NodeShell
      data={data}
      label={data.label || 'Sound Output'}
      dotColor={CATEGORY_COLORS.vision}
      selected={selected}
      onDisconnect={disconnectNode}
      hasError={!!data.outputError}
      downloadUrl={audioUrl || undefined}
      downloadType="audio"
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: sp[3] }}>
        <Handle
          type="target"
          position={Position.Left}
          id="audio-in"
          style={{
            width: 10,
            height: 10,
            borderRadius: radius.full,
            background: getHandleColor('audio-in'),
            border: 'none',
            position: 'relative',
            left: -12,
            transform: 'none',
          }}
        />
        <span style={{ fontSize: 10, color: text.muted, marginLeft: sp[1] }}>audio input</span>
      </div>

      <div
        style={{
          background: surface.sunken,
          borderRadius: radius.md,
          padding: sp[4],
          border: `1px solid ${border.subtle}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: sp[3],
        }}
      >
        <div style={{ padding: sp[2] }}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke={text.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </div>

        {audioUrl ? (
          <audio src={audioUrl} controls style={{ width: '100%', height: '32px' }} />
        ) : (
          <div style={{ fontSize: 10, color: text.muted }}>
            {data.isLoading ? 'Generating...' : 'No sound connected'}
          </div>
        )}
      </div>

      {data.outputError && (
        <div
          role="alert"
          style={{
            marginTop: sp[3],
            fontSize: 10,
            color: text.error,
            background: ui.errorBg,
            border: `1px solid ${ui.errorBorder}`,
            borderRadius: radius.sm,
            padding: sp[3],
            wordBreak: 'break-word',
          }}
        >
          {data.outputError}
        </div>
      )}

      {audioUrl && hasEmbeddedWorkflow(data) && (
        <div
          style={{
            marginTop: sp[3],
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: ui.linkBg,
            border: `1px solid ${ui.linkBorder}`,
            borderRadius: radius.sm,
            padding: '2px 6px',
            fontSize: 10,
            color: ui.link,
          }}
          aria-label={createEmbeddedWorkflowBadge(data)?.ariaLabel}
          title={createEmbeddedWorkflowBadge(data)?.ariaLabel}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ marginRight: sp[1] }}>
            <path d="M2 6L5 3L8 6L5 9L2 6Z" fill={ui.link} />
          </svg>
          <span style={{ color: ui.linkText }}>Workflow</span>
        </div>
      )}
    </NodeShell>
  );
}
