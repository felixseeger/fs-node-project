import { useState, useEffect, useRef, type FC, type ReactElement, type ChangeEvent } from 'react';
import './ProfileModal.css';
import { getFirebaseAuth } from './config/firebase';
import { updateEmail, updatePassword, deleteUser, type User } from 'firebase/auth';
import { useUser } from './hooks/useUser';
import { useBilling } from './hooks/useBilling';
import { PRICING_CATALOG } from './config/pricing';
import { type UpdateProfilePayload } from './types/user';
import AvatarCropper from './components/AvatarCropper';

interface IconsType {
  [key: string]: ReactElement;
}

const Icons: IconsType = {
  Profile: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Account: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  Preferences: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  People: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Usage: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"></path></svg>,
  Plans: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
  Close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  MenuDots: <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>
};

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MessageState {
  type: 'success' | 'error';
  text: string;
}

export const ProfileModal: FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [croppedAvatarDataUrl, setCroppedAvatarDataUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const { profile, updateProfile: updateFirestoreProfile, updateAvatar } = useUser(user?.uid || null);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Preference States
  const [perfMode, setPerfMode] = useState(false);
  const [snapGrid, setSnapGrid] = useState(true);
  const [promptImp, setPromptImp] = useState(true);
  const [legacyAssets, setLegacyAssets] = useState(false);
  const [creditBal, setCreditBal] = useState(true);
  const [dashBehavior, setDashBehavior] = useState<'new-tab' | 'current-tab'>('new-tab');
  const [varBehavior, setVarBehavior] = useState<'history' | 'canvas'>('history');
  const [mmBehavior, setMmBehavior] = useState<'canvas' | 'history'>('canvas');
  const [defaultModels, setDefaultModels] = useState<any>({});

  const [isLoading, setIsLoading] = useState(false);
  const { balance, transactions, loading: billingLoading } = useBilling(user?.uid || null);
  const [message, setMessage] = useState<MessageState | null>(null);
  const [activeTab, setActiveTab] = useState('Profile');

  useEffect(() => {
    if (isOpen) {
      const auth = getFirebaseAuth();
      if (auth?.currentUser) {
        setUser(auth.currentUser);
        setEmail(auth.currentUser.email || '');
      }
      setMessage(null);
      setNewPassword('');
      setCroppedAvatarDataUrl(null);
      setIsCropping(false);
      setImageToCrop(null);
    }
  }, [isOpen]);

  // Sync state with firestore profile
  useEffect(() => {
    if (profile) {
      const parts = (profile.displayName || '').split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setAvatar(profile.photoURL || null);
      setBio(profile.bio || '');
      if (profile.socialLinks) {
        setWebsite(profile.socialLinks.website || '');
        setTwitter(profile.socialLinks.twitter || '');
        setGithub(profile.socialLinks.github || '');
        setLinkedin(profile.socialLinks.linkedin || '');
      }
      if (profile.preferences) {
        setPerfMode(profile.preferences.performanceMode);
        setSnapGrid(profile.preferences.snapToGrid);
        setPromptImp(profile.preferences.promptImprover);
        setLegacyAssets(profile.preferences.showLegacyAssets);
        setCreditBal(profile.preferences.showCreditBalance);
        setDashBehavior(profile.preferences.dashboardOpenBehavior);
        setVarBehavior(profile.preferences.variationBehavior);
        setMmBehavior(profile.preferences.multiModelBehavior);
        setDefaultModels(profile.preferences.defaultModels || {});
      }
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    setMessage(null);
    try {
      const newDisplayName = `${firstName} ${lastName}`.trim();

      // Update Firestore Profile
      const profileUpdates: UpdateProfilePayload = { 
        displayName: newDisplayName,
        bio,
        socialLinks: {
          website,
          twitter,
          github,
          linkedin
        },
        preferences: {
          performanceMode: perfMode,
          snapToGrid: snapGrid,
          promptImprover: promptImp,
          showLegacyAssets: legacyAssets,
          showCreditBalance: creditBal,
          dashboardOpenBehavior: dashBehavior,
          variationBehavior: varBehavior,
          multiModelBehavior: mmBehavior,
          defaultModels
        }
      };
      await updateFirestoreProfile(profileUpdates);

      // Handle Avatar Upload if file selected
      if (croppedAvatarDataUrl) {
        await updateAvatar(croppedAvatarDataUrl);
        setCroppedAvatarDataUrl(null);
      }

      if (email !== user.email) {
        await updateEmail(user, email);
      }
      if (newPassword) {
        await updatePassword(user, newPassword);
      }
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      setNewPassword('');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update. You may need to log out and log back in.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      if (user) {
        try {
          await deleteUser(user);
          onClose();
        } catch (err: any) {
          console.error('Delete account error:', err);
          setMessage({ type: 'error', text: `Error deleting account: ${err.message}. You may need to log out and log back in.` });
        }
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImageToCrop(ev.target.result as string);
          setIsCropping(true);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleCropComplete = (croppedImage: string) => {
    setAvatar(croppedImage);
    setCroppedAvatarDataUrl(croppedImage);
    setIsCropping(false);
    setImageToCrop(null);
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setImageToCrop(null);
  };

  const handleDefaultModelChange = (key: string, value: string) => {
    setDefaultModels((prev: any) => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="pm-overlay" onClick={onClose} role="presentation" tabIndex={-1}>
      <div className="pm-modal" onClick={e => e.stopPropagation()}>

        {/* Sidebar */}
        <div className="pm-sidebar">
          <div className="pm-section">
            <div className="pm-section-title">Account</div>
            <button className={`pm-nav-btn ${activeTab === 'Profile' ? 'active' : ''}`} onClick={() => setActiveTab('Profile')}>
              <span className="pm-icon">{Icons.Profile}</span> Profile
            </button>
            <button className={`pm-nav-btn ${activeTab === 'Account' ? 'active' : ''}`} onClick={() => setActiveTab('Account')}>
              <span className="pm-icon">{Icons.Account}</span> Account
            </button>
            <button className={`pm-nav-btn ${activeTab === 'Preferences' ? 'active' : ''}`} onClick={() => setActiveTab('Preferences')}>
              <span className="pm-icon">{Icons.Preferences}</span> Preferences
            </button>
          </div>

          <div className="pm-section">
            <div className="pm-section-title">Workspace</div>
            <button className={`pm-nav-btn ${activeTab === 'Settings' ? 'active' : ''}`} onClick={() => setActiveTab('Settings')}>
              <span className="pm-icon">{Icons.Settings}</span> Settings
            </button>
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
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
                {avatar ? (
                  <img src={avatar} alt="Profile" className="pm-avatar-img" />
                ) : (
                  <div className="pm-avatar-placeholder">{(firstName[0] || '') + (lastName[0] || '') || 'U'}</div>
                )}
                <button className="pm-edit-btn" onClick={handleAvatarClick}>Edit Avatar</button>
              </div>

              <div className="pm-form-group pm-form-group-full">
                <label>Biography</label>
                <textarea 
                  className="pm-textarea" 
                  value={bio} 
                  onChange={e => setBio(e.target.value)} 
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="pm-divider"></div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: '16px 0 8px 0' }}>Social Links</h3>

              <div className="pm-form-group pm-form-group-full">
                <label>Website</label>
                <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourwebsite.com" />
              </div>

              <div className="pm-form-row">
                <div className="pm-form-group">
                  <label>Twitter</label>
                  <input type="text" value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="@username" />
                </div>
                <div className="pm-form-group">
                  <label>GitHub</label>
                  <input type="text" value={github} onChange={e => setGithub(e.target.value)} placeholder="username" />
                </div>
              </div>

              <div className="pm-form-group pm-form-group-full">
                <label>LinkedIn</label>
                <input type="text" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="username or profile URL" />
              </div>

              {message && activeTab === 'Profile' && (
                <div style={{
                  padding: '12px', borderRadius: '8px', marginTop: '16px',
                  background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  color: message.type === 'error' ? '#ef4444' : '#22c55e',
                  border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                  fontSize: '13px'
                }}>
                  {message.text}
                </div>
              )}

              <div className="pm-actions">
                <button className="pm-save-btn" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Account' && (
            <div className="pm-profile-body">
              <div className="pm-form-row">
                <div className="pm-form-group">
                  <label>First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" />
                </div>
                <div className="pm-form-group">
                  <label>Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" />
                </div>
              </div>

              <div className="pm-form-group pm-form-group-full">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" />
              </div>

              <div className="pm-form-group pm-form-group-full" style={{ marginTop: 12 }}>
                <label>New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Leave blank to keep current password" />
              </div>

              {message && activeTab === 'Account' && (
                <div style={{
                  padding: '12px', borderRadius: '8px', marginTop: '16px',
                  background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  color: message.type === 'error' ? '#ef4444' : '#22c55e',
                  border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                  fontSize: '13px'
                }}>
                  {message.text}
                </div>
              )}

              <div className="pm-actions">
                <button className="pm-save-btn" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save changes'}
                </button>
                <button className="pm-delete-btn" onClick={handleDeleteAccount} disabled={isLoading}>
                  Delete account
                </button>
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
                    <input type="checkbox" checked={perfMode} onChange={e => setPerfMode(e.target.checked)} />
                    <span className="pm-slider"></span>
                  </label>
                </div>

                <div className="pm-pref-row">
                  <div className="pm-pref-text">
                    <label>Snap to Grid</label>
                    <span>If enabled, nodes will snap to the editor grid</span>
                  </div>
                  <label className="pm-toggle">
                    <input type="checkbox" checked={snapGrid} onChange={e => setSnapGrid(e.target.checked)} />
                    <span className="pm-slider"></span>
                  </label>
                </div>

                <div className="pm-pref-row">
                  <div className="pm-pref-text">
                    <label>Background Prompt Improver</label>
                    <span>Automatically optimize prompts for each model behind the scenes during generation</span>
                  </div>
                  <label className="pm-toggle">
                    <input type="checkbox" checked={promptImp} onChange={e => setPromptImp(e.target.checked)} />
                    <span className="pm-slider"></span>
                  </label>
                </div>

                <div className="pm-pref-row">
                  <div className="pm-pref-text">
                    <label>Show Legacy Assets Folder</label>
                    <span>Controls visibility of the Legacy assets migration folder in Library</span>
                  </div>
                  <label className="pm-toggle">
                    <input type="checkbox" checked={legacyAssets} onChange={e => setLegacyAssets(e.target.checked)} />
                    <span className="pm-slider"></span>
                  </label>
                </div>

                <div className="pm-pref-row">
                  <div className="pm-pref-text">
                    <label>Show Credit Balance</label>
                    <span>Display your remaining credit balance in the credits indicator</span>
                  </div>
                  <label className="pm-toggle">
                    <input type="checkbox" checked={creditBal} onChange={e => setCreditBal(e.target.checked)} />
                    <span className="pm-slider"></span>
                  </label>
                </div>

                <div className="pm-pref-row">
                  <div className="pm-pref-text">
                    <label>Open dashboard projects</label>
                    <span>Choose whether projects from the dashboard open in a new tab or the current tab</span>
                  </div>
                  <select className="pm-select" value={dashBehavior} onChange={e => setDashBehavior(e.target.value as any)}>
                    <option value="new-tab">New tab</option>
                    <option value="current-tab">Current tab</option>
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
                  <select className="pm-select" value={varBehavior} onChange={e => setVarBehavior(e.target.value as any)}>
                    <option value="history">In node history</option>
                    <option value="canvas">On canvas</option>
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
                  <select className="pm-select" value={mmBehavior} onChange={e => setMmBehavior(e.target.value as any)}>
                    <option value="canvas">On canvas</option>
                    <option value="history">In node history</option>
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
                    <select className="pm-select" value={defaultModels.textToText} onChange={e => handleDefaultModelChange('textToText', e.target.value)}>
                      <option>Claude Sonnet 4.6</option>
                      <option>GPT-4o</option>
                      <option>Gemini 1.5 Pro</option>
                      <option>Claude Opus 4.1</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Image to text</label>
                    <select className="pm-select" value={defaultModels.imageToText} onChange={e => handleDefaultModelChange('imageToText', e.target.value)}>
                      <option>Claude Sonnet 4.6</option>
                      <option>GPT-4o</option>
                      <option>Gemini 1.5 Pro</option>
                      <option>Claude Opus 4.1</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Video to text</label>
                    <select className="pm-select" value={defaultModels.videoToText} onChange={e => handleDefaultModelChange('videoToText', e.target.value)}>
                      <option>Claude Sonnet 4.6</option>
                      <option>GPT-4o</option>
                      <option>Gemini 1.5 Pro</option>
                      <option>Claude Opus 4.1</option>
                    </select>
                  </div>
                </div>

                <div className="pm-pref-subsection">
                  <h4>Image</h4>
                  <p className="pm-pref-subdesc">Choose default image models</p>

                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Text to image</label>
                    <select className="pm-select" value={defaultModels.textToImage} onChange={e => handleDefaultModelChange('textToImage', e.target.value)}>
                      <option>Flux 2</option>
                      <option>Nano Banana 2</option>
                      <option>Midjourney v6</option>
                      <option>DALL-E 3</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Image to image</label>
                    <select className="pm-select" value={defaultModels.imageToImage} onChange={e => handleDefaultModelChange('imageToImage', e.target.value)}>
                      <option>Flux 2</option>
                      <option>Nano Banana 2</option>
                      <option>Midjourney v6</option>
                      <option>DALL-E 3</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Images to image</label>
                    <select className="pm-select" value={defaultModels.imagesToImage} onChange={e => handleDefaultModelChange('imagesToImage', e.target.value)}>
                      <option>Flux 2</option>
                      <option>Nano Banana 2</option>
                      <option>Midjourney v6</option>
                      <option>DALL-E 3</option>
                    </select>
                  </div>
                </div>

                <div className="pm-pref-subsection">
                  <h4>Video</h4>
                  <p className="pm-pref-subdesc">Choose default video models</p>

                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Text to video</label>
                    <select className="pm-select" value={defaultModels.textToVideo} onChange={e => handleDefaultModelChange('textToVideo', e.target.value)}>
                      <option>Seedance 1.5 Pro</option>
                      <option>Veo 3.1 Frames</option>
                      <option>Veo 3.1 Ingredients</option>
                      <option>Kling O1 Edit</option>
                      <option>Sora</option>
                      <option>Runway Gen-4</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Image to video</label>
                    <select className="pm-select" value={defaultModels.imageToVideo} onChange={e => handleDefaultModelChange('imageToVideo', e.target.value)}>
                      <option>Seedance 1.5 Pro</option>
                      <option>Veo 3.1 Frames</option>
                      <option>Veo 3.1 Ingredients</option>
                      <option>Kling O1 Edit</option>
                      <option>Sora</option>
                      <option>Runway Gen-4</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>First frame last frame</label>
                    <select className="pm-select" value={defaultModels.firstFrameLastFrame} onChange={e => handleDefaultModelChange('firstFrameLastFrame', e.target.value)}>
                      <option>Seedance 1.5 Pro</option>
                      <option>Veo 3.1 Frames</option>
                      <option>Veo 3.1 Ingredients</option>
                      <option>Kling O1 Edit</option>
                      <option>Sora</option>
                      <option>Runway Gen-4</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Images to video</label>
                    <select className="pm-select" value={defaultModels.imagesToVideo} onChange={e => handleDefaultModelChange('imagesToVideo', e.target.value)}>
                      <option>Seedance 1.5 Pro</option>
                      <option>Veo 3.1 Frames</option>
                      <option>Veo 3.1 Ingredients</option>
                      <option>Kling O1 Edit</option>
                      <option>Sora</option>
                      <option>Runway Gen-4</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Video to video</label>
                    <select className="pm-select" value={defaultModels.videoToVideo} onChange={e => handleDefaultModelChange('videoToVideo', e.target.value)}>
                      <option>Seedance 1.5 Pro</option>
                      <option>Veo 3.1 Frames</option>
                      <option>Veo 3.1 Ingredients</option>
                      <option>Kling O1 Edit</option>
                      <option>Sora</option>
                      <option>Runway Gen-4</option>
                    </select>
                  </div>
                  <div className="pm-pref-row pm-pref-row-compact">
                    <label>Mixed to video</label>
                    <select className="pm-select" value={defaultModels.mixedToVideo} onChange={e => handleDefaultModelChange('mixedToVideo', e.target.value)}>
                      <option>Seedance 1.5 Pro</option>
                      <option>Veo 3.1 Frames</option>
                      <option>Veo 3.1 Ingredients</option>
                      <option>Kling O1 Edit</option>
                      <option>Sora</option>
                      <option>Runway Gen-4</option>
                    </select>
                  </div>
                </div>
              </div>

              {message && activeTab === 'Preferences' && (
                <div style={{
                  padding: '12px', borderRadius: '8px', marginTop: '16px',
                  background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  color: message.type === 'error' ? '#ef4444' : '#22c55e',
                  border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                  fontSize: '13px'
                }}>
                  {message.text}
                </div>
              )}

              <div className="pm-actions">
                <button className="pm-save-btn" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>

            </div>
          )}


          {activeTab === 'Settings' && (
            <div className="pm-preferences-body">
              <div className="pm-form-row">
                <button className="pm-save-btn" style={{ background: '#1a1a1a', border: '1px solid #333', color: '#e0e0e0' }}>Leave workspace</button>
              </div>

              <div className="pm-security-section" style={{ marginTop: '16px' }}>
                <div className="pm-security-text" style={{ maxWidth: '100%' }}>
                  <h3 style={{ fontSize: '18px' }}>Model Access Control</h3>
                  <p style={{ fontSize: '14px' }}>Control which models are available in your workspace. Restricted models are completely hidden from member workflows and can't be accessed.</p>
                </div>
              </div>

              <div className="pm-sectionBody" style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '16px', border: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="pm-pref-row">
                  <div className="pm-pref-text">
                    <label style={{ fontSize: '14px' }}>New model behavior</label>
                    <span style={{ fontSize: '13px' }}>Models will <strong style={{ color: '#00FF7F', fontWeight: '500' }}>automatically</strong> be added to the list when released</span>
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

          
          {activeTab === 'Plans' && (
            <div className="pm-profile-body">
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', margin: '0 0 8px 0', color: '#fff' }}>Current Balance</h3>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#00FF7F' }}>
                  {billingLoading ? '...' : balance.toLocaleString()} <span style={{fontSize: '16px', color: '#999', fontWeight: '400'}}>Credits</span>
                </div>
                <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>
                  Credits are used to run AI nodes. You are currently on the Free tier.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button className="pm-save-btn" style={{ flex: 'none', width: 'auto' }}>Upgrade Plan</button>
                  <button className="pm-edit-btn" style={{ flex: 'none', width: 'auto' }}>Buy Credits</button>
                </div>
              </div>

              <div className="pm-divider"></div>

              <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', color: '#fff' }}>Pricing Catalog</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {Object.values(PRICING_CATALOG).map(item => (
                  <div key={item.id} style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#999', margin: '4px 0 8px 0' }}>{item.category.toUpperCase()}</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#00FF7F' }}>{item.baseCost} cr</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Usage' && (
            <div className="pm-profile-body">
              <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', color: '#fff' }}>Recent Transactions</h3>
              {transactions.length === 0 ? (
                <p style={{ color: '#999', fontSize: '14px' }}>No recent transactions.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #333', textAlign: 'left', color: '#999' }}>
                      <th style={{ padding: '8px' }}>Date</th>
                      <th style={{ padding: '8px' }}>Description</th>
                      <th style={{ padding: '8px' }}>Type</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => {
                       const date = typeof tx.createdAt === 'string' ? new Date(tx.createdAt) : tx.createdAt?.toDate?.() || new Date();
                       return (
                      <tr key={tx.id} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '12px 8px', color: '#ccc' }}>{date.toLocaleDateString()}</td>
                        <td style={{ padding: '12px 8px', color: '#fff' }}>{tx.description}</td>
                        <td style={{ padding: '12px 8px', color: '#999' }}>{tx.type}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600', color: tx.amount > 0 ? '#00FF7F' : '#E0E0E0' }}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              )}
            </div>
          )}


          {activeTab !== 'Profile' && activeTab !== 'Account' && activeTab !== 'Preferences' && activeTab !== 'Settings' && activeTab !== 'Plans' && activeTab !== 'Usage' && (

            <div className="pm-placeholder-body">
              <p>Content for {activeTab} goes here.</p>
            </div>
          )}
        </div>
      </div>
      {isCropping && imageToCrop && (
        <AvatarCropper
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default ProfileModal;
