const fs = require('fs');

let appJsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// Add isLocked state
appJsx = appJsx.replace(
  /const \[isRenameModalOpen, setIsRenameModalOpen\] = useState\(false\);/,
  `const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);\n  const [isLocked, setIsLocked] = useState(false);`
);

// Add isLocked and onLockView to TopBar props
appJsx = appJsx.replace(
  /onRename=\{\(\) => \{ setNewWorkflowName\(activeWorkflowName\); setIsRenameModalOpen\(true\); \}\}\n\s*onDuplicate=\{handleDuplicateWorkspace\}/,
  `onRename={() => { setNewWorkflowName(activeWorkflowName); setIsRenameModalOpen(true); }}\n        onDuplicate={handleDuplicateWorkspace}\n        isLocked={isLocked}\n        onLockView={() => setIsLocked(prev => !prev)}`
);

// Add panOnDrag, zoomOnScroll, nodesDraggable to ReactFlow
appJsx = appJsx.replace(
  /defaultEdgeOptions=\{defaultEdgeOptions\}\n\s*fitView/,
  `defaultEdgeOptions={defaultEdgeOptions}\n            fitView\n            panOnDrag={!isLocked}\n            zoomOnScroll={!isLocked}\n            nodesDraggable={!isLocked}\n            edgesUpdatable={!isLocked}\n            elementsSelectable={!isLocked}`
);

fs.writeFileSync('frontend/src/App.jsx', appJsx);

let topbarJsx = fs.readFileSync('frontend/src/TopBar.jsx', 'utf8');

// Update TopBar signature
topbarJsx = topbarJsx.replace(
  /export default function TopBar\(\{ currentPage, onNavigate, workflowName, editorMode, onEditorModeChange, onLogout, onZoomIn, onZoomOut, onZoomFit, onUndo, onRedo, onRename, onDuplicate \}\) \{/,
  `export default function TopBar({ currentPage, onNavigate, workflowName, editorMode, onEditorModeChange, onLogout, onZoomIn, onZoomOut, onZoomFit, onUndo, onRedo, onRename, onDuplicate, isLocked, onLockView }) {`
);

// Update editorMenuItems to include lock view
const oldZoomOut = `{ id: 'zoom-out', label: 'Zoom out', shortcut: '⌘-' },`;
const newZoomOut = `{ id: 'zoom-out', label: 'Zoom out', shortcut: '⌘-' },\n    { id: 'lock-view', label: isLocked ? 'Unlock view' : 'Lock view' },`;
topbarJsx = topbarJsx.replace(oldZoomOut, newZoomOut);

// Update click handler
const oldZoomOutClick = `else if (item.id === 'zoom-out') onZoomOut?.();`;
const newZoomOutClick = `else if (item.id === 'zoom-out') onZoomOut?.();\n                      else if (item.id === 'lock-view') onLockView?.();`;
topbarJsx = topbarJsx.replace(oldZoomOutClick, newZoomOutClick);

fs.writeFileSync('frontend/src/TopBar.jsx', topbarJsx);

console.log("Patched Lock View feature");
