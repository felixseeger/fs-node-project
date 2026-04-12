const safeContent = "```json\n{}\n```";
const jsonRegex = /```(?:json)?\n([\s\S]*?)\n```/g;
let lastIndex = 0, match;
let iterations = 0;
while ((match = jsonRegex.exec(safeContent)) !== null) {
  console.log(match.index, jsonRegex.lastIndex);
  lastIndex = jsonRegex.lastIndex;
  iterations++;
  if (iterations > 10) { console.log("INFINITE LOOP"); break; }
}
