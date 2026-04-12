const fs = require('fs');
const path = 'frontend/src/services/workflowService.ts';
let code = fs.readFileSync(path, 'utf8');

// Add import for processAssetsInObject
if (!code.includes("import { processAssetsInObject }")) {
  code = code.replace(
    "import type { Workflow } from '../types/workflow';",
    "import type { Workflow } from '../types/workflow';\nimport { processAssetsInObject } from './storageService';"
  );
}

// Patch createWorkflow
code = code.replace(
  "  const workflowData = {\n    ...serializeWorkflow(workflow),\n    userId,",
  "  // Upload any local assets to Firebase Storage before saving\n  const processedWorkflow = await processAssetsInObject(workflow);\n\n  const workflowData = {\n    ...serializeWorkflow(processedWorkflow),\n    userId,"
);

// Patch updateWorkflow
code = code.replace(
  "  if (updates.name !== undefined) updateData.name = updates.name;\n  if (updates.description !== undefined) updateData.description = updates.description;\n  if (updates.nodes !== undefined) {\n    updateData.nodes = JSON.parse(JSON.stringify(updates.nodes));\n    updateData.nodeCount = updates.nodes.length;\n  }\n  if (updates.edges !== undefined) {\n    updateData.edges = JSON.parse(JSON.stringify(updates.edges));\n  }",
  "  if (updates.name !== undefined) updateData.name = updates.name;\n  if (updates.description !== undefined) updateData.description = updates.description;\n\n  // Process nodes and edges to upload any local assets\n  let processedNodes = updates.nodes;\n  let processedEdges = updates.edges;\n  if (updates.nodes !== undefined || updates.edges !== undefined) {\n    const processed = await processAssetsInObject({ nodes: updates.nodes, edges: updates.edges });\n    if (updates.nodes !== undefined) processedNodes = processed.nodes;\n    if (updates.edges !== undefined) processedEdges = processed.edges;\n  }\n\n  if (processedNodes !== undefined) {\n    updateData.nodes = JSON.parse(JSON.stringify(processedNodes));\n    updateData.nodeCount = processedNodes.length;\n  }\n  if (processedEdges !== undefined) {\n    updateData.edges = JSON.parse(JSON.stringify(processedEdges));\n  }"
);

fs.writeFileSync(path, code);
console.log("Patched workflowService.ts");
