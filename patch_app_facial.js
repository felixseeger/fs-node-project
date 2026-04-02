const fs = require('fs');
let appJsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Import FacialEditingNode
if (!appJsx.includes('import FacialEditingNode')) {
  appJsx = appJsx.replace(
    /import GroupEditingNode from '\.\/nodes\/GroupEditingNode';/,
    `import GroupEditingNode from './nodes/GroupEditingNode';\nimport FacialEditingNode from './nodes/FacialEditingNode';`
  );
}

// 2. Add to NODE_MENU
if (!appJsx.includes("type: 'facialEditing'")) {
  // Find the 'image' submenu inside QUICK_ADD_SECTIONS or just add it to 'Add Source' or 'Utilities'
  // Actually in App.jsx NODE_MENU is just an array used for node defaults and matching.
  appJsx = appJsx.replace(
    /\{ type: 'groupEditing', label: 'Group Editor', defaults: \{ label: 'Group Editor' \} \},/,
    `{ type: 'groupEditing', label: 'Group Editor', defaults: { label: 'Group Editor' } },\n      { type: 'facialEditing', label: 'Facial Editor', defaults: { label: 'Facial Editor' } },`
  );
}

// 3. Add to nodeTypes
if (!appJsx.includes('facialEditing: FacialEditingNode')) {
  appJsx = appJsx.replace(
    /groupEditing: GroupEditingNode,/,
    `groupEditing: GroupEditingNode,\n      facialEditing: FacialEditingNode,`
  );
}

// 4. Update resolveInput logic
if (!appJsx.includes("sourceNode.type === 'facialEditing'")) {
  appJsx = appJsx.replace(
    /\} else if \(sourceNode\.type === 'groupEditing'\) \{/,
    `} else if (sourceNode.type === 'facialEditing') {
        if (sh === 'image-out' && sd.outputImage) results.push(sd.outputImage);
      } else if (sourceNode.type === 'groupEditing') {`
  );
}

// 5. Add F key to handleKeyDown
if (!appJsx.includes("case 'f': typeToAdd = 'facialEditing'; break;")) {
  appJsx = appJsx.replace(
    /case 'r': typeToAdd = 'routerNode'; break;/,
    `case 'r': typeToAdd = 'routerNode'; break;\n          case 'f': typeToAdd = 'facialEditing'; break;`
  );
}

// 6. Add trigger logic to handleRunWorkflow
if (!appJsx.includes("type === 'facialEditing'")) {
  appJsx = appJsx.replace(
    /const groupEdits = nodesRef\.current\.filter\(\(n\) => n\.type === 'groupEditing'\);/,
    `const facialEdits = nodesRef.current.filter((n) => n.type === 'facialEditing');
    if (facialEdits.length > 0) {
      for (const fe of facialEdits) {
        updateNodeData(fe.id, { triggerGenerate: Date.now() });
      }
      await new Promise((r) => setTimeout(r, 3000));
    }
    
    const groupEdits = nodesRef.current.filter((n) => n.type === 'groupEditing');`
  );
}

fs.writeFileSync('frontend/src/App.jsx', appJsx);
console.log("Patched App.jsx for FacialEditingNode");
