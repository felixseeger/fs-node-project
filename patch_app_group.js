const fs = require('fs');

let appJsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Import GroupEditingNode
if (!appJsx.includes('import GroupEditingNode')) {
  appJsx = appJsx.replace(
    /import RouterNode from '\.\/nodes\/RouterNode';/,
    `import RouterNode from './nodes/RouterNode';\nimport GroupEditingNode from './nodes/GroupEditingNode';`
  );
}

// 2. Add to NODE_MENU
if (!appJsx.includes("type: 'groupEditing'")) {
  appJsx = appJsx.replace(
    /\{ type: 'routerNode', label: 'Router', defaults: \{ label: 'Router', outputs: \[\{ id: 'out-1', label: 'Output 1' \}, \{ id: 'out-2', label: 'Output 2' \}\] \} \},/,
    `{ type: 'routerNode', label: 'Router', defaults: { label: 'Router', outputs: [{ id: 'out-1', label: 'Output 1' }, { id: 'out-2', label: 'Output 2' }] } },\n      { type: 'groupEditing', label: 'Group Editor', defaults: { label: 'Group Editor' } },`
  );
}

// 3. Add to nodeTypes
if (!appJsx.includes('groupEditing: GroupEditingNode')) {
  appJsx = appJsx.replace(
    /routerNode: RouterNode,/,
    `routerNode: RouterNode,\n      groupEditing: GroupEditingNode,`
  );
}

// 4. Update resolveInput logic
if (!appJsx.includes("sourceNode.type === 'groupEditing'")) {
  const resolveInputAddition = `} else if (sourceNode.type === 'groupEditing') {
        if (sh === 'images-out' && sd.outputImages) results.push(...sd.outputImages);
      } else if (sourceNode.type === 'imageAnalyzer') {`;

  appJsx = appJsx.replace(
    /\} else if \(sourceNode\.type === 'imageAnalyzer'\) \{/,
    resolveInputAddition
  );
}

if (!appJsx.includes("sourceNode.type === 'layerEditor'")) {
  const resolveInputAddition2 = `} else if (sourceNode.type === 'layerEditor') {
        if (sh === 'image-out' && sd.outputImage) results.push(sd.outputImage);
      } else if (sourceNode.type === 'groupEditing') {`;

  appJsx = appJsx.replace(
    /\} else if \(sourceNode\.type === 'groupEditing'\) \{/,
    resolveInputAddition2
  );
}

// 5. Update handleRunWorkflow
if (!appJsx.includes("type === 'groupEditing'")) {
  // It triggers manually from the node, or we can trigger it in step 1.7
  // Let's add it to handleRunWorkflow:
  const triggerLogic = `
    // Step 1.8: Trigger all groupEditing nodes
    const groupEdits = nodesRef.current.filter((n) => n.type === 'groupEditing');
    if (groupEdits.length > 0) {
      for (const ge of groupEdits) {
        updateNodeData(ge.id, { triggerGenerate: Date.now() });
      }
      await new Promise((r) => setTimeout(r, 4000));
    }
  `;

  appJsx = appJsx.replace(
    /\/\/ Step 2: Extract all target text generation nodes/,
    `${triggerLogic}\n\n    // Step 2: Extract all target text generation nodes`
  );
}

fs.writeFileSync('frontend/src/App.jsx', appJsx);
console.log("Patched App.jsx for GroupEditingNode");
