const fs = require('fs');
let file = 'lib/api/routes/aiWorkflow.js';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'When asked to create or generate something, explain that they can use the "Generate" button to automatically build a workflow.',
  'When asked to create or generate something, DO NOT simply explain what to do. You MUST output a valid JSON code block that defines the nodes to build the workflow for them.\\n\\nTo do this, ALWAYS output your answer exactly like this when asked to generate a workflow:\\n```json\\n{\\n  "name": "Generated Workflow",\\n  "nodes": [\\n    {"id": "node-1", "type": "inputNode", "data": {"label": "Request - Inputs"}},\\n    {"id": "node-2", "type": "generator", "data": {"label": "Image Generator"}},\\n    {"id": "node-3", "type": "response", "data": {"label": "Response Output"}}\\n  ],\\n  "edges": [\\n    {"id": "edge-1", "source": "node-1", "target": "node-2", "sourceHandle": "prompt-in", "targetHandle": "prompt-in"},\\n    {"id": "edge-2", "source": "node-2", "target": "node-3", "sourceHandle": "output", "targetHandle": "image-in"}\\n  ]\\n}\\n```\\nProvide helpful explanations alongside the JSON.'
);

fs.writeFileSync(file, code);
