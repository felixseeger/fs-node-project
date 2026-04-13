const fs = require('fs');
const path = 'frontend/src/main.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('import gsap')) {
  code = `import gsap from 'gsap';\nimport { useGSAP } from '@gsap/react';\n\n// Register GSAP plugins\ngsap.registerPlugin(useGSAP);\n\n` + code;
  fs.writeFileSync(path, code);
  console.log("Patched main.tsx successfully!");
} else {
  console.log("GSAP already imported.");
}
