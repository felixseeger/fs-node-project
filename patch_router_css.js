const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/nodes/RouterNode.jsx', 'utf8');

// Remove overflowY: 'auto' and add padding-right: 16px to prevent clipping handles
jsx = jsx.replace(
  /padding: '8px 0 8px 8px', gap: 8, overflowY: 'auto'/,
  `padding: '8px 16px 8px 8px', gap: 8, overflowY: 'visible'`
);

// Fix the input handle clipping too!
jsx = jsx.replace(
  /width: '24px', borderRight: '1px dashed #333',/,
  `width: '24px', borderRight: '1px dashed #333', overflow: 'visible',`
);

fs.writeFileSync('frontend/src/nodes/RouterNode.jsx', jsx);
console.log("Patched RouterNode styles");
