const fs = require('fs');

function replace(file, search, replace) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
}

// 1. GroupEditingNode.jsx missing alt
replace('src/nodes/GroupEditingNode.jsx',
  '<img key={i} src={src} style={{ height: 34',
  '<img key={i} src={src} alt="" style={{ height: 34');

replace('src/nodes/GroupEditingNode.jsx',
  '<img key={i} src={src} style={{ width: \'100%\'',
  '<img key={i} src={src} alt="" style={{ width: \'100%\'');

// 2. ProfileModal.tsx overlay
replace('src/ProfileModal.tsx',
  '<div className="pm-overlay" onClick={onClose}>',
  '<div className="pm-overlay" onClick={onClose} role="presentation" tabIndex={-1}>');

// 3. ProjectCard.tsx div onClick
replace('src/projectsDashboard/components/ProjectCard.tsx',
  '<div onClick={onClick} onContextMenu={(e) => onContextMenu(e, project)} className="group relative flex flex-col',
  '<div onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === \'Enter\' || e.key === \' \') onClick(); }} onContextMenu={(e) => onContextMenu(e, project)} className="group relative flex flex-col');

// 4. App.tsx div onClick
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');
appTsx = appTsx.replace(
  /<div key=\{item\.action\} onClick=\{e => \{ e\.stopPropagation\(\); handleMenuAction\((.*?)\); \}\} className="(.*?)"(.*?)>/g,
  '<div key={item.action} role="button" tabIndex={0} onClick={e => { e.stopPropagation(); handleMenuAction($1); }} onKeyDown={e => { if (e.key === \'Enter\' || e.key === \' \') { e.stopPropagation(); handleMenuAction($1); } }} className="$2"$3>'
);
fs.writeFileSync('src/App.tsx', appTsx);
console.log('Fixed App.tsx action items');
