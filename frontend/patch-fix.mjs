import fs from 'fs';

// 1. Fix useFirebaseWorkflows.ts to update currentWorkflow immediately on creation
let hookContent = fs.readFileSync('src/hooks/useFirebaseWorkflows.ts', 'utf-8');
if (!hookContent.includes('setCurrentWorkflow(newWorkflow)')) {
  hookContent = hookContent.replace(
    /await setDoc\(docRef, newWorkflow\);\n\s*return newWorkflow;/,
    `await setDoc(docRef, newWorkflow);
      setCurrentWorkflow(newWorkflow);
      return newWorkflow;`
  );
  fs.writeFileSync('src/hooks/useFirebaseWorkflows.ts', hookContent);
  console.log("Patched useFirebaseWorkflows.ts");
}

// 2. Fix App.tsx to fall back to the newly created local workflows and fbWf
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

appContent = appContent.replace(
  /workflows:\s*firebaseWorkflows,\n\s*communityWorkflows,/,
  `workflows: firebaseWorkflows,
    currentWorkflow: fbWf,
    communityWorkflows,`
);

appContent = appContent.replace(
  /useEffect\(\(\) => \{\n\s*const current = workflows\.find\(w => w\.id === activeWorkflowId\) \|\| null;\n\s*setWorkflow\(current\);\n\s*\}, \[activeWorkflowId, workflows, setWorkflow\]\);/g,
  `useEffect(() => {
    const current = workflows.find(w => w.id === activeWorkflowId) 
                 || sharedWorkflows?.find(w => w.id === activeWorkflowId)
                 || communityWorkflows?.find(w => w.id === activeWorkflowId) 
                 || fbWf
                 || null;
    setWorkflow(current);
  }, [activeWorkflowId, workflows, sharedWorkflows, communityWorkflows, fbWf, setWorkflow]);`
);

fs.writeFileSync('src/App.tsx', appContent);
console.log("Patched App.tsx");
