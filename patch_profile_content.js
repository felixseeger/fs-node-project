import fs from 'fs';
const p = 'frontend/src/ProfileModal.tsx';
let code = fs.readFileSync(p, 'utf8');

// Replace everything from {activeTab === 'Plans' to the end of {activeTab === 'Usage' ...}
code = code.replace(/\{\s*activeTab === 'Plans'[\s\S]*?activeTab !== 'Usage' && \(/, 
`{activeTab === 'Usage' && (
            <div className="pm-profile-body">
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', margin: '0 0 8px 0', color: '#fff' }}>Storage Usage</h3>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#00FF7F' }}>
                  {storageLoading ? '...' : usage?.count || 0} <span style={{fontSize: '16px', color: '#999', fontWeight: '400'}}>/ {usage?.limitCount || 100} Assets</span>
                </div>
                <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>
                  You have used {Math.round(((usage?.count || 0) / (usage?.limitCount || 100)) * 100)}% of your available storage.
                </p>
                <div style={{ width: '100%', height: 8, background: '#222', borderRadius: 4, overflow: 'hidden', marginTop: 16 }}>
                  <div style={{ 
                    height: '100%', 
                    background: (usage?.count || 0) >= (usage?.limitCount || 100) ? '#ef4444' : '#00FF7F', 
                    width: \`\${Math.min(100, ((usage?.count || 0) / (usage?.limitCount || 100)) * 100)}%\`,
                    transition: 'width 0.3s ease-out, background-color 0.3s ease'
                  }} />
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'Profile' && activeTab !== 'Account' && activeTab !== 'Preferences' && activeTab !== 'Settings' && activeTab !== 'Usage' && (`
);

// Also let's fix the "People & Credits" menu item to be just "People"
code = code.replace(/<span className="pm-icon">{Icons.People}<\/span> People &amp; Credits/g, '<span className="pm-icon">{Icons.People}</span> People');

fs.writeFileSync(p, code);
