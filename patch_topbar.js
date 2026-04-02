const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/TopBar.jsx', 'utf8');

// 1. Update signature
jsx = jsx.replace(
  /export default function TopBar\(\{ currentPage, onNavigate, workflowName, editorMode, onEditorModeChange, onLogout \}\) \{/,
  `export default function TopBar({ currentPage, onNavigate, workflowName, editorMode, onEditorModeChange, onLogout, onZoomIn, onZoomOut, onZoomFit, onUndo, onRedo, onRename, onDuplicate }) {`
);

// 2. Replace menuItems
const oldMenuItems = `  const menuItems = [
    { id: 'workspaces', label: 'Workspaces', icon: '&#9864;' },
    { id: 'home', label: 'Workflows', icon: '&#9776;' },
    { id: 'editor', label: 'New Workflow', icon: '&#43;' },
    { id: 'divider' },
    { id: 'workflow-settings', label: 'Workflow Settings', icon: '&#9881;' },
    { id: 'profile', label: 'Profile', icon: '&#9786;' },
    { id: 'divider' },
    { id: 'logout', label: 'Sign Out', icon: '&#10140;' },
  ];`;

const newMenuItems = `  const defaultMenuItems = [
    { id: 'workspaces', label: 'Workspaces', icon: '&#9864;' },
    { id: 'home', label: 'Workflows', icon: '&#9776;' },
    { id: 'editor', label: 'New Workflow', icon: '&#43;' },
    { id: 'divider-1', type: 'divider' },
    { id: 'workflow-settings', label: 'Workflow Settings', icon: '&#9881;' },
    { id: 'profile', label: 'Profile', icon: '&#9786;' },
    { id: 'divider-2', type: 'divider' },
    { id: 'logout', label: 'Sign Out', icon: '&#10140;' },
  ];

  const editorMenuItems = [
    { id: 'home', label: 'Back to home' },
    { id: 'profile', label: 'My profile' },
    { id: 'divider-1', type: 'divider' },
    { id: 'editor', label: 'New project' },
    { id: 'duplicate-project', label: 'Duplicate project' },
    { id: 'rename-project', label: 'Rename project' },
    { id: 'undo', label: 'Undo', shortcut: '⌘Z' },
    { id: 'redo', label: 'Redo', shortcut: '⌘⇧Z' },
    { id: 'divider-2', type: 'divider' },
    { id: 'workflow-settings', label: 'Project settings' },
    { id: 'divider-3', type: 'divider' },
    { id: 'zoom-fit', label: 'Zoom to fit', shortcut: '⌘1' },
    { id: 'zoom-in', label: 'Zoom in', shortcut: '⌘+' },
    { id: 'zoom-out', label: 'Zoom out', shortcut: '⌘-' },
  ];

  const menuItems = currentPage === 'editor' ? editorMenuItems : defaultMenuItems;`;

jsx = jsx.replace(oldMenuItems, newMenuItems);

// 3. Update rendering mapping
const oldMap = `{menuItems.map((item) =>
                item.id === 'divider' ? (
                  <div
                    key="divider"`;

const newMap = `{menuItems.map((item) =>
                item.type === 'divider' ? (
                  <div
                    key={item.id}`;

jsx = jsx.replace(oldMap, newMap);

const oldClick = `onClick={() => {
                      if (item.id === 'logout') {
                        onLogout?.();
                      } else if (item.id === 'editor') {
                        onNavigate('home');
                      } else {
                        onNavigate(item.id);
                      }
                      setMenuOpen(false);
                    }}`;

const newClick = `onClick={() => {
                      if (item.id === 'logout') onLogout?.();
                      else if (item.id === 'editor' && currentPage !== 'editor') onNavigate('home');
                      else if (item.id === 'zoom-in') onZoomIn?.();
                      else if (item.id === 'zoom-out') onZoomOut?.();
                      else if (item.id === 'zoom-fit') onZoomFit?.();
                      else if (item.id === 'undo') onUndo?.();
                      else if (item.id === 'redo') onRedo?.();
                      else if (item.id === 'rename-project') onRename?.();
                      else if (item.id === 'duplicate-project') onDuplicate?.();
                      else if (item.id === 'new-project') onNavigate('home');
                      else onNavigate(item.id);
                      setMenuOpen(false);
                    }}`;

jsx = jsx.replace(oldClick, newClick);

// 4. Handle rendering of shortcut or icon
const oldIconRender = `<span
                      style={{ fontSize: 14, width: 18, textAlign: 'center', opacity: 0.7 }}
                      dangerouslySetInnerHTML={{ __html: item.icon }}
                    />
                    {item.label}`;

const newIconRender = `<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {item.icon && <span style={{ fontSize: 14, width: 18, textAlign: 'center', opacity: 0.7 }} dangerouslySetInnerHTML={{ __html: item.icon }} />}
                        {item.label}
                      </span>
                      {item.shortcut && <span style={{ fontSize: 11, color: '#666' }}>{item.shortcut}</span>}
                    </span>`;

jsx = jsx.replace(oldIconRender, newIconRender);

fs.writeFileSync('frontend/src/TopBar.jsx', jsx);
console.log("Patched TopBar.jsx");
