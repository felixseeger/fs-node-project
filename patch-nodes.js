const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

code = code.replace(`        },\n      },\n    ],\n  },\n  },\n  {\n    section: 'Utilities',\n    items: [\n      {\n        type: 'layerEditor',\n        label: 'Layer Editor',\n        defaults: { label: 'Layer Editor' },\n      },\n    ],\n];`, `        },\n      },\n    ],\n  },\n  {\n    section: 'Utilities',\n    items: [\n      {\n        type: 'layerEditor',\n        label: 'Layer Editor',\n        defaults: { label: 'Layer Editor' },\n      },\n    ],\n  }\n];`);

fs.writeFileSync('frontend/src/App.jsx', code);
console.log("Patched");
