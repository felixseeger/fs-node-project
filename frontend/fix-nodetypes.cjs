const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /  const nodeTypes = useMemo<NodeTypes>\([\s\S]*?\[\]\n  \);\n/m;
content = content.replace(regex, '');

fs.writeFileSync('src/App.tsx', content);
