const fs = require('fs');
let code = fs.readFileSync('frontend/src/nodes/LayerEditorNode.jsx', 'utf8');

code = code.replace(
  /const \[dimensions, setDimensions\] = useState\(\{ width: 2048, height: 2048 \}\);/,
  `const [dimensions, setDimensions] = useState({ width: 2048, height: 2048 });`
);

code = code.replace(
  /<div style=\{\{\s*width: '100%',\s*height: '100%',\s*minWidth: 256,\s*minHeight: 256,/,
  `<div style={{ \n        width: dimensions.width, \n        height: dimensions.height, \n        minWidth: 256,\n        minHeight: 256,`
);

fs.writeFileSync('frontend/src/nodes/LayerEditorNode.jsx', code);
console.log("Patched sizes");
