const fs = require('fs');

const filesToFix = [
  'src/nodes/ConditionNode.tsx',
  'src/nodes/IterationNode.tsx',
  'src/nodes/VariableNode.tsx',
  'src/nodes/SocialPublisherNode.tsx',
  'src/nodes/CloudSyncNode.tsx'
];

for (const file of filesToFix) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/const \{ disconnectNode \} = useNodeConnections\(id, data\);/g, 'const { onDisconnectNode } = useNodeConnections();');
  content = content.replace(/onDisconnect=\{\(\) => disconnectNode\(\)\}/g, 'onDisconnect={() => onDisconnectNode && onDisconnectNode(id)}');
  content = content.replace(/import useNodeConnections from '.\/useNodeConnections';/g, "import { useNodeConnections } from './shared';");

  fs.writeFileSync(file, content);
}
console.log("Fixed!");
