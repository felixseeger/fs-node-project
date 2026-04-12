const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = / {2}const nodeTypes = useMemo<NodeTypes>\([\s\S]*?\[\]\n {2}\);\n/m;
content = content.replace(regex, '');

fs.writeFileSync('src/App.tsx', content);
