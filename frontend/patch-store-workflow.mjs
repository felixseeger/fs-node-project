import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const replacement = `
  useEffect(() => {
    const current = workflows.find(w => w.id === activeWorkflowId) 
                 || sharedWorkflows?.find(w => w.id === activeWorkflowId)
                 || communityWorkflows?.find(w => w.id === activeWorkflowId) 
                 || fbWf
                 || null;
    setWorkflow(current);
  }, [activeWorkflowId, workflows, sharedWorkflows, communityWorkflows, fbWf, setWorkflow]);
`;

content = content.replace(
  /useEffect\(\(\) => \{\n\s*const current = workflows\.find\(w => w\.id === activeWorkflowId\) \|\| null;\n\s*setWorkflow\(current\);\n\s*\}, \[activeWorkflowId, workflows, setWorkflow\]\);/g,
  replacement
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx setWorkflow effect");
