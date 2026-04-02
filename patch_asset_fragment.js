const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/nodes/AssetNode.jsx', 'utf8');

jsx = jsx.replace(
  /<NodeShell/,
  `<>
    <NodeShell`
);

jsx = jsx.replace(
  /<\/UpdateAssetModal>/,
  `</UpdateAssetModal>
    </>`
);

fs.writeFileSync('frontend/src/nodes/AssetNode.jsx', jsx);
console.log("Wrapped AssetNode in fragment");
