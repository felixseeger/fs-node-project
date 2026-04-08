const fs = require('fs');

let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Add hook import
if (!code.includes('useFirebaseAssets')) {
  code = code.replace(
    /import \{ useFirebaseTemplates \} from '\.\/hooks\/useFirebaseTemplates';/,
    `import { useFirebaseTemplates } from './hooks/useFirebaseTemplates';\nimport { useFirebaseAssets } from './hooks/useFirebaseAssets';`
  );
}

// 2. Initialize hook inside App component
if (!code.includes('const firebaseAssets = useFirebaseAssets(currentUserId);')) {
  code = code.replace(
    /const firebaseTemplates = useFirebaseTemplates\(currentUserId\);/,
    `const firebaseTemplates = useFirebaseTemplates(currentUserId);\n  const firebaseAssets = useFirebaseAssets(currentUserId);`
  );
}

// 3. Update create_element to also save to Firebase and call it "Save as Asset"
if (!code.includes("label: 'Save as Asset'")) {
  code = code.replace(
    /menuItems\.push\(\{ label: 'Create Element', action: 'create_element' \}\);/,
    `menuItems.push({ label: 'Save as Asset', action: 'create_element' });`
  );
}

// 4. Update handleMenuAction for create_element
if (!code.includes('firebaseAssets.create(newAssetNode.data);')) {
  code = code.replace(
    /setNodes\(\(nds\) => \[\.\.\.nds, newAssetNode\]\);\n\s*\}/,
    `setNodes((nds) => [...nds, newAssetNode]);\n          if (firebaseAssets.create) {\n            firebaseAssets.create(newAssetNode.data).catch(console.error);\n          }\n        }`
  );
}

// 5. Update GooeyNodesMenu props
if (!code.includes('assets={firebaseAssets.assets}')) {
  code = code.replace(
    /<GooeyNodesMenu nodeMenu=\{NODE_MENU\} templates=\{firebaseTemplates\.templates\}/,
    `<GooeyNodesMenu nodeMenu={NODE_MENU} templates={firebaseTemplates.templates} assets={firebaseAssets.assets}`
  );
}

fs.writeFileSync('frontend/src/App.jsx', code);
console.log('Patched App.jsx with asset saving logic');
