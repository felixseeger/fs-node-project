import React, { useState } from 'react';
import './ProfileModal.css';

const Icons = {
  Profile: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Preferences: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  People: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Usage: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"></path></svg>,
  Plans: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
  Close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  MenuDots: <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>
};

export default function ProfileModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('Profile');

  if (!isOpen) return null;

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-modal" onClick={e => e.stopPropagation()}>
        
        {/* Sidebar */}
        <div className="pm-sidebar">
          <div className="pm-section">
            <div className="pm-section-title">Account</div>
            <button className={`pm-nav-btn ${activeTab === 'Profile' ? 'active' : ''}`} onClick={() => setActiveTab('Profile')}>
              <span className="pm-icon">{Icons.Profile}</span> Profile
            </button>
            <button className={`pm-nav-btn ${activeTab === 'Preferences' ? 'active' : ''}`} onClick={() => setActiveTab('Preferences')}>
              <span className="pm-icon">{Icons.Preferences}</span> Preferences
            </button>
            <button className={`pm-nav-btn ${activeTab === 'Settings' ? 'active' : ''}`} onClick={() => setActiveTab('Settings')}>
              <span className="pm-icon">{Icons.Settings}</span> Settings
            </button>
          </div>

          <div className="pm-section">
            <div className="pm-section-title">Workspace</div>
            <button className={`pm-nav-btn ${activeTab === 'People' ? 'active' : ''}`} onClick={() => setActiveTab('People')}>
              <span className="pm-icon">{Icons.People}</span> People &amp; Credits
            </button>
            <button className={`pm-nav-btn ${activeTab === 'Usage' ? 'active' : ''}`} onClick={() => setActiveTab('Usage')}>
              <span className="pm-icon">{Icons.Usage}</span> Usage
            </button>
            <button className={`pm-nav-btn ${activeTab === 'Plans' ? 'active' : ''}`} onClick={() => setActiveTab('Plans')}>
              <span className="pm-icon">{Icons.Plans}</span> Plans &amp; Pricing
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="pm-content-area">
          <div className="pm-header">
            <h2>{activeTab}</h2>
            <button className="pm-close-btn" onClick={onClose}>
              {Icons.Close}
            </button>
          </div>

          {activeTab === 'Profile' && (
            <div className="pm-profile-body">
              <div className="pm-avatar-container">
                <img src="/ref/gen-ai.jpg" alt="Profile" className="pm-avatar-img" />
                <button className="pm-edit-btn">Edit</button>
              </div>

              <div className="pm-form-row">
                <div className="pm-form-group">
                  <label>First Name</label>
                  <input type="text" defaultValue="Felix" />
                </div>
                <div className="pm-menu-dots-btn">
                  <button>{Icons.MenuDots}</button>
                </div>
                <div className="pm-form-group">
                  <label>Last Name</label>
                  <input type="text" defaultValue="Seeger" />
                </div>
              </div>

              <div className="pm-form-group pm-form-group-full">
                <label>Email</label>
                <input type="email" defaultValue="felixseeger@googlemail.com" />
              </div>

              <div className="pm-actions">
                <button className="pm-save-btn">Save changes</button>
                <button className="pm-delete-btn">Delete account</button>
              </div>

              <div className="pm-divider"></div>

              <div className="pm-security-section">
                <div className="pm-security-text">
                  <h3>Secure your account</h3>
                  <p>Enable two-factor authentication to add an extra layer of security to your account.</p>
                </div>
                <button className="pm-2fa-btn">Set up 2FA</button>
              </div>
            </div>
          )}
          
          
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

            <div className="pm-placeholder-body">
              <p>Content for {activeTab} goes here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
