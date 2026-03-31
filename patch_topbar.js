const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/TopBar.jsx', 'utf8');

// 1. Add "Workspaces" to menu
jsx = jsx.replace(
  /const menuItems = \[/,
  `const menuItems = [\n    { id: 'workspaces', label: 'Workspaces', icon: '&#9864;' },`
);

// 2. Update Breadcrumb to "Workspaces / Workflows" or "Workspaces"
// Currently: 
// <button onClick={() => onNavigate('home')}>Workflows</button>

fs.writeFileSync('frontend/src/TopBar.jsx', jsx);
console.log("Patched TopBar.jsx");
