const fs = require('fs');
const path = require('path');

const sessionFile = path.join(process.cwd(), '.gemini/state/active-session.md');
if (fs.existsSync(sessionFile)) {
  let content = fs.readFileSync(sessionFile, 'utf-8');
  content = content.replace(/execution_mode: null/, 'execution_mode: "sequential"\nexecution_backend: "native"');
  fs.writeFileSync(sessionFile, content);
  console.log('Updated execution_mode to sequential in local state');
}
