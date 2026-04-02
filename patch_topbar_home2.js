const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/TopBar.jsx', 'utf8');

// I see the previous step actually had "Workspaces" taking you to "Workspaces". We want "Back home" to go to "home" (workflows).
// Let's also restore the "Workspaces" link to exist but call it "Workspaces". Wait, the instruction is just "make Back home link to Homepage".
// Previously we changed the label of the 'workspaces' link to 'Back home'. Now we're changing its id to 'home'.
// But we already have a 'home' link labeled 'Workflows'. Let's clean this up.

const defaultMenuItems = `  const defaultMenuItems = [
    { id: 'workspaces', label: 'Workspaces', icon: '&#9864;' },
    { id: 'home', label: 'Back home', icon: '&#9776;' },
    { id: 'editor', label: 'New Workflow', icon: '&#43;' },
    { id: 'divider-1', type: 'divider' },
    { id: 'workflow-settings', label: 'Workflow Settings', icon: '&#9881;' },
    { id: 'profile', label: 'Profile', icon: '&#9786;' },
    { id: 'divider-2', type: 'divider' },
    { id: 'logout', label: 'Sign Out', icon: '&#10140;' },
  ];`;

jsx = jsx.replace(
  /const defaultMenuItems = \[\s*\{ id: 'home', label: 'Back home', icon: '&#9864;' \},\s*\{ id: 'home', label: 'Workflows', icon: '&#9776;' \},\s*\{ id: 'editor', label: 'New Workflow', icon: '&#43;' \},\s*\{ id: 'divider-1', type: 'divider' \},\s*\{ id: 'workflow-settings', label: 'Workflow Settings', icon: '&#9881;' \},\s*\{ id: 'profile', label: 'Profile', icon: '&#9786;' \},\s*\{ id: 'divider-2', type: 'divider' \},\s*\{ id: 'logout', label: 'Sign Out', icon: '&#10140;' \},\s*\];/,
  defaultMenuItems
);

fs.writeFileSync('frontend/src/TopBar.jsx', jsx);
console.log("Patched TopBar.jsx");
