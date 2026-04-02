const fs = require('fs');
let gooey = fs.readFileSync('frontend/src/GooeyNodesMenu.jsx', 'utf8');

// I will add the 'F' shortcut and the 'Facial Editor' to the 'Images' submenu if it exists,
// or to 'Utilities' directly.
const imageSubmenuRegex = /hasSubmenu:\s*'Image',[\s\S]*?<\/svg>\s*\},/;
const newFacialEntry = `{ id: 'facial-edit', title: 'Facial Editor', desc: 'PixelSmile Expression Editor', shortcut: 'F', type: 'facialEditing',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"></path><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg> },\n      `;

if (gooey.match(imageSubmenuRegex)) {
  // Let's insert it into Utilities instead, so it appears alongside Layer Editor, Group Editing, etc.
  const groupEditRegex = /\{ id: 'group-edit', title: 'Group Editing', desc: 'Wan-VACE Batch Editor', shortcut: 'B', type: 'groupEditing',[\s\S]*?<\/svg> \},/;
  gooey = gooey.replace(groupEditRegex, `$&
      ${newFacialEntry}`);
  fs.writeFileSync('frontend/src/GooeyNodesMenu.jsx', gooey);
  console.log("Patched GooeyNodesMenu.jsx with FacialEditing");
} else {
  console.log("Could not find section in GooeyNodesMenu");
}
