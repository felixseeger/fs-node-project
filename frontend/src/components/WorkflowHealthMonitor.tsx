import React, { useState, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

interface HealthIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  nodeId?: string;
}

export const WorkflowHealthMonitor: React.FC = () => {
  const { getNodes, getEdges } = useReactFlow();
  const [issues, setIssues] = useState<HealthIssue[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Basic polling or could be hooked up to ReactFlow's onNodesChange
    const interval = setInterval(() => {
      const nodes = getNodes();
      const edges = getEdges();
      const newIssues: HealthIssue[] = [];

      nodes.forEach(node => {
        // Example check: check if the node has empty required inputs
        // This relies on knowing the node schema, but we can do simple heuristics
        const data = node.data as any;
        if (data?.inputs) {
          data.inputs.forEach((input: any) => {
            if (input.required) {
              const hasConnection = edges.some(
                e => e.target === node.id && e.targetHandle === input.id
              );
              if (!hasConnection) {
                newIssues.push({
                  id: `missing-input-${node.id}-${input.id}`,
                  type: 'error',
                  message: `Missing required input '${input.label || input.id}' on node '${data.label || node.id}'`,
                  nodeId: node.id
                });
              }
            }
          });
        }

        // Example check: check for API keys if needed (heuristic)
        if (data?.provider && data?.provider === 'openai' && !data?.apiKey) {
          newIssues.push({
            id: `missing-key-${node.id}`,
            type: 'warning',
            message: `Node '${data.label || node.id}' might need an API key configured`,
            nodeId: node.id
          });
        }
        
        // Example check: mismatched resolutions (image -> video)
        // If an image node outputs 1024x1024 but the video node expects 16:9, we could warn.
        // For now, let's keep it generic.
      });

      // Isolated nodes (no edges connected to them)
      nodes.forEach(node => {
        const isConnected = edges.some(e => e.source === node.id || e.target === node.id);
        if (!isConnected && nodes.length > 1) {
          newIssues.push({
            id: `isolated-${node.id}`,
            type: 'info',
            message: `Node '${(node.data as any)?.label || node.id}' is disconnected`,
            nodeId: node.id
          });
        }
      });

      setIssues(newIssues);
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [getNodes, getEdges]);

  const errors = issues.filter(i => i.type === 'error').length;
  const warnings = issues.filter(i => i.type === 'warning').length;

  return (
    <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1000 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #333',
          padding: '8px 16px',
          borderRadius: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          fontSize: '13px'
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: errors > 0 ? '#ef4444' : warnings > 0 ? '#f59e0b' : '#22c55e' }} />
        Health {issues.length > 0 ? `(${issues.length} issues)` : '(Good)'}
      </button>

      {isOpen && issues.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          right: 0,
          marginBottom: '10px',
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          width: '300px',
          maxHeight: '400px',
          overflowY: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '12px', borderBottom: '1px solid #333', fontWeight: 600, color: '#fff' }}>
            Workflow Health
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {issues.map(issue => (
              <div
                key={issue.id}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #222',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '13px'
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                  background: issue.type === 'error' ? '#ef4444' : issue.type === 'warning' ? '#f59e0b' : '#3b82f6'
                }} />
                <div style={{ color: '#ccc', lineHeight: 1.4 }}>{issue.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
