const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const before = content;
      // We will only remove onPointerDown={...} and onMouseDown={...} if they call stopPropagation
      content = content.replace(/onMouseDown=\{\(e\)\s*=>\s*e\.stopPropagation\(\)\}\s*/g, '');
      content = content.replace(/onPointerDown=\{\(e\)\s*=>\s*e\.stopPropagation\(\)\}\s*/g, '');

      if (before !== content) {
        fs.writeFileSync(fullPath, content);
        console.log(`Fixed ${fullPath}`);
      }
    }
  }
}

walk(path.join(__dirname, 'src/nodes'));
