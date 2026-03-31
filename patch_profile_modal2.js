const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/ProfileModal.jsx', 'utf8');

// Move Settings to Workspace section
jsx = jsx.replace(
  /<button className=\{`pm-nav-btn \$\{activeTab === 'Settings' \? 'active' : ''\}`\} onClick=\{\(\) => setActiveTab\('Settings'\)\}>\s*<span className="pm-icon">\{Icons\.Settings\}<\/span> Settings\s*<\/button>/,
  ''
);

jsx = jsx.replace(
  /<div className="pm-section-title">Workspace<\/div>/,
  `<div className="pm-section-title">Workspace</div>
            <button className={\`pm-nav-btn \${activeTab === 'Settings' ? 'active' : ''}\`} onClick={() => setActiveTab('Settings')}>
              <span className="pm-icon">{Icons.Settings}</span> Settings
            </button>`
);

// Add the content for the Settings tab based on the vision analysis
const settingsCode = `
          {activeTab === 'Settings' && (
            <div className="pm-preferences-body">
              <div className="pm-form-row">
                 <button className="pm-save-btn" style={{background: '#1a1a1a', border: '1px solid #333', color: '#e0e0e0'}}>Leave workspace</button>
              </div>

              <div className="pm-security-section" style={{marginTop: '16px'}}>
                <div className="pm-security-text" style={{maxWidth: '100%'}}>
                  <h3 style={{fontSize: '18px'}}>Model Access Control</h3>
                  <p style={{fontSize: '14px'}}>Control which models are available in your workspace. Restricted models are completely hidden from member workflows and can't be accessed.</p>
                </div>
              </div>
              
              <div className="pm-sectionBody" style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '16px', border: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="pm-pref-row">
                  <div className="pm-pref-text">
                    <label style={{fontSize: '14px'}}>New model behavior</label>
                    <span style={{fontSize: '13px'}}>Models will <strong style={{color: '#00FF7F', fontWeight: '500'}}>automatically</strong> be added to the list when released</span>
                  </div>
                  
                  <div style={{ display: 'flex', background: '#111', borderRadius: '20px', padding: '4px', border: '1px solid #333' }}>
                    <button style={{ background: '#333', color: '#fff', border: 'none', borderRadius: '16px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Opt-out</button>
                    <button style={{ background: 'transparent', color: '#999', border: 'none', borderRadius: '16px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Opt-in</button>
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '10px' }}>
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input 
                    type="search" 
                    placeholder="Search models by name, provider, or category..." 
                    style={{ 
                      width: '100%', 
                      background: '#111', 
                      border: '1px solid #333', 
                      borderRadius: '8px', 
                      padding: '10px 12px 10px 36px', 
                      color: '#E0E0E0',
                      fontSize: '14px',
                      outline: 'none'
                    }} 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="pm-pref-row" style={{ padding: '12px 0', borderBottom: '1px solid #333' }}>
                    <div className="pm-pref-text">
                      <label style={{ fontSize: '14px', color: '#fff' }}>Alibaba &bull; Qwen Image Edit</label>
                      <span style={{ fontSize: '12px' }}>ImageToImage &bull; Best for adding or changing text in images.</span>
                    </div>
                    <label className="pm-toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="pm-slider"></span>
                    </label>
                  </div>
                  
                  <div className="pm-pref-row" style={{ padding: '12px 0', borderBottom: '1px solid #333' }}>
                    <div className="pm-pref-text">
                      <label style={{ fontSize: '14px', color: '#fff' }}>Alibaba &bull; Qwen Image Edit Angles</label>
                      <span style={{ fontSize: '12px' }}>ImageToImage &bull; Rotate and shift perspective of objects.</span>
                    </div>
                    <label className="pm-toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="pm-slider"></span>
                    </label>
                  </div>
                  
                  <div className="pm-pref-row" style={{ padding: '12px 0', borderBottom: '1px solid #333' }}>
                    <div className="pm-pref-text">
                      <label style={{ fontSize: '14px', color: '#fff' }}>Alibaba &bull; Qwen Image Edit Plus</label>
                      <span style={{ fontSize: '12px' }}>ImagesToImage &bull; Complex layouts with multiple text elements.</span>
                    </div>
                    <label className="pm-toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="pm-slider"></span>
                    </label>
                  </div>

                  <div className="pm-pref-row" style={{ padding: '12px 0' }}>
                    <div className="pm-pref-text">
                      <label style={{ fontSize: '14px', color: '#fff' }}>OpenAI &bull; Sora</label>
                      <span style={{ fontSize: '12px' }}>TextToVideo &bull; Highly realistic video generation from text.</span>
                    </div>
                    <label className="pm-toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="pm-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
`;

jsx = jsx.replace(
  /\{\s*activeTab !== 'Profile' && activeTab !== 'Preferences' && \(/,
  settingsCode + "\n          {activeTab !== 'Profile' && activeTab !== 'Preferences' && activeTab !== 'Settings' && ("
);

fs.writeFileSync('frontend/src/ProfileModal.jsx', jsx);
console.log("Patched ProfileModal.jsx");
