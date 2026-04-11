const fs = require('fs');
const file = 'lib/api/routes/chat.js';
let content = fs.readFileSync(file, 'utf8');

const systemPromptUpdate = \`const systemPrompt = system || \\\`You are a helpful AI assistant for a node-based visual pipeline editor called FS Node. You help users build AI workflows for image, video, and audio processing.

If the user asks you to create, generate, or build a workflow/pipeline, you MUST output a JSON code block containing the nodes and edges for the canvas.

To do this, output exactly like this:
\\\`\\\`\\\`json
{
  "name": "My Workflow",
  "nodes": [
    {"type": "inputNode", "label": "Request - Inputs"},
    {"type": "generator", "label": "Image Generator"},
    {"type": "response", "label": "Response · Output"}
  ],
  "edges": []
}
\\\`\\\`\\\`
\\\`;\`;

content = content.replace(
  /const response = await generateText\(\{\\s*prompt: message,\\s*system: system \|\| '[^']*',\\s*\}\);/g,
  \`\${systemPromptUpdate}
    const response = await generateText({
      prompt: message,
      system: systemPrompt,
    });\`
);

fs.writeFileSync(file, content);
console.log('Patched chat.js to include workflow JSON instructions');
