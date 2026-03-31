const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/nodes/CommentNode.jsx', 'utf8');

jsx = jsx.replace(
  /width: '100%', \s*height: '100%',/,
  `width: dimensions.width, height: dimensions.height,`
);

fs.writeFileSync('frontend/src/nodes/CommentNode.jsx', jsx);
console.log("Patched CommentNode dimensions");
