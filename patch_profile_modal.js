const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/ProfileModal.jsx', 'utf8');

const preferencesCode = `
          {activeTab === 'Preferences' && (
            <div className="pm-preferences-body">
              <p className="pm-preferences-desc">These preferences apply to all of your new projects across FLORA</p>
              
              <div className="pm-pref-section">
                <h3>Editor & Performance</h3>
                
                <div className="pm-pref-row">
                  <div className="pm-pref-text">
                    <label>Performance Mode</label>
                    <span>Reduces animations and motion to enhance Editor performance</span>
                  </div>
                  <label className="pm-toggle">
                    <input type="checkbox" />
                    <span className="pm-slider"></span>
                  </label>
                </div>
                
                <div className="pm-pref-row">
                  <div className="pm-pref-text">
                    <label>Snap to Grid</label>
                    <span>If enabled, nodes will snap to the editor grid</span>
                  </div>
                  <label className="pm-toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="pm-slider"></span>
                  </label>
                </div>
                
                <div className="pm-pref-row">
                  <div className="pm-pref-text">
                    <label>Background Prompt Improver</label>
                    <span>Automatically optimize prompts for each model behind the scenes during generation</span>
                  </div>
                  <label className="pm-toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="pm-slider"></span>
                  </label>
                </div>
                
                <div className="pm-pref-row">
                  <div className="pm-pref-text">
                    <label>Show Legacy Assets Folder</label>
                    <span>Controls visibility of the Legacy assets migration folder in Library</span>
                  </div>
                  <label className="pm-toggle">
                    <input type="checkbox" />
                    <span className="pm-slider"></span>
                  </label>
                </div>
                
                <div className="pm-pref-row">
                  <div className="pm-pref-text">
                    <label>Show Credit Balance</label>
                    <span>Display your remaining credit balance in the credits indicator</span>
                  </div>
                  <label className="pm-toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="pm-slider"></span>
                  </label>
                </div>
                
                <div className="pm-pref-row">
                  <div className="pm-pref-text">
                    <label>Open dashboard projects</label>
                    <span>Choose whether projects from the dashboard open in a new tab or the current tab</span>
                  </div>
                  <select className="pm-select">
                    <option>New tab</option>
                    <option>Current tab</option>
                  </select>
                </div>
              </div>
              
              <div className="pm-divider"></div>
              
              <div className="pm-pref-section">
                <h3>Variations</h3>
                
                <div className="pm-pref-row">
                  <div className="pm-pref-text">
                    <label>Variation behavior</label>
                    <span>Choose how variations appear</span>
                  </div>
                  <select className="pm-select">
                    <option>In node history</option>
                    <option>On canvas</option>
                  </select>
                </div>
              </div>
              
              <div className="pm-divider"></div>
              
              <div className="pm-pref-section">
                <h3>Multi-Model</h3>
                
                <div className="pm-pref-row">
                  <div className="pm-pref-text">
                    <label>Multi-model behavior</label>
                    <span>Choose where multi-model generations appear</span>
                  </div>
                  <select className="pm-select">
                    <option>On canvas</option>
                    <option>In node history</option>
                  </select>
                </div>
              </div>
              
              <div className="pm-divider"></div>
              
              <div className="pm-pref-section">
                <h3>Default Model</h3>
                
                <div className="pm-pref-subsection">
                  <h4>Text</h4>
                  <p className="pm-pref-subdesc">Choose default text models</p>
                  
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Text to text</label>
                    <select className="pm-select">
                      <option>Claude Sonnet 4.6</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Image to text</label>
                    <select className="pm-select">
                      <option>Claude Sonnet 4.6</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Video to text</label>
                    <select className="pm-select">
                      <option>Claude Sonnet 4.6</option>
                    </select>
                  </div>
                </div>
                
                <div className="pm-pref-subsection">
                  <h4>Image</h4>
                  <p className="pm-pref-subdesc">Choose default image models</p>
                  
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Text to image</label>
                    <select className="pm-select">
                      <option>Flux 2</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Image to image</label>
                    <select className="pm-select">
                      <option>Nano Banana 2</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Images to image</label>
                    <select className="pm-select">
                      <option>Nano Banana 2</option>
                    </select>
                  </div>
                </div>
                
                <div className="pm-pref-subsection">
                  <h4>Video</h4>
                  <p className="pm-pref-subdesc">Choose default video models</p>
                  
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Text to video</label>
                    <select className="pm-select">
                      <option>Seedance 1.5 Pro</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Image to video</label>
                    <select className="pm-select">
                      <option>Seedance 1.5 Pro</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>First frame last frame</label>
                    <select className="pm-select">
                      <option>Veo 3.1 Frames</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Images to video</label>
                    <select className="pm-select">
                      <option>Veo 3.1 Ingredients</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Video to video</label>
                    <select className="pm-select">
                      <option>Kling O1 Edit</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Mixed to video</label>
                    <select className="pm-select">
                      <option>Kling O1 Edit</option>
                    </select>
                  </div>
                </div>
              </div>
              
            </div>
          )}
          
          {activeTab !== 'Profile' && activeTab !== 'Preferences' && (
`;

jsx = jsx.replace(
  /\{\s*activeTab !== 'Profile' && \(/,
  preferencesCode
);

fs.writeFileSync('frontend/src/ProfileModal.jsx', jsx);
console.log("Patched ProfileModal.jsx");
