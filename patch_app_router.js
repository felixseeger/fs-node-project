const fs = require('fs');

let appJsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Import
appJsx = appJsx.replace(
  /import CommentNode from '\.\/nodes\/CommentNode';/,
  `import CommentNode from './nodes/CommentNode';\nimport RouterNode from './nodes/RouterNode';`
);

// 2. Add to NODE_MENU (utilities section)
appJsx = appJsx.replace(
  /type: 'layerEditor',\n        label: 'Layer Editor',\n        defaults: \{ label: 'Layer Editor' \},\n      \},/,
  `type: 'layerEditor',\n        label: 'Layer Editor',\n        defaults: { label: 'Layer Editor' },\n      },\n      {\n        type: 'routerNode',\n        label: 'Router',\n        defaults: { label: 'Router', outputs: [{ id: 'out-1', label: 'Output 1' }, { id: 'out-2', label: 'Output 2' }] },\n      },`
);

// 3. Add to nodeTypes
appJsx = appJsx.replace(
  /comment: CommentNode,/,
  `comment: CommentNode,\n      routerNode: RouterNode,`
);

// 4. Update resolveInput logic
const resolveInputAddition = `} else if (sourceNode.type === 'routerNode') {
        const routedInput = resolveInput(sourceNode.id, 'in');
        if (routedInput !== null && routedInput !== undefined) {
          if (Array.isArray(routedInput)) results.push(...routedInput);
          else results.push(routedInput);
        }
      } else if (sourceNode.type === 'imageAnalyzer') {`;

appJsx = appJsx.replace(
  /\} else if \(sourceNode\.type === 'imageAnalyzer'\) \{/,
  resolveInputAddition
);

fs.writeFileSync('frontend/src/App.jsx', appJsx);
console.log("Patched App.jsx with RouterNode");
