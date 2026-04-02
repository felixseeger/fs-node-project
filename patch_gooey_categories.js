const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/GooeyNodesMenu.jsx', 'utf8');

// 1. Add Search Icon to Icons
const searchIconCode = `  Search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,`;
jsx = jsx.replace(
  /const Icons = \{/,
  `const Icons = {\n${searchIconCode}`
);

// 2. Add SearchHistory to CATEGORIES
jsx = jsx.replace(
  /const CATEGORIES = \[\n\s*\{ id: 'Uploads', icon: Icons\.Folder, title: 'Uploaded Files' \},\n\s*\{ id: 'Workflows', icon: Icons\.Flash, title: 'Workflows' \},\n\s*\{ id: 'Assets', icon: Icons\.Hash, title: 'Assets' \},\n\];/,
  `const CATEGORIES = [
  { id: 'Uploads', icon: Icons.Folder, title: 'Uploaded Files' },
  { id: 'Workflows', icon: Icons.Flash, title: 'Workflows' },
  { id: 'Assets', icon: Icons.Hash, title: 'Assets' },
  { id: 'SearchHistory', icon: Icons.Search, title: 'Search History' },
];`
);

// 3. Update the onClick handler for CATEGORIES map
const oldClick = `onClick={(e) => { e.preventDefault(); handleCategoryClick(cat.id); }}`;
const newClick = `onClick={(e) => { 
                    e.preventDefault(); 
                    if (cat.id === 'SearchHistory') {
                      setShowHistoryModal(true);
                      setIsOpen(false);
                      setActiveCategory(null);
                      setShowHelpMenu(false);
                    } else {
                      handleCategoryClick(cat.id); 
                    }
                  }}`;
jsx = jsx.replace(oldClick, newClick);

// 4. Remove 'search-history' from QUICK_ADD_SECTIONS since it's now in the first level
const searchMenuEntryRegex = /\s*\{\s*id:\s*'search-history',\s*title:\s*'Search History',[\s\S]*?<\/svg>\s*\},\n/;
jsx = jsx.replace(searchMenuEntryRegex, '');

fs.writeFileSync('frontend/src/GooeyNodesMenu.jsx', jsx);
console.log("Patched CATEGORIES with Search History");
