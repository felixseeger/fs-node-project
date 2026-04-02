const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/nodes/AssetNode.jsx', 'utf8');

// Add import for UpdateAssetModal and useState
jsx = jsx.replace(
  /import React, \{ useRef \} from 'react';/,
  `import React, { useRef, useState } from 'react';\nimport UpdateAssetModal from '../UpdateAssetModal';`
);

// Add state for modal
jsx = jsx.replace(
  /const \{ disconnectNode \} = useNodeConnections\(id, data\);/,
  `const { disconnectNode } = useNodeConnections(id, data);\n  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);`
);

// Pass onEdit to NodeShell
jsx = jsx.replace(
  /onDisconnect=\{disconnectNode\}/,
  `onDisconnect={disconnectNode}\n      onEdit={() => setIsUpdateModalOpen(true)}`
);

// Add the modal component at the end
jsx = jsx.replace(
  /<\/NodeShell>/,
  `</NodeShell>\n      <UpdateAssetModal \n        isOpen={isUpdateModalOpen}\n        onClose={() => setIsUpdateModalOpen(false)}\n        nodeData={{ id, label: data.label || data.name, images }}\n        onUpdate={(nodeId, patch) => data.onUpdate?.(nodeId, patch)}\n      />`
);

fs.writeFileSync('frontend/src/nodes/AssetNode.jsx', jsx);
console.log("Patched AssetNode.jsx with UpdateAssetModal");
