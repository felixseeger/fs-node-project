import React, { useEffect, useState, useRef } from 'react';

interface NodeData {
  isLoading?: boolean;
  label?: string;
  outputError?: string | null;
  outputImage?: any;
  outputVideo?: any;
  outputAudio?: any;
  outputText?: any;
}

interface Node {
  id: string;
  type: string;
  data?: NodeData;
}

interface QueueProps {
  nodes: Node[];
}

interface LogEntry {
  id: string;
  nodeId: string;
  label: string;
  status: 'running' | 'success' | 'error';
  errorMsg?: string;
  timestamp: Date;
}

export default function Queue({ nodes }: QueueProps): React.ReactElement | null {
  const [history, setHistory] = useState<LogEntry[]>([]);
  const prevNodesRef = useRef<Node[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  // Track state transitions
  useEffect(() => {
    const prevNodes = prevNodesRef.current;
    const newHistory = [...history];
    let changed = false;

    nodes.forEach(node => {
      const prevNode = prevNodes.find(n => n.id === node.id);
      const isCurrentlyLoading = node.data?.isLoading;
      const wasLoading = prevNode?.data?.isLoading;

      if (isCurrentlyLoading && !wasLoading) {
        // Started loading
        newHistory.unshift({
          id: `${node.id}-${Date.now()}`,
          nodeId: node.id,
          label: node.data?.label || node.type,
          status: 'running',
          timestamp: new Date()
        });
        changed = true;
      } else if (!isCurrentlyLoading && wasLoading) {
        // Finished loading
        const idx = newHistory.findIndex(h => h.nodeId === node.id && h.status === 'running');
        if (idx !== -1) {
          newHistory[idx] = {
            ...newHistory[idx],
            status: node.data?.outputError ? 'error' : 'success',
            errorMsg: node.data?.outputError || undefined,
            timestamp: new Date() // Update timestamp to completion time
          };
          changed = true;
        }
      }
    });

    if (changed) {
      // Keep only last 20 entries
      setHistory(newHistory.slice(0, 20));
    }
    prevNodesRef.current = nodes;
  }, [nodes]);

  const activeCount = history.filter(h => h.status === 'running').length;

  if (history.length === 0) return null;

  return (
    <div style={{
      width: 280,
      background: 'rgba(20, 20, 20, 0.85)',
      backdropFilter: 'blur(10px)',
      border: '1px solid #333',
      borderRadius: 12,
      padding: 12,
      zIndex: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'auto'
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#aaa',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 4,
          cursor: 'pointer'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Execution Log
          <svg style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </span>
        {activeCount > 0 && (
          <span style={{
            background: '#3b82f6',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: 10,
            fontSize: 10
          }}>{activeCount} Active</span>
        )}
      </div>

      {isExpanded && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          maxHeight: 300,
          overflowY: 'auto',
          paddingRight: 4
        }}>
          {history.map((entry) => (
            <div key={entry.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              background: 'rgba(255,255,255,0.05)',
              padding: '8px 10px',
              borderRadius: 6,
              borderLeft: `2px solid ${entry.status === 'running' ? '#3b82f6' : entry.status === 'success' ? '#22c55e' : '#ef4444'}`
            }}>
              <div style={{ marginTop: 2 }}>
                {entry.status === 'running' && (
                  <div style={{
                    width: 12, height: 12,
                    border: '2px solid rgba(255,255,255,0.1)',
                    borderTop: '2px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                )}
                {entry.status === 'success' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                )}
                {entry.status === 'error' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontWeight: 500
                }}>
                  {entry.label}
                </div>
                <div style={{
                  fontSize: 10,
                  color: '#888',
                  marginTop: 2
                }}>
                  {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                {entry.status === 'error' && entry.errorMsg && (
                  <div style={{
                    fontSize: 10,
                    color: '#ef4444',
                    marginTop: 4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {entry.errorMsg}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
