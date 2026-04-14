import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  'workflows: firebaseWorkflows,',
  'workflows: firebaseWorkflows,\n    currentWorkflow: fbWf,'
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx to include fbWf");
