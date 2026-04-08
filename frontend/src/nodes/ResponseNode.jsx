import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import useNodeConnections from './useNodeConnections';
import { getHandleColor } from '../utils/handleTypes';

const GENERATED_HANDLES = new Set(['image', 'output']);

export default function ResponseNode({ id, data, selected }) {
  const { disconnectNode } = useNodeConnections(id, data);
  const fields = data.responseFields || [];

  return (
    <NodeShell data={data}
      label={data.label || 'Response · Output'}
      dotColor="#8b5cf6"
      selected={selected}
      onDisconnect={disconnectNode}
    >
      {/* Input handle */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <Handle
          type="target"
          position={Position.Left}
          id="images-in"
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: getHandleColor('images-in'), border: 'none',
            position: 'relative', left: -12, transform: 'none',
          }}
        />
        <span style={{ fontSize: 10, color: '#999', marginLeft: 4 }}>input (any)</span>
      </div>

      {/* Fields display */}
      {fields.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {fields.map((field) => {
            const isGen = GENERATED_HANDLES.has(field.source?.handle);
            return (
              <div
                key={field.id}
                style={{
                  background: '#1a1a1a',
                  borderRadius: 4,
                  padding: '4px 8px',
                  borderLeft: `3px solid ${field.color || '#8b5cf6'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: '#e0e0e0', fontWeight: 600 }}>
                    {field.label}
                  </span>
                  {isGen && data.isLoading && (
                    <span style={{ fontSize: 9, color: '#3b82f6' }}>loading...</span>
                  )}
                </div>
                {!isGen && field.source && (
                  <div style={{ fontSize: 9, color: '#666', marginTop: 2 }}>
                    ${field.source.nodeLabel}.{field.source.handle}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ fontSize: 10, color: '#666', textAlign: 'center', padding: 8 }}>
          Connect outputs here
        </div>
      )}

      {/* Output images display */}
      {data.outputImage && (
        <div style={{ marginTop: 8 }}>
          <img
            src={data.outputImage}
            alt="result"
            style={{ width: '100%', borderRadius: 4 }}
          />
        </div>
      )}

      {data.isLoading && (
        <div style={{ textAlign: 'center', padding: 8, fontSize: 11, color: '#3b82f6' }}>
          Generating...
        </div>
      )}
    </NodeShell>
  );
}
