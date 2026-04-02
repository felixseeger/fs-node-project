const fs = require('fs');
let gooey = fs.readFileSync('frontend/src/GooeyNodesMenu.jsx', 'utf8');

// Replace the old batchNode entry with the new groupEditing node entry
const oldBatchRegex = /\{ id: 'batch', title: 'Batch', desc: 'Process multiple items at once', shortcut: 'B', type: 'batchNode',\s*icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"><\/path><\/svg> \},/;

const newGroupEditingEntry = `{ id: 'group-edit', title: 'Group Editing', desc: 'Wan-VACE Batch Editor', shortcut: 'B', type: 'groupEditing',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg> },`;

if (gooey.match(oldBatchRegex)) {
  gooey = gooey.replace(oldBatchRegex, newGroupEditingEntry);
  fs.writeFileSync('frontend/src/GooeyNodesMenu.jsx', gooey);
  console.log("Patched GooeyNodesMenu.jsx with GroupEditing");
} else {
  console.log("Could not find batchNode in GooeyNodesMenu");
}
