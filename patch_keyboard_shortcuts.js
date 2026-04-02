const fs = require('fs');

// 1. GooeyNodesMenu.jsx
let gooey = fs.readFileSync('frontend/src/GooeyNodesMenu.jsx', 'utf8');

// Import the modal
if (!gooey.includes('KeyboardShortcutsModal')) {
  gooey = gooey.replace(
    /import SearchHistoryMenu from '\.\/SearchHistoryMenu';/,
    `import SearchHistoryMenu from './SearchHistoryMenu';\nimport KeyboardShortcutsModal from './KeyboardShortcutsModal';`
  );
}

// Add state
if (!gooey.includes('showShortcutsModal')) {
  gooey = gooey.replace(
    /const \[showHistoryModal, setShowHistoryModal\] = useState\(false\);/,
    `const [showHistoryModal, setShowHistoryModal] = useState(false);\n  const [showShortcutsModal, setShowShortcutsModal] = useState(false);`
  );
}

// Render the modal
if (!gooey.includes('<KeyboardShortcutsModal')) {
  gooey = gooey.replace(
    /<SearchHistoryMenu isOpen=\{showHistoryModal\} onClose=\{\(\) => setShowHistoryModal\(false\)\} \/>/,
    `<SearchHistoryMenu isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} />\n      <KeyboardShortcutsModal isOpen={showShortcutsModal} onClose={() => setShowShortcutsModal(false)} />`
  );
}

// Attach click handler to the link
const oldHelpLink = `<a href="#" className="ms-help-link">
            <span className="ms-help-icon">{Icons.Cmd}</span>
            <span className="ms-help-text">Keyboard shortcuts</span>
            <span className="ms-help-shortcut">Ctrl + .</span>
          </a>`;
const newHelpLink = `<a href="#" className="ms-help-link" onClick={(e) => { e.preventDefault(); setShowShortcutsModal(true); setShowHelpMenu(false); }}>
            <span className="ms-help-icon">{Icons.Cmd}</span>
            <span className="ms-help-text">Keyboard shortcuts</span>
            <span className="ms-help-shortcut">Ctrl + .</span>
          </a>`;

gooey = gooey.replace(oldHelpLink, newHelpLink);

fs.writeFileSync('frontend/src/GooeyNodesMenu.jsx', gooey);
console.log("Patched GooeyNodesMenu.jsx");


// 2. App.jsx - Implementing Global Navigation Keys
let appJsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// We already have handleKeyDown logic:
/*
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
...
*/

const oldKeydownEffect = `  // Handle keyboard shortcuts for Undo/Redo
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
  }, [handleUndo, handleRedo]);`;

const newKeydownEffect = `  // Handle keyboard shortcuts for Undo/Redo and other actions
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
        return;
      }

      if (cmdOrCtrl && e.key === 'd') {
        e.preventDefault();
        handleMenuAction('duplicate', { selectedNodes: rfInstance?.getNodes().filter(n => n.selected) });
        return;
      }

      if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        handleMenuAction('clear_contents', { selectedNodes: rfInstance?.getNodes().filter(n => n.selected) });
        return;
      }

      if (cmdOrCtrl && e.key === '1') {
        e.preventDefault();
        rfInstance?.fitView();
        return;
      }

      // Single key shortcuts for node creation
      if (!cmdOrCtrl && !e.shiftKey && !e.altKey) {
        const key = e.key.toLowerCase();
        let typeToAdd = null;
        switch (key) {
          case 't': typeToAdd = 'textNode'; break;
          case 'c': typeToAdd = 'comment'; break;
          case 'l': typeToAdd = 'layerEditor'; break;
          case 'a': typeToAdd = 'assetNode'; break;
          case 'b': typeToAdd = 'batchNode'; break;
          case 'r': typeToAdd = 'routerNode'; break;
          case 'u': typeToAdd = 'uploadNode'; break;
          case 'h': 
            // h is search history. It's a modal, but we can't easily trigger the modal from App.jsx if it lives in GooeyNodesMenu.
            // Let's fire a custom event that GooeyNodesMenu can listen to!
            window.dispatchEvent(new CustomEvent('open-search-history'));
            break;
        }
        
        if (typeToAdd) {
          e.preventDefault();
          
          // Determine position: Center of viewport
          let x = 300;
          let y = 300;
          
          if (rfInstance) {
            const center = rfInstance.screenToFlowPosition({
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            });
            x = center.x;
            y = center.y;
          }
          
          const defaults = NODE_MENU.flatMap(s => s.items).find(i => i.type === typeToAdd)?.defaults || { label: typeToAdd };
          
          const newNode = {
            id: nextId(),
            type: typeToAdd,
            position: { x, y },
            data: { ...defaults },
          };
          setNodes(nds => [...nds, newNode]);
          saveHistory();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, rfInstance, setNodes, saveHistory]);`;

appJsx = appJsx.replace(oldKeydownEffect, newKeydownEffect);
fs.writeFileSync('frontend/src/App.jsx', appJsx);
console.log("Patched App.jsx");
