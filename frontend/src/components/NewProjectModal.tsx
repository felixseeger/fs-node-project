import React, { useCallback, useEffect, useRef, useState, FC, ReactNode, ChangeEvent } from 'react';

const iconWrap: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 10,
  border: '1px solid var(--color-border, #3a3a3a)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: 'var(--color-text, #e0e0e0)',
  background: 'var(--color-surface-sunken, #1a1a1a)',
};

const IconPlus: FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconFolder: FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const IconGrid: FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const IconSparkles: FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

const IconBook: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconDiscord: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const IconX: FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IconWaitlist: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

interface ActionCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  badge?: ReactNode;
  onClick: () => void;
  testId?: string;
}

const ActionCard: FC<ActionCardProps> = ({ icon, title, subtitle, badge, onClick, testId }) => {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        width: '100%',
        padding: '18px 16px',
        textAlign: 'left',
        border: '1px solid var(--color-border, #3a3a3a)',
        borderRadius: 12,
        background: 'var(--color-surface, #2a2a2a)',
        color: 'var(--color-text, #e0e0e0)',
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-surface-hover, #333)';
        e.currentTarget.style.borderColor = 'var(--color-border-hover, #4a4a4a)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-surface, #2a2a2a)';
        e.currentTarget.style.borderColor = 'var(--color-border, #3a3a3a)';
      }}
    >
      <div style={iconWrap}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
          {badge}
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-text-muted, #9ca3af)', marginTop: 4 }}>{subtitle}</div>
      </div>
    </button>
  );
};

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewProject?: () => void;
  onImportFile?: (file: File) => void;
  onTemplates?: () => void;
  onPromptSubmit?: (text: string) => void;
}

const NewProjectModal: FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onNewProject,
  onImportFile,
  onTemplates,
  onPromptSubmit,
}) => {
  const [view, setView] = useState<'menu' | 'prompt'>('menu');
  const [promptText, setPromptText] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setView('menu');
      setPromptText('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const triggerImport = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file || !onImportFile) return;
      onImportFile(file);
    },
    [onImportFile]
  );

  const handlePromptSend = useCallback(() => {
    const t = promptText.trim();
    if (!t || !onPromptSubmit) return;
    onPromptSubmit(t);
  }, [promptText, onPromptSubmit]);

  if (!isOpen) return null;

  const betaBadge = (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.5,
        padding: '2px 8px',
        borderRadius: 999,
        background: '#3b82f6',
        color: '#fff',
      }}
    >
      BETA
    </span>
  );

  const footerLinkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 13,
    color: 'var(--color-text-muted, #9ca3af)',
    textDecoration: 'none',
    marginBottom: 10,
  };

  return (
    <div
      role="presentation"
      data-testid="new-project-modal"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-project-modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(920px, 100%)',
          maxHeight: 'min(90vh, 640px)',
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          border: '1px solid var(--color-border, #3a3a3a)',
          background: 'var(--color-bg-elevated, #222)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          data-testid="new-project-modal-file-input"
          onChange={handleFileChange}
        />

        <div
          style={{
            flex: '0 0 42%',
            minWidth: 260,
            padding: '40px 36px',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--color-surface-sunken, #1a1a1a)',
            borderRight: '1px solid var(--color-border-subtle, #2a2a2a)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <img src="/logo-light.svg" alt="Brand Logo" style={{ height: 32, width: 'auto', flexShrink: 0 }} />
            <h1
              id="new-project-modal-title"
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 700,
                color: 'var(--color-text, #e0e0e0)',
                letterSpacing: -0.02,
              }}
            >
              Nodespace
            </h1>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.55,
              color: 'var(--color-text-muted, #9ca3af)',
              flex: 1,
            }}
          >
            A node based workflow editor for generative AI pipelines. Connect nodes to build pipelines that transform and
            generate images, video, audio and 3D assets.
          </p>
          <nav style={{ marginTop: 32 }}>
            <a href="#" style={footerLinkStyle} onClick={(e) => e.preventDefault()}>
              <IconBook />
              Docs
            </a>
            <a href="#" style={footerLinkStyle} onClick={(e) => e.preventDefault()}>
              <IconDiscord />
              Discord
            </a>
            <a href="#" style={footerLinkStyle} onClick={(e) => e.preventDefault()}>
              <IconX />
              Willie
            </a>
            <a href="#" style={{ ...footerLinkStyle, marginBottom: 0 }} onClick={(e) => e.preventDefault()}>
              <IconWaitlist />
              NB Pro Waitlist
            </a>
          </nav>
        </div>

        <div
          style={{
            flex: 1,
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minWidth: 0,
            position: 'relative',
          }}
        >
          <button
            type="button"
            aria-label="Close"
            data-testid="new-project-modal-close"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {view === 'menu' ? (
            <>
              <ActionCard
                testId="new-project-modal-confirm-new"
                icon={<IconPlus />}
                title="New project"
                subtitle="Start a new workflow"
                onClick={onNewProject!}
              />
              <ActionCard
                testId="new-project-modal-load-workflow"
                icon={<IconFolder />}
                title="Load workflow"
                subtitle="Open existing file"
                onClick={triggerImport}
              />
              <ActionCard
                testId="new-project-modal-templates"
                icon={<IconGrid />}
                title="Templates"
                subtitle="Pre-built workflows"
                onClick={onTemplates!}
              />
              <ActionCard
                testId="new-project-modal-prompt-workflow"
                icon={<IconSparkles />}
                title="Prompt a workflow"
                subtitle="Get Gemini to build it"
                badge={betaBadge}
                onClick={() => setView('prompt')}
              />
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, paddingTop: 8 }}>
              <button
                type="button"
                data-testid="new-project-modal-prompt-back"
                onClick={() => setView('menu')}
                style={{
                  alignSelf: 'flex-start',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  fontSize: 13,
                  padding: '4px 0',
                }}
              >
                ← Back
              </button>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }} htmlFor="new-project-prompt-input">
                Describe the workflow
              </label>
              <textarea
                id="new-project-prompt-input"
                data-testid="new-project-modal-prompt-textarea"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="e.g. A pipeline that upscales an image then generates a short video from it…"
                rows={8}
                style={{
                  flex: 1,
                  minHeight: 160,
                  resize: 'vertical',
                  padding: 12,
                  borderRadius: 10,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-input, #1a1a1a)',
                  color: 'var(--color-text)',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                }}
              />
              <button
                type="button"
                data-testid="new-project-modal-prompt-submit"
                disabled={!promptText.trim()}
                onClick={handlePromptSend}
                style={{
                  padding: '12px 20px',
                  borderRadius: 10,
                  border: 'none',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: promptText.trim() ? 'pointer' : 'not-allowed',
                  background: promptText.trim() ? '#3b82f6' : 'var(--color-border)',
                  color: promptText.trim() ? '#fff' : 'var(--color-text-muted)',
                }}
              >
                Generate workflow
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal;
