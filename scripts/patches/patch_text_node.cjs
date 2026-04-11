const fs = require('fs');
const file = 'frontend/src/nodes/TextElementNode.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const handleInput = \(e\) => {[\s\S]*?};\n/g,
  ''
);

content = content.replace(
  /onInput={handleInput}\n/g,
  ''
);

fs.writeFileSync(file, content);
console.log('Patched TextElementNode.jsx');
