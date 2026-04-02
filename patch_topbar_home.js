const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/TopBar.jsx', 'utf8');

// Fix the messy replacement from sed
jsx = jsx.replace(
  /\{ id: 'home', label: 'Back home', icon: '\{ id: 'workspaces', label: 'Back home', icon: '&#9864;' \}#9864;' \},/,
  `{ id: 'home', label: 'Back home', icon: '&#9864;' },`
);

fs.writeFileSync('frontend/src/TopBar.jsx', jsx);
console.log("Patched TopBar.jsx");
