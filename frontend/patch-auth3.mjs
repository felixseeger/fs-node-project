import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /setAuthInitialized\(true\);/m,
  `setAuthLoading(false);`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx to use setAuthLoading(false)");
