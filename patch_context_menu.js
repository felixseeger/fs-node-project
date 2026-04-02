const fs = require('fs');

let appJsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// The new items array we want to send to the context menu.
const newMenuItems = `items: [
          { label: 'Create Element', action: 'create_element' },
          { label: 'Autoformat', action: 'autoformat' },
          { label: 'Grid Nodes', action: 'grid_nodes' },
          { label: 'Stack Nodes', action: 'stack_nodes' },
          { label: 'Align Left', action: 'align_left' },
          { label: 'Align Center', action: 'align_center' },
          { label: 'Align Right', action: 'align_right' },
          { type: 'divider' },
          { label: 'Copy', action: 'copy', shortcut: '⌘C' },
          { label: 'Paste', action: 'paste', shortcut: '⌘V' },
          { label: 'Duplicate', action: 'duplicate', shortcut: '⌘D' },
          { label: 'Download', action: 'download', shortcut: '⌘⇧D' },
          { label: 'Clear node contents', action: 'clear_contents', shortcut: '⌘⇧X' }
        ],`;

appJsx = appJsx.replace(
  /items: \[\{ label: 'Create Asset', action: 'createAsset' \}\],/,
  newMenuItems
);

// We should also open it even if no nodes are selected? 
// The screenshot shows "Create Element" which might act on selected nodes. 
// Let's remove the constraint that nodes must be selected to open the menu.
// Or wait, some actions like "Paste" don't require selected nodes.
// Let's remove the \`if (selectedNodes.length === 0) return;\` block, but pass selectedNodes.
appJsx = appJsx.replace(
  /const selectedNodes = rfInstance.getNodes\(\)\.filter\(n => n\.selected\);\n\s*if \(selectedNodes\.length === 0\) \{\n\s*setMenu\(null\);\n\s*return;\n\s*\}/,
  `const selectedNodes = rfInstance.getNodes().filter(n => n.selected);`
);

// Now for the rendering. Let's find the current menu rendering.
const currentMenuRenderRegex = /\{menu && \(\s*<div\s*style=\{\{\s*position: 'absolute',\s*top: menu\.y,\s*left: menu\.x,\s*background: '#2a2a2a',\s*border: '1px solid #444',\s*borderRadius: 8,\s*zIndex: 1000,\s*boxShadow: '0 4px 12px rgba\(0,0,0,0\.5\)',\s*minWidth: 180,\s*\}\}\s*>\s*\{menu\.items\.map\(\(item, index\) => \(\s*<div\s*key=\{item\.action\}\s*onClick=\{\(\) => handleMenuAction\(item\.action, menu\)\}\s*style=\{\{\s*padding: '10px 16px',\s*cursor: 'pointer',\s*color: '#e0e0e0',\s*fontSize: 14,\s*borderBottom: index < menu\.items\.length - 1 \? '1px solid #333' : 'none',\s*\}\}\s*onMouseEnter=\{\(e\) => \(e\.currentTarget\.style\.background = '#333'\)\}\s*onMouseLeave=\{\(e\) => \(e\.currentTarget\.style\.background = 'transparent'\)\}\s*>\s*\{item\.label\}\s*<\/div>\s*\)\}\s*<\/div>\s*\)\}/;


const newMenuRender = `{menu && (
              <div
                style={{
                  position: 'absolute',
                  top: menu.y,
                  left: menu.x,
                  backgroundColor: 'rgba(30, 30, 30, 0.75)',
                  backdropFilter: 'blur(16px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  zIndex: 1000,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  minWidth: 220,
                  padding: '6px 0',
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                }}
              >
                {menu.items.map((item, index) => {
                  if (item.type === 'divider') {
                    return <div key={'divider-' + index} style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.15)', margin: '6px 0' }} />;
                  }
                  
                  return (
                    <div
                      key={item.action}
                      onClick={(e) => {
                        e.stopPropagation();
                        // handleMenuAction is already defined in App.jsx but we need to pass item.action
                        handleMenuAction(item.action, menu);
                        setMenu(null);
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 16px',
                        margin: '0 6px',
                        cursor: 'default',
                        borderRadius: '6px',
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '14px',
                        fontWeight: 400,
                        transition: 'background-color 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>{item.shortcut}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}`;

appJsx = appJsx.replace(currentMenuRenderRegex, newMenuRender);

fs.writeFileSync('frontend/src/App.jsx', appJsx);
console.log("Patched Context Menu in App.jsx");
