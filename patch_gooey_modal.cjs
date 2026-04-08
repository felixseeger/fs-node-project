const fs = require('fs');

let code = fs.readFileSync('frontend/src/GooeyNodesMenu.jsx', 'utf8');

// Update imports
if (code.includes("import AssetModal from './AssetModal';")) {
  code = code.replace(
    /import AssetModal from '\.\/AssetModal';/,
    `import UpdateAssetModal from './UpdateAssetModal';`
  );
}

// Update props
if (!code.includes('onCreateAsset')) {
  code = code.replace(
    /export default function GooeyNodesMenu\(\{ nodeMenu, templates = \[\], assets = \[\], onAddNode, onOpenProfile \}\) \{/,
    `export default function GooeyNodesMenu({ nodeMenu, templates = [], assets = [], onCreateAsset, onAddNode, onOpenProfile }) {`
  );
}

// Replace <AssetModal /> with <UpdateAssetModal />
const oldModal = /<AssetModal isOpen=\{showAssetModal\} onClose=\{\(\) => setShowAssetModal\(false\)\} onUpload=\{onAddNode\} \/>/;
const newModal = `<UpdateAssetModal isOpen={showAssetModal} onClose={() => setShowAssetModal(false)} onCreateAsset={(data) => {
        if (onCreateAsset) onCreateAsset(data);
      }} />`;

if (code.match(oldModal)) {
  code = code.replace(oldModal, newModal);
}

fs.writeFileSync('frontend/src/GooeyNodesMenu.jsx', code);
console.log('Patched GooeyNodesMenu.jsx modal');
