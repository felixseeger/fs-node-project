const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/TopBar.jsx', 'utf8');

jsx = jsx.replace(
  /else if \(item.id === 'editor' && currentPage !== 'editor'\) onNavigate\('home'\);/,
  `else if (item.id === 'editor') onNavigate('home');`
);

jsx = jsx.replace(
  /else if \(item.id === 'new-project'\) onNavigate\('home'\);/,
  ``
);

fs.writeFileSync('frontend/src/TopBar.jsx', jsx);
console.log("Patched New Project");
