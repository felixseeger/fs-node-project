const fs = require('fs');

let code = fs.readFileSync('frontend/src/UpdateAssetModal.jsx', 'utf8');

// Update props
if (!code.includes('onCreateAsset')) {
  code = code.replace(
    /export default function UpdateAssetModal\(\{ isOpen, onClose, nodeData, onUpdate \}\) \{/,
    `export default function UpdateAssetModal({ isOpen, onClose, nodeData, onUpdate, onCreateAsset }) {`
  );
}

// Update handleSave
const oldSave = /const handleSave = \(\) => \{\s*if \(onUpdate && nodeData\?\.id\) \{\s*onUpdate\(nodeData\.id, \{ label: name, name: name, images \}\);\s*\}\s*onClose\(\);\s*\};/m;

const newSave = `const handleSave = () => {
    if (onUpdate && nodeData?.id) {
      onUpdate(nodeData.id, { label: name, name: name, images });
    } else if (onCreateAsset) {
      onCreateAsset({ name, images });
    }
    onClose();
  };`;

if (code.match(oldSave)) {
  code = code.replace(oldSave, newSave);
}

fs.writeFileSync('frontend/src/UpdateAssetModal.jsx', code);
console.log('Patched UpdateAssetModal.jsx');
