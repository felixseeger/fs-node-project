import re

with open("frontend/src/GooeyNodesMenu.jsx", "r") as f:
    content = f.read()

# Add AssetModal import
content = content.replace("import ProfileModal from './ProfileModal';", "import ProfileModal from './ProfileModal';\nimport AssetModal from './AssetModal';")

# Add FolderPlus icon
icons_replacement = """  Folder: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
  FolderPlus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>,"""
content = content.replace("  Folder: <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\"></path></svg>,", icons_replacement)


# Add showAssetModal state
state_replacement = """  const [searchQuery, setSearchQuery] = useState('');
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);"""
content = re.sub(r'  const \[searchQuery, setSearchQuery\] = useState\(\'\'\);\n  const \[showHelpMenu, setShowHelpMenu\] = useState\(false\);\n  const \[showProfileModal, setShowProfileModal\] = useState\(false\);', state_replacement, content)

# Add Asset browser render logic
render_replacement = """        <div className="ms-overlay-scroll-area">
          {activeCategory === 'Assets' && !searchQuery ? (
            <div className="ms-assets-browser">
              <div className="ms-assets-tabs">
                <button className="ms-asset-tab active">Library</button>
                <button className="ms-asset-tab">Unsplash</button>
              </div>
              <div className="ms-assets-section">
                <div className="ms-assets-title">Folders <span>0</span></div>
                <div className="ms-assets-grid">
                  <button className="ms-asset-card">
                    <span className="ms-asset-icon">{Icons.FolderPlus}</span>
                    <span className="ms-asset-label">Create Folder</span>
                  </button>
                </div>
              </div>
              <div className="ms-assets-section">
                <div className="ms-assets-title">Unorganized <span>0</span></div>
                <div className="ms-assets-grid">
                  <button className="ms-asset-card" onClick={() => { setIsOpen(false); setShowAssetModal(true); }}>
                    <span className="ms-asset-icon" style={{ width: 24, height: 24, padding: 6 }}>{Icons.Plus}</span>
                    <span className="ms-asset-label">Upload Asset</span>
                  </button>
                </div>
              </div>
            </div>
          ) : searchQuery || activeCategory ? ("""
content = content.replace('        <div className="ms-overlay-scroll-area">\n          {searchQuery || activeCategory ? (', render_replacement)

# Add AssetModal to end
end_replacement = """      {/* Profile Modal */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      {/* Asset Modal */}
      <AssetModal isOpen={showAssetModal} onClose={() => setShowAssetModal(false)} />
    </div>
  );
}"""
content = content.replace('      {/* Profile Modal */}\n      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />\n    </div>\n  );\n}', end_replacement)

with open("frontend/src/GooeyNodesMenu.jsx", "w") as f:
    f.write(content)

