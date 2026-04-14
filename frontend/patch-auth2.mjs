import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /const unsubscribeAuth = \(\) => \{\};/m,
  `const unsubscribeAuth = () => {};
      setAuthInitialized(true);`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx to include setAuthInitialized(true)");
