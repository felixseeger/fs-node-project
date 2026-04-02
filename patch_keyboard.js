const fs = require('fs');
let appJsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// Update the shortcut key mapping from batchNode to groupEditing
const oldSwitch = `case 'b': typeToAdd = 'batchNode'; break;`;
const newSwitch = `case 'b': typeToAdd = 'groupEditing'; break;`;

appJsx = appJsx.replace(oldSwitch, newSwitch);

fs.writeFileSync('frontend/src/App.jsx', appJsx);
console.log("Patched B shortcut");
