import React, { useState, useEffect, useCallback } from 'react';
import { useReactFlow, type Edge, type Node } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveWorkflowSnapshot, getWorkflowSnapshots, clearWorkflowSnapshots } from '../services/workflowService';

interface Snapshot {
  id: string;
  timestamp: number;
  label: string;
  nodes: Node[];
  edges: Edge[];
}

export const WorkflowLineageTracker: React.FC<{ workflowId?: string }> = ({ workflowId }) => {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadSnapshots = useCallback(async () => {
    if (workflowId) {
      try {
        const cloudSnapshots = await getWorkflowSnapshots(workflowId);
        if (cloudSnapshots && cloudSnapshots.length > 0) {
          setSnapshots(cloudSnapshots as Snapshot[]);
          return;
        }
      } catch (e) {
        console.error('Failed to load cloud snapshots', e);
      }
    }
    
    // Fallback to local storage if no workflowId or no cloud snapshots
    try {
      const storageKey = workflowId ? `workflow_lineage_${workflowId}` : 'workflow_lineage_snapshots';
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setSnapshots(JSON.parse(saved));
      } else {
        setSnapshots([]); // Clear snapshots if switching to a new workflow with no history
      }
    } catch (e) {
      console.error('Failed to load local snapshots', e);
    }
  }, [workflowId]);

  // Load snapshots when workflowId changes
  useEffect(() => {
    loadSnapshots();
  }, [loadSnapshots]);

  const takeSnapshot = async () => {
    setIsSaving(true);
    const nodes = getNodes();
    const edges = getEdges();
    
    // Prompt the user for a name, cancel if null
    const defaultName = `Snapshot ${snapshots.length + 1}`;
    const snapshotName = window.prompt('Name this snapshot:', defaultName);
    
    if (snapshotName === null) {
      setIsSaving(false);
      return;
    }
    
    const snapshotData = {
      label: snapshotName.trim() || defaultName,
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };

    let newId = Math.random().toString(36).substring(7);
    
    if (workflowId) {
      try {
        newId = await saveWorkflowSnapshot(workflowId, snapshotData);
      } catch (e) {
        console.error('Failed to save snapshot to cloud', e);
      }
    }

    const newSnapshot: Snapshot = {
      ...snapshotData,
      id: newId,
      timestamp: Date.now(),
    };
    
    const newSnapshots = [newSnapshot, ...snapshots];
    setSnapshots(newSnapshots);
    
    // Always save locally as a backup
    try {
      const storageKey = workflowId ? `workflow_lineage_${workflowId}` : 'workflow_lineage_snapshots';
      localStorage.setItem(storageKey, JSON.stringify(newSnapshots));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
    setIsSaving(false);
  };

  const clearSnapshots = async () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setSnapshots([]);
      
      if (workflowId) {
        try {
          await clearWorkflowSnapshots(workflowId);
        } catch (e) {
          console.error('Failed to clear cloud snapshots', e);
        }
      }
      
      const storageKey = workflowId ? `workflow_lineage_${workflowId}` : 'workflow_lineage_snapshots';
      localStorage.removeItem(storageKey);
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
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button
          onClick={takeSnapshot}
          disabled={isSaving}
          style={{
            background: '#1a1a1a',
            color: isSaving ? '#888' : '#fff',
            border: '1px solid #333',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            fontSize: '12px'
          }}
        >
          {isSaving ? 'Saving...' : 'Take Snapshot'}
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="lineage-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              width: '250px',
              maxHeight: '300px',
              overflowY: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              transformOrigin: 'top right'
            }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
