const fs = require('fs');
const path = require('path');

const stateDir = path.join(process.cwd(), '.gemini/state');
const planDir = path.join(process.cwd(), '.gemini/tmp/node-project/plans');

// 1. Create archive dirs
if (!fs.existsSync(path.join(stateDir, 'archive'))) fs.mkdirSync(path.join(stateDir, 'archive'), {recursive: true});
if (!fs.existsSync(path.join(planDir, 'archive'))) fs.mkdirSync(path.join(planDir, 'archive'), {recursive: true});

// 2. Move active session to archive
const sessionFile = path.join(stateDir, 'active-session.md');
if (fs.existsSync(sessionFile)) {
  fs.renameSync(sessionFile, path.join(stateDir, 'archive', '2026-04-13-remotion-layer-node.md'));
  console.log('Session archived successfully.');
}

// 3. Move plan to archive
const planFile = path.join(planDir, '2026-04-13-remotion-layer-node-impl-plan.md');
if (fs.existsSync(planFile)) {
  fs.renameSync(planFile, path.join(planDir, 'archive', '2026-04-13-remotion-layer-node-impl-plan.md'));
  console.log('Plan archived successfully.');
}

