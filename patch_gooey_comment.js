const fs = require('fs');

let gooey = fs.readFileSync('frontend/src/GooeyNodesMenu.jsx', 'utf8');

// 1. Add Comment icon to Icons
const commentIconCode = `  Comment: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,`;
gooey = gooey.replace(
  /const Icons = \{/,
  `const Icons = {\n${commentIconCode}`
);

// 2. Add Comment to CATEGORIES
gooey = gooey.replace(
  /const CATEGORIES = \[\n\s*\{ id: 'Uploads', icon: Icons\.Folder, title: 'Uploaded Files' \},\n\s*\{ id: 'Workflows', icon: Icons\.Flash, title: 'Workflows' \},\n\s*\{ id: 'Assets', icon: Icons\.Hash, title: 'Assets' \},\n\s*\{ id: 'SearchHistory', icon: Icons\.Search, title: 'Search History' \},\n\];/,
  `const CATEGORIES = [
  { id: 'Uploads', icon: Icons.Folder, title: 'Uploaded Files' },
  { id: 'Workflows', icon: Icons.Flash, title: 'Workflows' },
  { id: 'Assets', icon: Icons.Hash, title: 'Assets' },
  { id: 'SearchHistory', icon: Icons.Search, title: 'Search History' },
  { id: 'Comment', icon: Icons.Comment, title: 'Add Comment' },
];`
);

// 3. Update the onClick handler in CATEGORIES map
const oldClick = `if (cat.id === 'SearchHistory') {
                      setShowHistoryModal(true);
                      setIsOpen(false);
                      setActiveCategory(null);
                      setShowHelpMenu(false);
                    } else {
                      handleCategoryClick(cat.id); 
                    }`;
const newClick = `if (cat.id === 'SearchHistory') {
                      setShowHistoryModal(true);
                      setIsOpen(false);
                      setActiveCategory(null);
                      setShowHelpMenu(false);
                    } else if (cat.id === 'Comment') {
                      onAddNode('comment', { label: 'Comment' });
                      setIsOpen(false);
                      setActiveCategory(null);
                      setShowHelpMenu(false);
                    } else {
                      handleCategoryClick(cat.id); 
                    }`;
gooey = gooey.replace(oldClick, newClick);

// 4. Remove comment from QUICK_ADD_SECTIONS Utilities
const commentMenuEntryRegex = /\s*\{\s*id:\s*'comment',\s*title:\s*'Comment',[\s\S]*?<\/svg>\s*\},\n/;
gooey = gooey.replace(commentMenuEntryRegex, '');

fs.writeFileSync('frontend/src/GooeyNodesMenu.jsx', gooey);
console.log("Patched CATEGORIES with Comment");
