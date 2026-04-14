import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const effectBlock = `  useEffect(() => {
    const current = workflows.find(w => w.id === activeWorkflowId) 
                 || sharedWorkflows?.find(w => w.id === activeWorkflowId)
                 || communityWorkflows?.find(w => w.id === activeWorkflowId) 
                 || fbWf
                 || null;
    setWorkflow(current);
  }, [activeWorkflowId, workflows, sharedWorkflows, communityWorkflows, fbWf, setWorkflow]);\n`;

content = content.replace(effectBlock, '');

const targetStr = `  const { templates: fbTemplates, isLoading: templatesLoading } = firebaseTemplates;
  const { assets: fbAssets, isLoading: assetsLoading } = firebaseAssets;`;

content = content.replace(targetStr, effectBlock + '\n' + targetStr);

fs.writeFileSync('src/App.tsx', content);
console.log("Moved useEffect below hook dependencies.");
