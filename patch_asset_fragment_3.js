const fs = require('fs');
let jsx = fs.readFileSync('frontend/src/nodes/AssetNode.jsx', 'utf8');

// Use string replace exactly
const oldStr = `      <Handle type="source" position={Position.Right} style={{ top: 40 }} />
    </NodeShell>
      <UpdateAssetModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        nodeData={{ id, label: data.label || data.name, images }}
        onUpdate={(nodeId, patch) => data.onUpdate?.(nodeId, patch)}
      />
  );`;

const newStr = `      <Handle type="source" position={Position.Right} style={{ top: 40 }} />
    </NodeShell>
    <UpdateAssetModal 
      isOpen={isUpdateModalOpen}
      onClose={() => setIsUpdateModalOpen(false)}
      nodeData={{ id, label: data.label || data.name, images }}
      onUpdate={(nodeId, patch) => data.onUpdate?.(nodeId, patch)}
    />
  </>);`;

jsx = jsx.replace(oldStr, newStr);

const returnOld = `return (
    <NodeShell`;
const returnNew = `return (
  <>
    <NodeShell`;

jsx = jsx.replace(returnOld, returnNew);

fs.writeFileSync('frontend/src/nodes/AssetNode.jsx', jsx);
console.log("Fixed return statement");
