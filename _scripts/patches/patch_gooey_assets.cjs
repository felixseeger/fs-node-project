const fs = require('fs');

let code = fs.readFileSync('frontend/src/GooeyNodesMenu.jsx', 'utf8');

// Update props
if (!code.includes('assets = []')) {
  code = code.replace(
    /export default function GooeyNodesMenu\(\{ nodeMenu, templates = \[\], onAddNode, onOpenProfile \}\) \{/,
    `export default function GooeyNodesMenu({ nodeMenu, templates = [], assets = [], onAddNode, onOpenProfile }) {`
  );
}

// Update the Assets tab UI
const oldAssetsTab = /<div className="ms-assets-section">\s*<div className="ms-assets-title">Unorganized <span>0<\/span><\/div>\s*<div className="ms-assets-grid">\s*<button className="ms-asset-card" onClick=\{\(\) => \{ setIsOpen\(false\); setShowAssetModal\(true\); \}\}>\s*<span className="ms-asset-icon" style=\{\{ width: 24, height: 24, padding: 6 \}\}>\{Icons\.Plus\}<\/span>\s*<span className="ms-asset-label">Upload Asset<\/span>\s*<\/button>\s*<\/div>\s*<\/div>/;

const newAssetsTab = `<div className="ms-assets-section">
                <div className="ms-assets-title">Library <span>{assets.length}</span></div>
                <div className="ms-assets-grid">
                  <button className="ms-asset-card" onClick={() => { setIsOpen(false); setShowAssetModal(true); }}>
                    <span className="ms-asset-icon" style={{ width: 24, height: 24, padding: 6 }}>{Icons.Plus}</span>
                    <span className="ms-asset-label">Upload Asset</span>
                  </button>
                  {assets.map((asset) => (
                    <button 
                      key={asset.id} 
                      className="ms-asset-card"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/reactflow', 'assetNode');
                        e.dataTransfer.setData('application/reactflow-defaults', JSON.stringify({
                          images: asset.images || [],
                          label: asset.name || 'Asset'
                        }));
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onClick={() => {
                        onAddNode('assetNode', {
                          images: asset.images || [],
                          label: asset.name || 'Asset'
                        });
                        setSearchQuery('');
                        setIsOpen(false);
                      }}
                    >
                      <span className="ms-asset-icon" style={{ padding: 0, overflow: 'hidden' }}>
                        {asset.images && asset.images.length > 0 ? (
                          <img src={asset.images[0]} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          Icons.Hash
                        )}
                      </span>
                      <span className="ms-asset-label">{asset.name || 'Asset'}</span>
                    </button>
                  ))}
                </div>
              </div>`;

if (code.match(oldAssetsTab)) {
  code = code.replace(oldAssetsTab, newAssetsTab);
  
  // Optionally remove the "Folders" dummy section for now
  const oldFoldersTab = /<div className="ms-assets-section">\s*<div className="ms-assets-title">Folders <span>0<\/span><\/div>\s*<div className="ms-assets-grid">\s*<button className="ms-asset-card">\s*<span className="ms-asset-icon">\{Icons\.FolderPlus\}<\/span>\s*<span className="ms-asset-label">Create Folder<\/span>\s*<\/button>\s*<\/div>\s*<\/div>/;
  code = code.replace(oldFoldersTab, '');
  
  // Fix the "Library / Unsplash" tabs
  const oldTabs = /<div className="ms-assets-tabs">\s*<button className="ms-asset-tab active">Library<\/button>\s*<button className="ms-asset-tab">Unsplash<\/button>\s*<\/div>/;
  code = code.replace(oldTabs, '');
}

fs.writeFileSync('frontend/src/GooeyNodesMenu.jsx', code);
console.log('Patched GooeyNodesMenu.jsx to display and use assets');
