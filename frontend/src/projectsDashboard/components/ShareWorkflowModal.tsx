import React, { type FC, type Dispatch, type SetStateAction, useState, useRef, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '../../config/firebase';
import type { ShareModalState } from '../types';
import { truncate } from '../utils';

export interface ShareWorkflowModalProps {
  shareModal: ShareModalState;
  shareEmail: string;
  setShareEmail: Dispatch<SetStateAction<string>>;
  setShareModal: Dispatch<SetStateAction<ShareModalState | null>>;
  onShareWorkflow?: (projectId: string, email: string) => Promise<void> | void;
  onUnshareWorkflow?: (projectId: string, email: string) => Promise<void> | void;
}

interface SharedUserProfile {
  email: string;
  displayName?: string;
  photoURL?: string;
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const ShareWorkflowModal: FC<ShareWorkflowModalProps> = ({
  shareModal,
  shareEmail,
  setShareEmail,
  setShareModal,
  onShareWorkflow,
  onUnshareWorkflow,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [userProfiles, setUserProfiles] = useState<Record<string, SharedUserProfile>>({});
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);

  // Clear messages when modal opens/closes
  useEffect(() => {
    setError(null);
    setSuccessMsg(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [shareModal.projectId]);

  // Fetch profiles for users already in sharedWith
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!shareModal.sharedWith || shareModal.sharedWith.length === 0) return;
      if (!isFirebaseConfigured()) return;
      
      setIsLoadingProfiles(true);
      const db = getDb();
      const newProfiles: Record<string, SharedUserProfile> = { ...userProfiles };
      let hasNew = false;
      
      try {
        const emailsToFetch = shareModal.sharedWith.filter(email => !newProfiles[email]);
        
        if (emailsToFetch.length > 0) {
          // Chunk into 10s for 'in' query
          const chunks = [];
          for (let i = 0; i < emailsToFetch.length; i += 10) {
            chunks.push(emailsToFetch.slice(i, i + 10));
          }
          
          for (const chunk of chunks) {
            const q = query(collection(db, 'users'), where('email', 'in', chunk));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              if (data.email) {
                newProfiles[data.email] = {
                  email: data.email,
                  displayName: data.displayName,
                  photoURL: data.photoURL || data.avatarUri
                };
                hasNew = true;
              }
            });
          }
        }
        
        if (hasNew) {
          setUserProfiles(newProfiles);
        }
      } catch (err) {
        console.error('Error fetching user profiles:', err);
      } finally {
        setIsLoadingProfiles(false);
      }
    };
    
    fetchProfiles();
  }, [shareModal.sharedWith]);

  const addShare = async () => {
    setError(null);
    setSuccessMsg(null);
    const email = shareEmail.trim().toLowerCase();

    if (!email) {
      setError('Please enter an email address.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (shareModal.sharedWith?.includes(email)) {
      setError('This workflow is already shared with this email.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isFirebaseConfigured()) {
        const db = getDb();
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError(`No user found with email ${email}`);
          setIsSubmitting(false);
          return;
        }
        
        // Add to our local profiles cache so it shows up immediately
        const userData = querySnapshot.docs[0].data();
        setUserProfiles(prev => ({
          ...prev,
          [email]: {
            email: userData.email || email,
            displayName: userData.displayName,
            photoURL: userData.photoURL || userData.avatarUri
          }
        }));
      }

      if (onShareWorkflow) {
        await onShareWorkflow(shareModal.projectId, email);
      }
      
      setShareModal((prev) =>
        prev
          ? {
              ...prev,
              sharedWith: [...(prev.sharedWith || []), email],
            }
          : null
      );
      setShareEmail('');
      setSuccessMsg(`Workflow shared with ${email}`);
    } catch (err: any) {
      console.error('Error sharing workflow:', err);
      setError(err.message || 'Failed to share workflow. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeShare = async (email: string) => {
    setError(null);
    setSuccessMsg(null);
    setRemovingEmail(email);

    try {
      if (onUnshareWorkflow) {
        await onUnshareWorkflow(shareModal.projectId, email);
      }
      
      setShareModal((prev) => {
        if (!prev) return null;
        const list = Array.isArray(prev.sharedWith) ? prev.sharedWith : [];
        return { ...prev, sharedWith: list.filter((e) => e !== email) };
      });
      setSuccessMsg(`Revoked access for ${email}`);
    } catch (err: any) {
      console.error('Error unsharing workflow:', err);
      setError(err.message || 'Failed to revoke access. Please try again.');
    } finally {
      setRemovingEmail(null);
    }
  };

  return (
    <>
      <div
        role="presentation"
        onClick={() => !isSubmitting && setShareModal(null)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 6000,
          transition: 'opacity 0.2s ease-in-out',
        }}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-labelledby="share-modal-title"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 420,
          backgroundColor: 'var(--color-bg, #1a1a1a)',
          border: '1px solid var(--color-border, #333)',
          borderRadius: 12,
          padding: 24,
          zIndex: 6001,
          color: 'var(--color-text, #fff)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h3 id="share-modal-title" style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 600 }}>Share Workflow</h3>
        
        <form 
          onSubmit={(e) => { e.preventDefault(); addShare(); }}
          style={{ display: 'flex', gap: 8, marginBottom: 16 }}
        >
          <input
            ref={inputRef}
            type="email"
            value={shareEmail}
            onChange={(e) => {
              setShareEmail(e.target.value);
              if (error) setError(null);
              if (successMsg) setSuccessMsg(null);
            }}
            placeholder="Enter email address..."
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '10px 12px',
              fontSize: 14,
              backgroundColor: 'var(--color-surface, #222)',
              border: `1px solid ${error ? '#ef4444' : 'var(--color-border, #333)'}`,
              borderRadius: 6,
              color: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s',
              opacity: isSubmitting ? 0.7 : 1,
            }}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? "share-error" : undefined}
          />
          <button
            type="submit"
            disabled={isSubmitting || !shareEmail.trim()}
            style={{
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 600,
              backgroundColor: isSubmitting || !shareEmail.trim() ? 'var(--color-border, #444)' : '#5ee7df',
              color: isSubmitting || !shareEmail.trim() ? '#888' : '#0b0e1a',
              border: 'none',
              borderRadius: 6,
              cursor: isSubmitting || !shareEmail.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            {isSubmitting ? (
              <>
                <div style={{
                  width: 14,
                  height: 14,
                  border: '2px solid rgba(0,0,0,0.1)',
                  borderTop: '2px solid currentColor',
                  borderRadius: '50%',
                  animation: 'node-spin 1s linear infinite'
                }} />
                <span>Sharing...</span>
              </>
            ) : 'Share'}
          </button>
        </form>

        {error && (
          <div id="share-error" style={{ color: '#ef4444', fontSize: 13, marginBottom: 16, marginTop: -8 }}>
            {error}
          </div>
        )}
        
        {successMsg && !error && (
          <div style={{ color: '#10b981', fontSize: 13, marginBottom: 16, marginTop: -8 }}>
            {successMsg}
          </div>
        )}

        {shareModal.sharedWith && shareModal.sharedWith.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 11,
                color: 'var(--color-text-muted, #888)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>Shared with ({shareModal.sharedWith.length})</span>
              {isLoadingProfiles && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#5ee7df' }}>
                  <div style={{
                    width: 10,
                    height: 10,
                    border: '1.5px solid rgba(94, 231, 223, 0.2)',
                    borderTop: '1.5px solid currentColor',
                    borderRadius: '50%',
                    animation: 'node-spin 1s linear infinite'
                  }} />
                  <span>Loading profiles...</span>
                </div>
              )}
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 6, 
              maxHeight: 220, 
              overflowY: 'auto',
              paddingRight: 4 // for scrollbar
            }}>
              {shareModal.sharedWith.map((email) => (
                <div
                  key={email}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: 'var(--color-surface, rgba(255,255,255,0.04))',
                    borderRadius: 6,
                    border: '1px solid var(--color-border, rgba(255,255,255,0.06))',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', maxWidth: '75%' }}>
                    {userProfiles[email]?.photoURL ? (
                      <img 
                        src={userProfiles[email].photoURL} 
                        alt={userProfiles[email].displayName || email} 
                        style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{ 
                        width: 28, 
                        height: 28, 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--color-border, #444)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: '#fff',
                        flexShrink: 0
                      }}>
                        {(userProfiles[email]?.displayName || email).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      {userProfiles[email]?.displayName && (
                        <span style={{ fontSize: 13, color: 'var(--color-text, #fff)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {userProfiles[email].displayName}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: userProfiles[email]?.displayName ? 11 : 13,
                          color: userProfiles[email]?.displayName ? 'var(--color-text-muted, #888)' : 'var(--color-text, #ccc)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={email}
                      >
                        {truncate(email, 35)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeShare(email)}
                    disabled={removingEmail === email || isSubmitting}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: removingEmail === email ? '#888' : '#ef4444',
                      fontSize: 12,
                      cursor: removingEmail === email || isSubmitting ? 'not-allowed' : 'pointer',
                      padding: '4px 8px',
                      borderRadius: 4,
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (removingEmail !== email && !isSubmitting) {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    aria-label={`Remove access for ${email}`}
                  >
                    {removingEmail === email ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button
            type="button"
            onClick={() => setShareModal(null)}
            disabled={isSubmitting}
            style={{
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 500,
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border, #444)',
              borderRadius: 6,
              color: 'var(--color-text, #fff)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
};
