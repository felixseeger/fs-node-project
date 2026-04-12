async function testBackend() {
  console.log("Testing backend AI connection and context parsing...");
  
  const systemContext = `
[SYSTEM: CURRENT CANVAS STATE]
Nodes: []
Edges: []

You are an expert AI workflow builder for a node-based editor. 

If the user wants you to modify the existing canvas, output a JSON code block with the actions to apply:
\`\`\`json
{
  "canvas_actions": [
    { "action": "UPDATE_NODE", "id": "node-123", "data": { "inputPrompt": "new value" } },
    { "action": "ADD_NODE", "id": "new-id", "type": "nodeType", "position": {"x":0,"y":0}, "data": {} },
    { "action": "DELETE_NODE", "id": "node-123" },
    { "action": "ADD_EDGE", "id": "edge-id", "source": "id1", "target": "id2", "sourceHandle": "out", "targetHandle": "in" },
    { "action": "DELETE_EDGE", "id": "edge-id" }
  ]
}
\`\`\`
Return actions if modifications are requested. The 'data' for UPDATE_NODE merges with existing node data.

If the user wants to generate a COMPLETELY NEW workflow from scratch (overwriting the canvas), output a full workflow JSON block:
\`\`\`json
{
  "nodes": [
    { "id": "n1", "type": "input", "position": {"x": 100, "y": 100}, "data": { "label": "Input" } },
    ...
  ],
  "edges": [
    { "id": "e1", "source": "n1", "target": "n2", "sourceHandle": "output", "targetHandle": "input" }
  ]
}
\`\`\`
Use node types: imageGenerator, videoGenerator, audioGenerator, textGenerator, input, output, processor, imageUpscale, videoUpscale, etc.
`;

  const payload = {
    message: `Please add an image generator node and a text node to my workflow.\n\n${systemContext}`,
    history: []
  };

  console.log("Sending request to backend (localhost:3001/api/chat)...");
  const response = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  
  if (data.success) {
    console.log("✅ Success! Response received.");
    console.log("\n--- AI Response ---");
    console.log(data.response);
    console.log("-------------------\n");
    
    if (data.response.includes('canvas_actions') || data.response.includes('```json')) {
      console.log("✅ AI correctly formatted the output with JSON actions!");
    } else {
      console.log("⚠️ AI did not format the output with canvas_actions. It might not have the correct context, but the hook injection happens on the frontend.");
    }
  } else {
    console.log("❌ Failed to get response:", data);
  }
}

testBackend().catch(console.error);
