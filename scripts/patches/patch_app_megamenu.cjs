const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'frontend', 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

const oldFunc = `const handleApplyModelToAll = useCallback(
    (kind: string, modelName: string) => {
      saveHistory();
      setNodes((nds) =>
        nds.map((n) => {
          if (kind === 'image' && n.type === 'universalGeneratorImage') {
            return {
              ...n,
              data: {
                ...n.data,
                models: [modelName],
                autoSelect: false,
                useMultiple: false,
              },
            };
          }
          if (kind === 'video' && n.type === 'universalGeneratorVideo') {
            return {
              ...n,
              data: {
                ...n.data,
                models: [modelName],
                autoSelect: false,
                useMultiple: false,
              },
            };
          }
          return n;
        })
      );
    },
    [saveHistory, setNodes]
  );`;

const newFunc = `const handleAddNodeFromMegaMenu = useCallback(
    (kind: string, modelName: string) => {
      const type = kind === 'image' ? 'universalGeneratorImage' : 'universalGeneratorVideo';
      addNodeAtViewportCenter(type, {
        models: [modelName],
        autoSelect: false,
        useMultiple: false,
      });
    },
    [addNodeAtViewportCenter]
  );`;

if (content.includes(oldFunc)) {
  content = content.replace(oldFunc, newFunc);
  console.log('Replaced function');
} else {
  console.log('Could not find old function');
}

const oldJsx = `<MegaMenuModelSearch open={browseModelsOpen} onClose={() => setBrowseModelsOpen(false)} onSelect={(k: string, m: string) => handleApplyModelToAll(k, m)} />`;
const newJsx = `<MegaMenuModelSearch open={browseModelsOpen} onClose={() => setBrowseModelsOpen(false)} onSelect={(k: string, m: string) => handleAddNodeFromMegaMenu(k, m)} />`;

if (content.includes(oldJsx)) {
  content = content.replace(oldJsx, newJsx);
  console.log('Replaced JSX');
} else {
  console.log('Could not find old JSX');
}

fs.writeFileSync(appPath, content);
