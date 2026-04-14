import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const replacement = `
  useEffect(() => {
    const current = workflows.find(w => w.id === activeWorkflowId) 
                 || sharedWorkflows.find(w => w.id === activeWorkflowId)
                 || communityWorkflows.find(w => w.id === activeWorkflowId) 
                 || fbWf
                 || null;
    setWorkflow(current);
  }, [activeWorkflowId, workflows, sharedWorkflows, communityWorkflows, fbWf, setWorkflow]);
`;

content = content.replace(
  /useEffect\(\(\) => \{\s+const current = workflows\.find[\s\S]*?setWorkflow\);\n  \}\, \[activeWorkflowId, workflows, sharedWorkflows, communityWorkflows, setWorkflow\]\);/m,
  replacement
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx with fbWf fallback");
