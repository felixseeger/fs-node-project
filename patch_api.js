const fs = require('fs');
let code = fs.readFileSync('frontend/src/utils/api.js', 'utf8');

code = code.replace(
  /const API_BASE = 'http:\/\/localhost:3001';/,
  `const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3001';`
);

fs.writeFileSync('frontend/src/utils/api.js', code);
console.log("Patched API_BASE");
