const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// Find the end of NODE_MENU
const match = code.match(/,\n      \},\n    \],\n  \},\n\];\n\nconst defaultNodes/);
if (match) {
  code = code.replace(match[0], `,\n      },\n    ],\n  },\n  {\n    section: 'Utilities',\n    items: [\n      { type: 'layerEditor', label: 'Layer Editor', defaults: { label: 'Layer Editor' } },\n    ],\n  },\n];\n\nconst defaultNodes`);
  fs.writeFileSync('frontend/src/App.jsx', code);
  console.log("Patched successfully");
} else {
  console.log("Could not match end of NODE_MENU");
}
