const fs = require('fs');

let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Import TemplateBuilderModal if not present
if (!code.includes('import TemplateBuilderModal')) {
  code = code.replace(
    /import EditorTopBar from '\.\/EditorTopBar';/,
    `import EditorTopBar from './EditorTopBar';\nimport TemplateBuilderModal from './TemplateBuilderModal';`
  );
}

// 2. Add showTemplateModal state
if (!code.includes('const [showTemplateModal, setShowTemplateModal] = useState(false)')) {
  code = code.replace(
    /const \[showSystemLoading, setShowSystemLoading\] = useState\(false\);/,
    `const [showSystemLoading, setShowSystemLoading] = useState(false);\n  const [showTemplateModal, setShowTemplateModal] = useState(false);`
  );
}

// 3. Add to context menu items
if (!code.includes("label: 'Save as Template'")) {
  code = code.replace(
    /menuItems\.push\(\{ label: 'Compose collage', action: 'compose_collage', icon: <CollageIcon \/> \}\);/,
    `menuItems.push({ label: 'Compose collage', action: 'compose_collage', icon: <CollageIcon /> });\n          menuItems.push({ label: 'Save as Template', action: 'save_as_template' });`
  );
}

// 4. Add case in handleMenuAction
if (!code.includes("case 'save_as_template':")) {
  code = code.replace(
    /case 'grid_nodes':/,
    `case 'save_as_template':\n        if (selectedNodes && selectedNodes.length > 0) {\n          setShowTemplateModal(true);\n        }\n        break;\n      case 'grid_nodes':`
  );
}

// 5. Add TemplateBuilderModal to render at the bottom
if (!code.includes('<TemplateBuilderModal')) {
  code = code.replace(
    /<ProfileModal isOpen=\{isProfileModalOpen\} onClose=\{\(\) => setIsProfileModalOpen\(false\)\} \/>\n\s*<BottomBar/,
    `<ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />\n      <TemplateBuilderModal\n        isOpen={showTemplateModal}\n        onClose={() => setShowTemplateModal(false)}\n        selectedNodes={nodes.filter(n => n.selected)}\n        nodes={nodes}\n        edges={edges}\n        onCreated={({ template }) => {\n          setShowTemplateModal(false);\n          // Template logic is already handled by templateStore, so just close\n        }}\n      />\n      <BottomBar`
  );
}

fs.writeFileSync('frontend/src/App.jsx', code);
console.log('Patched App.jsx with TemplateBuilderModal context menu');
