const fs = require('fs');

// 1. Update App.jsx
let app = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// Replace ProfilePage with ProfileModal
app = app.replace(
  /import ProfilePage from '\.\/ProfilePage';/,
  `import ProfileModal from './ProfileModal';`
);

// Add isProfileModalOpen state
app = app.replace(
  /const \[isLocked, setIsLocked\] = useState\(false\);/,
  `const [isLocked, setIsLocked] = useState(false);\n  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);`
);

// Add onOpenProfile to TopBar calls
app = app.replace(
  /<TopBar currentPage=\{currentPage\} onNavigate=\{setCurrentPage\} workflowName=\{null\} onLogout=\{\(\) => setIsAuthenticated\(false\)\} \/>/g,
  `<TopBar currentPage={currentPage} onNavigate={setCurrentPage} workflowName={null} onLogout={() => setIsAuthenticated(false)} onOpenProfile={() => setIsProfileModalOpen(true)} />`
);

app = app.replace(
  /onDuplicate=\{handleDuplicateWorkspace\}\n\s*isLocked=\{isLocked\}\n\s*onLockView=\{\(\) => setIsLocked\(prev => !prev\)\}/,
  `onDuplicate={handleDuplicateWorkspace}\n        isLocked={isLocked}\n        onLockView={() => setIsLocked(prev => !prev)}\n        onOpenProfile={() => setIsProfileModalOpen(true)}`
);

// Remove ProfilePage route
app = app.replace(
  /if \(currentPage === 'profile'\) \{\s*return \(\s*<div style=\{\{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' \}\}>\s*<TopBar currentPage=\{currentPage\} onNavigate=\{setCurrentPage\} workflowName=\{null\} onLogout=\{\(\) => setIsAuthenticated\(false\)\} onOpenProfile=\{\(\) => setIsProfileModalOpen\(true\)\} \/>\s*<div style=\{\{ flex: 1, overflow: 'hidden' \}\}>\s*<ProfilePage \/>\s*<\/div>\s*<\/div>\s*\);\s*\}/,
  ''
);

// Inject <ProfileModal /> at the very end of the App component return
// Actually it's better to just put it near the bottom before the last </div>
const returnDivRegex = /<\/div>\n\s*<\/div>\n\s*\);\n\}/;
app = app.replace(returnDivRegex, `    </div>\n      </div>\n      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />\n    </div>\n  );\n}`);

fs.writeFileSync('frontend/src/App.jsx', app);

// 2. Update TopBar.jsx
let topbar = fs.readFileSync('frontend/src/TopBar.jsx', 'utf8');

topbar = topbar.replace(
  /export default function TopBar\(\{ currentPage, onNavigate, workflowName, editorMode, onEditorModeChange, onLogout, onZoomIn, onZoomOut, onZoomFit, onUndo, onRedo, onRename, onDuplicate, isLocked, onLockView \}\) \{/,
  `export default function TopBar({ currentPage, onNavigate, workflowName, editorMode, onEditorModeChange, onLogout, onZoomIn, onZoomOut, onZoomFit, onUndo, onRedo, onRename, onDuplicate, isLocked, onLockView, onOpenProfile }) {`
);

topbar = topbar.replace(
  /else if \(item\.id === 'editor'\) onNavigate\('home'\);/,
  `else if (item.id === 'editor') onNavigate('home');\n                      else if (item.id === 'profile') onOpenProfile?.();`
);

fs.writeFileSync('frontend/src/TopBar.jsx', topbar);

// 3. Update GooeyNodesMenu.jsx
let gooey = fs.readFileSync('frontend/src/GooeyNodesMenu.jsx', 'utf8');

// Update signature
gooey = gooey.replace(
  /export default function GooeyNodesMenu\(\{ nodeMenu, onAddNode \}\) \{/,
  `export default function GooeyNodesMenu({ nodeMenu, onAddNode, onOpenProfile }) {`
);

// Update link
gooey = gooey.replace(
  /onClick=\{\(e\) => \{ e\.preventDefault\(\); setShowProfileModal\(true\); setIsOpen\(false\); setShowHelpMenu\(false\); \}\}/,
  `onClick={(e) => { e.preventDefault(); onOpenProfile?.(); setIsOpen(false); setShowHelpMenu(false); }}`
);

// Fix image path
gooey = gooey.replace(
  /<img src="\/ref\/gen-ai\.jpg" alt="User Profile" \/>/,
  `<div style={{width: '100%', height: '100%', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 600}}>FS</div>`
);

// Remove ProfileModal import and usage inside GooeyNodesMenu
gooey = gooey.replace(/import ProfileModal from '\.\/ProfileModal';\n/, '');
gooey = gooey.replace(/const \[showProfileModal, setShowProfileModal\] = useState\(false\);\n/, '');
gooey = gooey.replace(/<ProfileModal isOpen=\{showProfileModal\} onClose=\{\(\) => setShowProfileModal\(false\)\} \/>\n/, '');

fs.writeFileSync('frontend/src/GooeyNodesMenu.jsx', gooey);

console.log("Consolidated ProfileModal");
