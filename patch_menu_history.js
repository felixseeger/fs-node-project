const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/GooeyNodesMenu.jsx', 'utf8');

const historyMenuEntry = `
      { id: 'history', title: 'History Logger', desc: 'Capture outputs over time', shortcut: 'H', type: 'history',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> },`;

jsx = jsx.replace(
  /\{ id: 'comment', title: 'Comment', desc: 'Add a note to canvas', shortcut: 'C', type: 'comment',/,
  `${historyMenuEntry}\n      { id: 'comment', title: 'Comment', desc: 'Add a note to canvas', shortcut: 'C', type: 'comment',`
);

fs.writeFileSync('frontend/src/GooeyNodesMenu.jsx', jsx);
console.log("Patched GooeyNodesMenu.jsx");
