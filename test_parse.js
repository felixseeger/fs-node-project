const content = `Here is the workflow:
\`\`\`json
{
  "nodes": [{"id": "1"}],
  "edges": []
}
\`\`\`
Have fun!`;
const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
console.log(jsonMatch ? jsonMatch[1] : null);
