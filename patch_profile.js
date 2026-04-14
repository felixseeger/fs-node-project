import fs from 'fs';

const p = 'frontend/src/ProfileModal.tsx';
let code = fs.readFileSync(p, 'utf8');

// Remove Plans tab
code = code.replace(/\{\s*activeTab === 'Plans'[\s\S]*?\}\s*\)/g, '');

// Replace Usage tab with Storage tab
code = code.replace(/\{\s*activeTab === 'Usage'[\s\S]*?\}\s*\)/g, `{activeTab === 'Usage' && (
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
          )}`);

code = code.replace(/&& activeTab !== 'Plans' && activeTab !== 'Usage'/g, "&& activeTab !== 'Usage'");
code = code.replace(/<div className={`pm-menu-item \${activeTab === 'Plans' \? 'active' : ''}`} onClick={() => setActiveTab\('Plans'\)}>\s*<span className="pm-menu-icon">{Icons.Plans}<\/span>\s*<span>Plans<\/span>\s*<\/div>/g, '');

code = code.replace(/<div className={`pm-pref-row`}>\s*<div className="pm-pref-text">\s*<label>Show Credit Balance<\/label>\s*<span>Display your remaining credit balance in the credits indicator<\/span>\s*<\/div>\s*<label className="pm-toggle">\s*<input type="checkbox" checked={creditBal} onChange={e => setCreditBal\(e\.target\.checked\)} \/>\s*<span className="pm-slider"><\/span>\s*<\/label>\s*<\/div>/, '');

fs.writeFileSync(p, code);
