import fs from 'fs';
let content = fs.readFileSync('src/hooks/useFirebaseWorkflows.ts', 'utf-8');

content = content.replace(
  'await setDoc(docRef, newWorkflow);\n      return newWorkflow;',
  'await setDoc(docRef, newWorkflow);\n      setCurrentWorkflow(newWorkflow);\n      return newWorkflow;'
);

fs.writeFileSync('src/hooks/useFirebaseWorkflows.ts', content);
console.log("Patched useFirebaseWorkflows.ts");
