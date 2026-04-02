const fs = require('fs');

// 1. Remove from GooeyNodesMenu
let gooey = fs.readFileSync('frontend/src/GooeyNodesMenu.jsx', 'utf8');
const historyMenuEntryRegex = /\{\s*id:\s*'history',\s*title:\s*'History Logger',[\s\S]*?<\/svg>\s*},\n/;
gooey = gooey.replace(historyMenuEntryRegex, '');

// Rename 'comment' to 'search-history' just to keep the spacing right if we wanted, but let's just add the Search History Menu.
// Actually, the user says "change History node to a Search History Menu like in reference image...".
// This means replacing the node in the menu with a trigger for the new Search History Menu.

const newMenuEntry = `
      { id: 'search-history', title: 'Search History', desc: 'View past generations', shortcut: 'H', type: 'searchHistory',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> },
`;

gooey = gooey.replace(
  /\{ id: 'comment', title: 'Comment', desc: 'Add a note to canvas', shortcut: 'C', type: 'comment',/,
  `${newMenuEntry}      { id: 'comment', title: 'Comment', desc: 'Add a note to canvas', shortcut: 'C', type: 'comment',`
);

// We need a way for the menu click to trigger the Search History modal instead of adding a node.
// Currently `onAddNode(item.type)` is called.
// So in GooeyNodesMenu:
const menuClickRegex = /onClick=\{\(\) => \{\n\s*onAddNode\(item.type\);\n\s*setIsOpen\(false\);\n\s*\}\}/;
const newMenuClick = `onClick={() => {
                          if (item.type === 'searchHistory') {
                            if (window.openSearchHistory) window.openSearchHistory();
                          } else {
                            onAddNode(item.type);
                          }
                          setIsOpen(false);
                        }}`;
gooey = gooey.replace(menuClickRegex, newMenuClick);

fs.writeFileSync('frontend/src/GooeyNodesMenu.jsx', gooey);

// 2. Remove from App.jsx
let app = fs.readFileSync('frontend/src/App.jsx', 'utf8');

app = app.replace(/import HistoryNode from '\.\/nodes\/HistoryNode';\n/, '');

app = app.replace(/\{\s*type:\s*'history',\s*label:\s*'History Logger',\s*defaults:\s*\{\s*label:\s*'History Logger',\s*items:\s*\[\]\s*\},\s*\},\n\s*/, '');

app = app.replace(/history:\s*HistoryNode,\n\s*/, '');

fs.writeFileSync('frontend/src/App.jsx', app);
console.log("Removed HistoryNode and added Search History to menu");
