const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/nodes/RouterNode.jsx', 'utf8');

// 1. Import useUpdateNodeInternals
jsx = jsx.replace(
  /import \{ Position, Handle, NodeResizer \} from '@xyflow\/react';/,
  `import { Position, Handle, NodeResizer, useUpdateNodeInternals } from '@xyflow/react';`
);

// 2. Initialize useUpdateNodeInternals and add useEffect
jsx = jsx.replace(
  /const outputs = data\.outputs \|\| \[\{ id: 'out-1', label: 'Output 1' \}\];/,
  `const updateNodeInternals = useUpdateNodeInternals();\n  const outputs = data.outputs || [{ id: 'out-1', label: 'Output 1' }];\n\n  React.useEffect(() => {\n    updateNodeInternals(id);\n  }, [outputs.length, id, updateNodeInternals]);`
);

fs.writeFileSync('frontend/src/nodes/RouterNode.jsx', jsx);
console.log("Patched RouterNode.jsx with useUpdateNodeInternals");
