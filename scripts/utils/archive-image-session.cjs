const fs = require('fs');
const path = require('path');

const stateDir = path.join(process.cwd(), '.gemini/state');

// 2. Move active session to archive
const sessionFile = path.join(stateDir, 'active-session.md');
if (fs.existsSync(sessionFile)) {
  fs.renameSync(sessionFile, path.join(stateDir, 'archive', '2026-04-13-image-processing.md'));
  console.log('Session archived successfully.');
}
