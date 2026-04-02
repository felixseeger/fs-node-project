const fs = require('fs');
let gooey = fs.readFileSync('frontend/src/GooeyNodesMenu.jsx', 'utf8');

// We need to add a useEffect to listen to 'open-search-history' and 'open-keyboard-shortcuts'
// Let's find a good place. Right after the state hooks.

const hookInjection = `  React.useEffect(() => {
    const handleOpenHistory = () => setShowHistoryModal(true);
    const handleOpenShortcuts = () => setShowShortcutsModal(true);
    window.addEventListener('open-search-history', handleOpenHistory);
    window.addEventListener('open-keyboard-shortcuts', handleOpenShortcuts);
    return () => {
      window.removeEventListener('open-search-history', handleOpenHistory);
      window.removeEventListener('open-keyboard-shortcuts', handleOpenShortcuts);
    };
  }, []);`;

gooey = gooey.replace(
  /const handleCategoryClick = \(category\) => \{/,
  `${hookInjection}\n\n  const handleCategoryClick = (category) => {`
);

fs.writeFileSync('frontend/src/GooeyNodesMenu.jsx', gooey);
console.log("Patched Gooey events");
