const fs = require('fs');
let gooey = fs.readFileSync('frontend/src/GooeyNodesMenu.jsx', 'utf8');

// 1. Add import for SearchHistoryMenu
gooey = gooey.replace(
  /import AssetModal from '\.\/AssetModal';/,
  `import AssetModal from './AssetModal';\nimport SearchHistoryMenu from './SearchHistoryMenu';`
);

// 2. Add state for the modal
gooey = gooey.replace(
  /const \[showAssetModal, setShowAssetModal\] = useState\(false\);/,
  `const [showAssetModal, setShowAssetModal] = useState(false);\n  const [showHistoryModal, setShowHistoryModal] = useState(false);`
);

// 3. Render the modal at the bottom
gooey = gooey.replace(
  /<AssetModal isOpen=\{showAssetModal\} onClose=\{\(\) => setShowAssetModal\(false\)\} onUpload=\{onAddNode\} \/>/,
  `<AssetModal isOpen={showAssetModal} onClose={() => setShowAssetModal(false)} onUpload={onAddNode} />\n      {/* Search History Modal */}\n      <SearchHistoryMenu isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} />`
);

// 4. Make window.openSearchHistory work for the onclick we added earlier
// Well, we added: `if (window.openSearchHistory) window.openSearchHistory();`
// We should actually just implement it right here in GooeyNodesMenu.
// Let's replace the onClick handler again to correctly toggle the local state.
const oldClick = `onClick={() => {
                          if (item.type === 'searchHistory') {
                            if (window.openSearchHistory) window.openSearchHistory();
                          } else {
                            onAddNode(item.type);
                          }
                          setIsOpen(false);
                        }}`;

const newClick = `onClick={() => {
                          if (item.type === 'searchHistory') {
                            setShowHistoryModal(true);
                          } else {
                            onAddNode(item.type);
                          }
                          setIsOpen(false);
                        }}`;

gooey = gooey.replace(oldClick, newClick);

fs.writeFileSync('frontend/src/GooeyNodesMenu.jsx', gooey);
console.log("Patched GooeyNodesMenu.jsx with SearchHistoryMenu component");
