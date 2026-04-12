const fs = require('fs');
let text = fs.readFileSync('src/nodes/RelightNode.jsx', 'utf8');
text = text.replace("import { useNodeConnections } from './shared';\nimport { getHandleColor } from '../utils/handleTypes';", "import { useNodeConnections } from './shared';\nimport { getHandleColor } from '../utils/handleTypes';\nimport { CATEGORY_COLORS } from './nodeTokens';");
fs.writeFileSync('src/nodes/RelightNode.jsx', text);

let text2 = fs.readFileSync('src/nodes/StyleTransferNode.jsx', 'utf8');
text2 = text2.replace("import { useNodeConnections } from './shared';\nimport { getHandleColor } from '../utils/handleTypes';", "import { useNodeConnections } from './shared';\nimport { getHandleColor } from '../utils/handleTypes';\nimport { CATEGORY_COLORS } from './nodeTokens';");
fs.writeFileSync('src/nodes/StyleTransferNode.jsx', text2);
console.log("Done");
