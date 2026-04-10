import type { FC, Dispatch, SetStateAction } from 'react';
import type { ShareModalState } from '../types';
import { truncate } from '../utils';

export interface ShareWorkflowModalProps {
  shareModal: ShareModalState;
  shareEmail: string;
  setShareEmail: Dispatch<SetStateAction<string>>;
  setShareModal: Dispatch<SetStateAction<ShareModalState | null>>;
  onShareWorkflow?: (projectId: string, email: string) => void;
  onUnshareWorkflow?: (projectId: string, email: string) => void;
}

export const ShareWorkflowModal: FC<ShareWorkflowModalProps> = ({
  shareModal,
  shareEmail,
  setShareEmail,
  setShareModal,
  onShareWorkflow,
  onUnshareWorkflow,
}) => {
  const addShare = () => {
    const email = shareEmail.trim();
    if (!email) return;
    onShareWorkflow?.(shareModal.projectId, email);
    setShareModal((prev) =>
      prev
        ? {
            ...prev,
            sharedWith: [...(prev.sharedWith || []), email.toLowerCase()],
          }
        : null,
    );
    setShareEmail('');
  };

  return (
    <>
      <div
        role="presentation"
        onClick={() => setShareModal(null)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 6000,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          backgroundColor: 'var(--color-bg, #1a1a1a)',
          border: '1px solid var(--color-border, #333)',
          borderRadius: 12,
          padding: 24,
          zIndex: 6001,
          color: 'var(--color-text, #fff)',
        }}
      >
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Share Workflow</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="email"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            placeholder="Enter email address..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && shareEmail.trim()) addShare();
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: 13,
              backgroundColor: 'var(--color-surface, #222)',
              border: '1px solid var(--color-border, #333)',
              borderRadius: 6,
              color: 'inherit',
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={addShare}
            style={{
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: 600,
              backgroundColor: '#5ee7df',
              color: '#0b0e1a',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Share
          </button>
        </div>

        {shareModal.sharedWith && shareModal.sharedWith.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 11,
                color: 'var(--color-text-muted, #888)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Shared with ({shareModal.sharedWith.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
              {shareModal.sharedWith.map((email) => (
                <div
                  key={email}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    backgroundColor: 'var(--color-surface, rgba(255,255,255,0.04))',
                    borderRadius: 6,
                    border: '1px solid var(--color-border, rgba(255,255,255,0.06))',
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--color-text, #ccc)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: 240,
                    }}
                    title={email}
                  >
                    {truncate(email, 32)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onUnshareWorkflow?.(shareModal.projectId, email);
                      setShareModal((prev) => {
                        if (!prev) return null;
                        const list = Array.isArray(prev.sharedWith) ? prev.sharedWith : [];
                        return { ...prev, sharedWith: list.filter((e) => e !== email) };
                      });
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: 11,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => setShareModal(null)}
            style={{
              padding: '8px 16px',
              fontSize: 12,
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border, #333)',
              borderRadius: 6,
              color: 'var(--color-text, #ccc)',
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
};
