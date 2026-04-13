const fs = require('fs');
const path = require('path');

const sessionFile = path.join('/Users/felixseeger/.gemini/state', 'active-session.md');
console.log('Trying path:', sessionFile);

// Also try project local fallback just in case
const fallbackFile = path.join(process.cwd(), '.gemini/state/active-session.md');
console.log('Trying fallback:', fallbackFile);

if (fs.existsSync(sessionFile)) {
  let content = fs.readFileSync(sessionFile, 'utf-8');
  content = content.replace(/execution_mode: ".*"/, 'execution_mode: "parallel"');
  fs.writeFileSync(sessionFile, content);
  console.log('Updated execution_mode to parallel in global state');
} else if (fs.existsSync(fallbackFile)) {
  let content = fs.readFileSync(fallbackFile, 'utf-8');
  content = content.replace(/execution_mode: ".*"/, 'execution_mode: "parallel"');
  fs.writeFileSync(fallbackFile, content);
  console.log('Updated execution_mode to parallel in local state');
} else {
  console.log('Active session file not found anywhere');
}
