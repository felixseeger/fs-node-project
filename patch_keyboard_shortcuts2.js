const fs = require('fs');

let appJsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// I need to add support for Ctrl+. (or Cmd+.) to open the shortcuts menu.
const ctrlDot = `
      if (cmdOrCtrl && e.key === '.') {
        e.preventDefault();
        window.dispatchEvent(new Event('open-keyboard-shortcuts'));
        return;
      }
`;

appJsx = appJsx.replace(
  /if \(cmdOrCtrl && e.key === '1'\) \{/,
  `${ctrlDot}      if (cmdOrCtrl && e.key === '1') {`
);

// I should also fix the type-mapping logic for single keys.
// The code earlier used:
// const defaults = NODE_MENU.flatMap(s => s.items).find(i => i.type === typeToAdd)?.defaults || { label: typeToAdd };
// This requires NODE_MENU. Let's make sure NODE_MENU is in scope. It's declared at the top of App.jsx, so it's fine.

// Let's add the node creation logic block replacement to make sure we don't dispatch an event AND create a node if typeToAdd is not set correctly.
const fixTypeToAdd = `      // Single key shortcuts for node creation
      if (!cmdOrCtrl && !e.shiftKey && !e.altKey && e.key) {
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
            window.dispatchEvent(new CustomEvent('open-search-history'));
            return;
        }
        
        if (typeToAdd) {
          e.preventDefault();
          saveHistory();
          
          let x = 300;
          let y = 300;
          
          if (rfInstance) {
            // Find center of current view
            const center = rfInstance.screenToFlowPosition({
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            });
            x = center.x;
            y = center.y;
          }
          
          // Get default data from NODE_MENU
          let defaults = { label: typeToAdd };
          for (const section of NODE_MENU) {
            const item = section.items.find(i => i.type === typeToAdd);
            if (item && item.defaults) {
              defaults = item.defaults;
              break;
            }
          }
          
          const newNode = {
            id: nextId(),
            type: typeToAdd,
            position: { x, y },
            data: { ...defaults },
          };
          setNodes(nds => [...nds, newNode]);
        }
      }`;

appJsx = appJsx.replace(
  /\/\/ Single key shortcuts for node creation[\s\S]*?saveHistory\(\);\n\s*\}\n\s*\}/,
  fixTypeToAdd
);

fs.writeFileSync('frontend/src/App.jsx', appJsx);
console.log("Patched App.jsx for Ctrl+.");
