const fs = require('fs');

let appJsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const startIdx = appJsx.indexOf('{menu && (');
const endIdx = appJsx.indexOf('</ReactFlow>', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
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
            )}
            
            <Background variant="dots" gap={20} size={1} color="#333" />
          `;

  appJsx = appJsx.substring(0, startIdx) + newMenuRender + appJsx.substring(endIdx);
  fs.writeFileSync('frontend/src/App.jsx', appJsx);
  console.log("Patched Context Menu with indexOf");
} else {
  console.log("Indices not found");
}

