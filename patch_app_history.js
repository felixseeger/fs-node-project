const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Import
jsx = jsx.replace(
  /import CommentNode from '\.\/nodes\/CommentNode';/,
  `import CommentNode from './nodes/CommentNode';\nimport HistoryNode from './nodes/HistoryNode';`
);

// 2. Add to NODE_MENU
jsx = jsx.replace(
  /type: 'comment',\n        label: 'Comment',\n        defaults: \{ label: 'Comment', text: '', isDone: false \},\n      \},/,
  `type: 'comment',\n        label: 'Comment',\n        defaults: { label: 'Comment', text: '', isDone: false },\n      },\n      {\n        type: 'history',\n        label: 'History Logger',\n        defaults: { label: 'History Logger', items: [] },\n      },`
);

// 3. Add to nodeTypes
jsx = jsx.replace(
  /comment: CommentNode,/,
  `comment: CommentNode,\n      history: HistoryNode,`
);

fs.writeFileSync('frontend/src/App.jsx', jsx);
console.log("Patched App.jsx for HistoryNode");
