jsx = """import React, { useState } from 'react';
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
          
          {activeTab !== 'Profile' && (
            <div className="pm-placeholder-body">
              <p>Content for {activeTab} goes here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"""

css = """
.pm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.pm-modal {
  display: flex;
  width: 800px;
  height: 560px;
  background: #111111;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
  font-family: 'Inter', system-ui, sans-serif;
}

.pm-sidebar {
  width: 240px;
  background: #1a1a1a;
  border-right: 1px solid #2a2a2a;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pm-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pm-section-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #777;
  margin-bottom: 8px;
  padding-left: 12px;
  font-weight: 600;
}

.pm-nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #a0a0a0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.pm-nav-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
}

.pm-nav-btn.active {
  background: #2a2a2a;
  color: #ffffff;
}

.pm-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pm-icon svg {
  width: 16px;
  height: 16px;
}

.pm-content-area {
  flex: 1;
  padding: 32px 40px;
  background: #111111;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.pm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.pm-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.pm-close-btn {
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.pm-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.pm-close-btn svg {
  width: 20px;
  height: 20px;
}

.pm-profile-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pm-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.pm-avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #333;
}

.pm-edit-btn {
  background: transparent;
  border: none;
  color: #a0a0a0;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
}

.pm-edit-btn:hover {
  text-decoration: underline;
  color: #fff;
}

.pm-form-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.pm-form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.pm-form-group-full {
  width: 100%;
}

.pm-form-group label {
  font-size: 13px;
  font-weight: 500;
  color: #a0a0a0;
}

.pm-form-group input {
  background: transparent;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 10px 12px;
  color: #e0e0e0;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;
}

.pm-form-group input:focus {
  border-color: #555;
}

.pm-menu-dots-btn {
  display: flex;
  padding-bottom: 10px;
}

.pm-menu-dots-btn button {
  background: #ef4444;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}

.pm-menu-dots-btn button svg {
  width: 14px;
  height: 14px;
}

.pm-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.pm-save-btn {
  background: #333;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.pm-save-btn:hover {
  background: #444;
}

.pm-delete-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
}

.pm-delete-btn:hover {
  color: #dc2626;
  text-decoration: underline;
}

.pm-divider {
  height: 1px;
  background: #2a2a2a;
  width: 100%;
  margin: 8px 0;
}

.pm-security-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.pm-security-text h3 {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  margin: 0 0 6px 0;
}

.pm-security-text p {
  font-size: 13px;
  color: #888;
  margin: 0;
  line-height: 1.4;
  max-width: 320px;
}

.pm-2fa-btn {
  background: #333;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
}

.pm-2fa-btn:hover {
  background: #444;
}

.pm-placeholder-body {
  color: #888;
  font-size: 14px;
}
"""

with open("frontend/src/ProfileModal.jsx", "w") as f:
    f.write(jsx)

with open("frontend/src/ProfileModal.css", "w") as f:
    f.write(css)
