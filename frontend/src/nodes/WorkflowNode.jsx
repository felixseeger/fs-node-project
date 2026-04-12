import { useEffect, useState } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getTemplate, subscribeTemplates } from '../templates/templateStore';

const ACCENT = '#a78bfa'; // Workflow Template accent (lavender)

/**
 * WorkflowNode — renders a saved Workflow Template as a single canvas node.
 *
 * data shape:
 *  - templateId: string (id from templateStore)
 *  - label?:     override template name
 *  - inputs?:    override template inputs (array of { id, label })
 *  - outputs?:   override template outputs (array of { id, label })
 */
export default function WorkflowNode({ id, data, selected }) {
  const { disconnectNode } = useNodeConnections(id, data);
  const [subscriptionTpl, setSubscriptionTpl] = useState(() => (data.templateId ? getTemplate(data.templateId) : null));

  // Live-refresh when template definitions change, but only if we rely on templateId
  useEffect(() => {
    if (data.templateData || !data.templateId) return undefined;
    return subscribeTemplates(() => setSubscriptionTpl(getTemplate(data.templateId)));
  }, [data.templateId, data.templateData]);

  const tpl = data.templateData || subscriptionTpl;
  const inputs = data.inputs || tpl?.inputs || [];
  const outputs = data.outputs || tpl?.outputs || [];
  const name = data.label || tpl?.name || 'Workflow Template';
  const description = data.description || tpl?.description;
  const missing = data.templateId && !tpl;

  return (
    <NodeShell data={data}
      label={name}
      dotColor={ACCENT}
      selected={selected}
      onDisconnect={disconnectNode}
    >
      {missing && (
        <div
          style={{
            fontSize: 11,
            color: '#f87171',
            background: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.25)',
            borderRadius: 6,
            padding: '6px 8px',
            marginBottom: 8,
          }}
        >
          Template not found in this browser.
        </div>
      )}

      {description && (
        <div style={{ fontSize: 11, color: '#888', marginBottom: 10, lineHeight: 1.4 }}>
          {description}
        </div>
      )}

      {inputs.length === 0 && outputs.length === 0 && !missing && (
        <div style={{ fontSize: 11, color: '#666', fontStyle: 'italic' }}>
          No inputs or outputs defined.
        </div>
      )}

      {inputs.length > 0 && (
        <div style={{ marginBottom: outputs.length > 0 ? 10 : 0 }}>
          <div
            style={{
              fontSize: 9,
              color: '#777',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 6,
            }}
          >
            Inputs
          </div>
          {inputs.map((io) => (
            <div
              key={'in-' + io.id}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '4px 0',
              }}
            >
              <Handle
                type="target"
                position={Position.Left}
                id={io.id}
                style={{
                  width: 10,
                  height: 10,
                  background: ACCENT,
                  border: 'none',
                  left: -16,
                }}
              />
              <span style={{ fontSize: 11, color: '#ccc' }}>{io.label || io.id}</span>
            </div>
          ))}
        </div>
      )}

      {outputs.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 9,
              color: '#777',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 6,
              textAlign: 'right',
            }}
          >
            Outputs
          </div>
          {outputs.map((io) => (
            <div
              key={'out-' + io.id}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '4px 0',
              }}
            >
              <span style={{ fontSize: 11, color: '#ccc' }}>{io.label || io.id}</span>
              <Handle
                type="source"
                position={Position.Right}
                id={io.id}
                style={{
                  width: 10,
                  height: 10,
                  background: ACCENT,
                  border: 'none',
                  right: -16,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </NodeShell>
  );
}
