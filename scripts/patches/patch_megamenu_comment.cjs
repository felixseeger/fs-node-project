const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'src', 'components', 'MegaMenuModelSearch.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /\/\*\*\n \* Full-screen Browse Models modal \(search, filters, grid\)\. Applies model to all universal generator nodes via onSelect\.\n \*\//,
  `/**
 * Full-screen Browse Models modal (search, filters, grid).
 * Calls onSelect with the chosen model kind and key.
 */`
);

fs.writeFileSync(filePath, content);
console.log('Patched MegaMenuModelSearch.tsx comment');
