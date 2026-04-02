const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Add states for rfInstance, history, rename, etc.
const statesToAdd = `  const [rfInstance, setRfInstance] = useState(null);
  const [history, setHistory] = useState({ past: [], future: [] });
  const isHistoryAction = useRef(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');

  const saveHistory = useCallback(() => {
    setHistory((prev) => {
      const last = prev.past[prev.past.length - 1];
      // Only save if different (basic check to avoid saving same state)
      if (last && JSON.stringify(last.nodes) === JSON.stringify(nodesRef.current) && JSON.stringify(last.edges) === JSON.stringify(edgesRef.current)) {
        return prev;
      }
      return {
        past: [...prev.past.slice(-50), { nodes: JSON.parse(JSON.stringify(nodesRef.current)), edges: JSON.parse(JSON.stringify(edgesRef.current)) }],
        future: []
      };
    });
  }, []);

  const handleUndo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const newPast = [...prev.past];
      const previous = newPast.pop();
      isHistoryAction.current = true;
      setNodes(previous.nodes);
      setEdges(previous.edges);
      return { 
        past: newPast, 
        future: [{ nodes: JSON.parse(JSON.stringify(nodesRef.current)), edges: JSON.parse(JSON.stringify(edgesRef.current)) }, ...prev.future] 
      };
    });
  }, [setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const newFuture = [...prev.future];
      const next = newFuture.shift();
      isHistoryAction.current = true;
      setNodes(next.nodes);
      setEdges(next.edges);
      return { 
        past: [...prev.past, { nodes: JSON.parse(JSON.stringify(nodesRef.current)), edges: JSON.parse(JSON.stringify(edgesRef.current)) }], 
        future: newFuture 
      };
    });
  }, [setNodes, setEdges]);

  // Hook into nodes change to save history before drag or delete
  const customOnNodesChange = useCallback((changes) => {
    const isSignificantChange = changes.some(c => c.type === 'position' && !c.dragging || c.type === 'remove' || c.type === 'add');
    if (isSignificantChange && !isHistoryAction.current) {
      saveHistory();
    }
    if (changes.every(c => c.type !== 'position' || !c.dragging)) {
        isHistoryAction.current = false;
    }
    onNodesChange(changes);
  }, [onNodesChange, saveHistory]);

  const customOnEdgesChange = useCallback((changes) => {
    const isSignificantChange = changes.some(c => c.type === 'remove' || c.type === 'add');
    if (isSignificantChange && !isHistoryAction.current) {
      saveHistory();
    }
    isHistoryAction.current = false;
    onEdgesChange(changes);
  }, [onEdgesChange, saveHistory]);

  // Handle keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const handleRenameSubmit = () => {
    if (newWorkflowName.trim() && activeWorkflowId) {
      setWorkflows(prev => prev.map(wf => wf.id === activeWorkflowId ? { ...wf, name: newWorkflowName.trim() } : wf));
    }
    setIsRenameModalOpen(false);
  };

  const handleDuplicateWorkspace = useCallback(() => {
    if (activeWorkflowId) {
      const wfToDuplicate = workflows.find(w => w.id === activeWorkflowId);
      if (wfToDuplicate) {
        const newId = Date.now().toString();
        const newWf = {
          ...wfToDuplicate,
          id: newId,
          name: wfToDuplicate.name + ' (Copy)'
        };
        setWorkflows(prev => [...prev, newWf]);
        setActiveWorkflowId(newId);
        setNodes(wfToDuplicate.nodes || []);
        setEdges(wfToDuplicate.edges || []);
      }
    }
  }, [activeWorkflowId, workflows, setNodes, setEdges]);
`;

jsx = jsx.replace(
  /const \[nodes, setNodes, onNodesChange\] = useNodesState\(defaultNodes\);\n\s*const \[edges, setEdges, onEdgesChange\] = useEdgesState\(\[\]\);/,
  `const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);\n  const [edges, setEdges, onEdgesChange] = useEdgesState([]);\n${statesToAdd}`
);

// Update ReactFlow props
jsx = jsx.replace(
  /onNodesChange=\{onNodesChange\}\n\s*onEdgesChange=\{onEdgesChange\}\n\s*onConnect=\{onConnect\}\n\s*onEdgesDelete=\{onEdgesDelete\}\n\s*isValidConnection=\{connectionValidator\}\n\s*nodeTypes=\{nodeTypes\}\n\s*defaultEdgeOptions=\{defaultEdgeOptions\}\n\s*fitView/,
  `onInit={setRfInstance}
            onNodesChange={customOnNodesChange}
            onEdgesChange={customOnEdgesChange}
            onConnect={(params) => { saveHistory(); onConnect(params); }}
            onEdgesDelete={(deleted) => { saveHistory(); onEdgesDelete(deleted); }}
            isValidConnection={connectionValidator}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView`
);

// Remove <Controls />
jsx = jsx.replace(/<Controls \/>/g, '');

// Update TopBar props
const topBarUsage = `<TopBar
        currentPage={currentPage}
        onNavigate={() => handleBackToHome()}
        workflowName={activeWorkflowName}
        editorMode={editorMode}
        onEditorModeChange={setEditorMode}
        onLogout={() => setIsAuthenticated(false)}
        onZoomIn={() => rfInstance?.zoomIn()}
        onZoomOut={() => rfInstance?.zoomOut()}
        onZoomFit={() => rfInstance?.fitView()}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onRename={() => { setNewWorkflowName(activeWorkflowName); setIsRenameModalOpen(true); }}
        onDuplicate={handleDuplicateWorkspace}
      />
      {isRenameModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#1c1c1c', padding: 24, borderRadius: 12, border: '1px solid #333', width: 320 }}>
            <h3 style={{ margin: '0 0 16px', color: '#fff', fontSize: 16 }}>Rename Workspace</h3>
            <input 
              autoFocus
              type="text" 
              value={newWorkflowName} 
              onChange={e => setNewWorkflowName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleRenameSubmit(); if (e.key === 'Escape') setIsRenameModalOpen(false); }}
              style={{ width: '100%', padding: '10px 12px', background: '#111', border: '1px solid #333', borderRadius: 8, color: '#e0e0e0', outline: 'none', marginBottom: 16, boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setIsRenameModalOpen(false)} style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', borderRadius: 6 }}>Cancel</button>
              <button onClick={handleRenameSubmit} style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: 6, fontWeight: 600 }}>Save</button>
            </div>
          </div>
        </div>
      )}`;

jsx = jsx.replace(
  /<TopBar\s*currentPage=\{currentPage\}\s*onNavigate=\{\(\) => handleBackToHome\(\)\}\s*workflowName=\{activeWorkflowName\}\s*editorMode=\{editorMode\}\s*onEditorModeChange=\{setEditorMode\}\s*onLogout=\{\(\) => setIsAuthenticated\(false\)\}\s*\/>/,
  topBarUsage
);

// We should also wrap updateNodeData to save history before setting
jsx = jsx.replace(
  /const updateNodeData = useCallback\(\n\s*\(nodeId, patch\) => \{/,
  `const updateNodeData = useCallback(
    (nodeId, patch) => {
      saveHistory();`
);

fs.writeFileSync('frontend/src/App.jsx', jsx);
console.log("Patched App.jsx with new controls and TopBar props");
