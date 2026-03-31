const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Import
jsx = jsx.replace(
  /import LayerEditorNode from '\.\/nodes\/LayerEditorNode';/,
  `import LayerEditorNode from './nodes/LayerEditorNode';\nimport CommentNode from './nodes/CommentNode';`
);

// 2. Add to NODE_MENU
jsx = jsx.replace(
  /type: 'layerEditor',\n        label: 'Layer Editor',\n        defaults: \{ label: 'Layer Editor' \},\n      \},/,
  `type: 'layerEditor',\n        label: 'Layer Editor',\n        defaults: { label: 'Layer Editor' },\n      },\n      {\n        type: 'comment',\n        label: 'Comment',\n        defaults: { label: 'Comment', text: '', isDone: false },\n      },`
);

// 3. Add to nodeTypes
jsx = jsx.replace(
  /layerEditor: LayerEditorNode,/,
  `layerEditor: LayerEditorNode,\n      comment: CommentNode,`
);

fs.writeFileSync('frontend/src/App.jsx', jsx);
console.log("Patched App.jsx for CommentNode");
