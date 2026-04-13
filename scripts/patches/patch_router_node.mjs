import fs from 'fs';
const path = 'frontend/src/nodes/RouterNode.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  "                style={{ \n                ...\n                style={{",
  "                style={{"
);
fs.writeFileSync(path, code);
