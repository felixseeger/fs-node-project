const fs = require('fs');

let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

if (!code.includes('import WorkflowNode')) {
  code = code.replace(
    /import SourceMediaNode from '\.\/nodes\/SourceMediaNode';/,
    `import SourceMediaNode from './nodes/SourceMediaNode';\nimport WorkflowNode from './nodes/WorkflowNode';`
  );
}

if (!code.includes('workflowTemplate: WorkflowNode,')) {
  code = code.replace(
    /sourceMediaNode: SourceMediaNode,/,
    `sourceMediaNode: SourceMediaNode,\n      workflowTemplate: WorkflowNode,`
  );
}

fs.writeFileSync('frontend/src/App.jsx', code);
console.log('Patched App.jsx with WorkflowNode');
