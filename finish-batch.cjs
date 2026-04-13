const fs = require('fs');
const path = require('path');

const sessionFile = path.join(process.cwd(), '.gemini/state/active-session.md');
if (fs.existsSync(sessionFile)) {
  let content = fs.readFileSync(sessionFile, 'utf-8');
  content = content.replace(/status: "in_progress"/g, 'status: "completed"');
  fs.writeFileSync(sessionFile, content);
  console.log('Marked batch phases 3 & 4 as completed.');
}
