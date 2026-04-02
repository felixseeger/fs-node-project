const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/nodes/AssetNode.jsx', 'utf8');

jsx = jsx.replace(
  /return \(\n\s*<NodeShell/,
  `return (\n    <>\n      <NodeShell`
);

jsx = jsx.replace(
  /onUpdate=\{\(nodeId, patch\) => data\.onUpdate\?\.ul\(nodeId, patch\)\}\n\s*\/>\n\s*\);\n\}/, // Wait, .ul is a typo from a previous attempt? Let's check exactly what's there
  ``
);

fs.writeFileSync('frontend/src/nodes/AssetNode.jsx', jsx);
console.log("Patched fragment again");
