import React, { useState, useEffect } from 'react';
import { useReactFlow, Edge, Node } from '@xyflow/react';

interface Snapshot {
  id: string;
  timestamp: number;
  label: string;
  nodes: Node[];
  edges: Edge[];
}

export const WorkflowLineageTracker: React.FC = () => {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('workflow_lineage_snapshots');
      if (saved) {
        setSnapshots(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load snapshots', e);
    }
  }, []);

  const takeSnapshot = () => {
    const nodes = getNodes();
    const edges = getEdges();
    const newSnapshot: Snapshot = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      label: `Snapshot ${snapshots.length + 1}`,
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    
    const newSnapshots = [newSnapshot, ...snapshots];
    setSnapshots(newSnapshots);
    
    try {
      localStorage.setItem('workflow_lineage_snapshots', JSON.stringify(newSnapshots));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  };

  const clearSnapshots = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setSnapshots([]);
      localStorage.removeItem('workflow_lineage_snapshots');
    }
  };

  const restoreSnapshot = (snapshot: Snapshot) => {
    if (window.confirm(`Restore ${snapshot.label}? Current unsaved changes will be lost.`)) {
      setNodes(snapshot.nodes);
      setEdges(snapshot.edges);
      setIsOpen(false);
    }
  };

  return (
    <div style={{ position: 'absolute', top: 60, right: 20, zIndex: 1000 }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={takeSnapshot}
          style={{
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Take Snapshot
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          History ({snapshots.length})
        </button>
      </div>

      {isOpen && (
        <div style={{
          marginTop: '8px',
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          width: '250px',
          maxHeight: '300px',
          overflowY: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          {snapshots.length === 0 ? (
            <div style={{ padding: '12px', color: '#888', fontSize: '12px', textAlign: 'center' }}>
              No snapshots yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={clearSnapshots}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}
                >
                  Clear All
                </button>
              </div>
              {snapshots.map(s => (
                <div
                  key={s.id}
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid #222',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px'
                  }}
                >
                  <div>
                    <div style={{ color: '#fff', fontWeight: 500 }}>{s.label}</div>
                    <div style={{ color: '#666', fontSize: '11px' }}>
                      {new Date(s.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <button
                    onClick={() => restoreSnapshot(s)}
                    style={{
                      background: '#2563eb',
                      color: '#fff',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
