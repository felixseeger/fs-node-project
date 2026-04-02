const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

jsx = jsx.replace(
  /panOnDrag=\{!isLocked\}\n\s*zoomOnScroll=\{!isLocked\}\n\s*nodesDraggable=\{!isLocked\}\n\s*edgesUpdatable=\{!isLocked\}\n\s*elementsSelectable=\{!isLocked\}/,
  `panOnDrag={isLocked ? false : [1, 2]}
            selectionOnDrag={!isLocked}
            selectionMode="partial"
            zoomOnScroll={!isLocked}
            nodesDraggable={!isLocked}
            edgesUpdatable={!isLocked}
            elementsSelectable={!isLocked}`
);

fs.writeFileSync('frontend/src/App.jsx', jsx);
console.log("Patched ReactFlow props for rectangle selection");
