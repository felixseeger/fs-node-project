import { Position, Handle } from '@xyflow/react';
import { getFirebaseAuth } from '../config/firebase';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';
import { CATEGORY_COLORS, sp, radius, surface, text } from './nodeTokens';
import { hasEmbeddedWorkflow, createEmbeddedWorkflowBadge } from '../utils/workflowEmbedding';

export default function ImageOutputNode({ id, data, selected }) {
  const { disconnectNode } = useNodeConnections(id, data);
  
  const rawInput = data.resolveInput?.(id, 'image-in');
  const resolvedUrl = Array.isArray(rawInput) ? rawInput[0] : rawInput;
  const imageUrl = resolvedUrl || data.outputImage;

  return (
    <NodeShell
      label={data.label || 'Image Output'}
      dotColor={CATEGORY_COLORS.imageGeneration}
      selected={selected}
      onDisconnect={disconnectNode}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: sp[3] }}>
        <Handle
          type="target"
          position={Position.Left}
          id="image-in"
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('image-in'), border: 'none',
            position: 'relative', left: -12, transform: 'none',
          }}
        />
        <span style={{ fontSize: 10, color: text.muted, marginLeft: sp[1] }}>image input</span>
      </div>

      <div style={{
        minHeight: 100,
        background: surface.sunken,
        borderRadius: radius.md,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${surface.deep}`
      }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Generated"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        ) : (
          <div style={{ fontSize: 10, color: text.muted, textAlign: 'center', padding: sp[5] }}>
            {data.isLoading ? 'Generating...' : 'No image connected'}
          </div>
        )}
      </div>

      {imageUrl && (
        <div style={{ marginTop: sp[3], display: 'flex', justifyContent: 'center', gap: sp[2] }}>
          <button
            onClick={() => {
              let username = 'anonymous';
              try {
                const auth = getFirebaseAuth();
                username = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'anonymous';
              } catch { /* auth unavailable — use default 'anonymous' */ }
              const safeUser = username.toLowerCase().replace(/[^a-z0-9]/g, '-');
              const label = (data.label || 'Image Output').toLowerCase().replace(/[^a-z0-9]/g, '-');
              const safeModel = (data.model || 'auto').toLowerCase().replace(/[^a-z0-9]/g, '-');
              
              const a = document.createElement('a');
              a.href = imageUrl;
              a.download = `${safeUser}-${safeModel}-${label}-${Date.now()}.jpg`;
              a.click();
            }}
            style={{
              background: surface.raised,
              border: 'none',
              borderRadius: radius.sm,
              color: text.primary,
              fontSize: 10,
              padding: '4px 8px',
              cursor: 'pointer'
            }}
          >
            Download
          </button>
          
          {/* Embedded Workflow Badge */}
          {hasEmbeddedWorkflow(data) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: radius.sm,
                padding: '2px 6px',
                fontSize: 10,
                color: '#3b82f6'
              }}
              aria-label={createEmbeddedWorkflowBadge(data)?.ariaLabel}
              title={createEmbeddedWorkflowBadge(data)?.ariaLabel}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ marginRight: 4 }}>
                <path d="M2 6L5 3L8 6L5 9L2 6Z" fill="#3b82f6"/>
              </svg>
              <span>Workflow</span>
            </div>
          )}
        </div>
      )}
    </NodeShell>
  );
}
