const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/GooeyNodesMenu.jsx', 'utf8');

const commentMenuEntry = `
      { id: 'comment', title: 'Comment', desc: 'Add a note to canvas', shortcut: 'C', type: 'comment',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> },`;

jsx = jsx.replace(
  /\{ id: 'layer', title: 'Layer Editor', desc: 'Combine images together', shortcut: 'L', type: 'layerEditor',/,
  `${commentMenuEntry}\n      { id: 'layer', title: 'Layer Editor', desc: 'Combine images together', shortcut: 'L', type: 'layerEditor',`
);

fs.writeFileSync('frontend/src/GooeyNodesMenu.jsx', jsx);
console.log("Patched GooeyNodesMenu.jsx");
