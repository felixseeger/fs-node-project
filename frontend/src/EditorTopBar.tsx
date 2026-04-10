import { useState, FC } from 'react';
import ApiExportModal from './ApiExportModal';
import ProjectSettingsModal from './ProjectSettingsModal';

interface EditorTopBarProps {
  isPublic: boolean;
  onTogglePublic: (isPublic: boolean) => void;
  onSave: () => void;
  onSaveWithEmbeddedWorkflow?: () => void;
  onApiExport?: () => void;
  onExportJSON: () => void;
  onImportJSON: () => void;
  onScreenshot: () => void;
  onSaveAsTemplate?: () => void;
  onOpenKeyboardShortcuts?: () => void;
  projectName?: string;
  onRenameProject?: (name: string) => void;
}

export const EditorTopBar: FC<EditorTopBarProps> = ({
  isPublic,
  onTogglePublic,
  onSave,
  onSaveWithEmbeddedWorkflow,
  onApiExport,
  onExportJSON,
  onImportJSON,
  onScreenshot,
  onSaveAsTemplate,
  onOpenKeyboardShortcuts,
  projectName = '',
  onRenameProject,
}) => {
  const [showApiModal, setShowApiModal] = useState(false);
  const [showProjectSettings, setShowProjectSettings] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);

  return (
    <>
      <ProjectSettingsModal
        isOpen={showProjectSettings}
        onClose={() => setShowProjectSettings(false)}
        initialProjectName={projectName}
        onRenameProject={onRenameProject || (() => {})}
      />
      <ApiExportModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
      />

      <div
        style={{
          height: 48,
          background: 'transparent',
          borderBottom: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1100
        }}
      >
        {/* Left side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Public status toggle */}
          <button
            onClick={() => onTogglePublic?.(!isPublic)}
            title={isPublic ? "Make board private" : "Make board public"}
            style={{
              padding: '4px 8px',
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              background: isPublic ? 'var(--color-accent-soft)' : 'transparent',
              border: '1px solid',
              borderColor: isPublic ? 'var(--color-accent)' : 'var(--color-border)',
              borderRadius: 6,
              color: isPublic ? 'var(--color-accent)' : 'var(--color-text-dim)',
              cursor: 'pointer',
              marginRight: 8,
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: isPublic ? 'var(--color-accent)' : 'var(--color-text-dim)',
            }} />
            {isPublic ? 'Public' : 'Private'}
          </button>

          {/* Ready status */}
          <span style={{ fontSize: 12, color: 'var(--color-text-dim)', marginRight: 8 }}>Ready</span>

          <button
            type="button"
            onClick={() => setShowProjectSettings(true)}
            title="Project settings"
            style={{
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 600,
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              color: 'var(--color-text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-hover)';
              e.currentTarget.style.background = 'var(--color-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M8 10a2 2 0 100-4 2 2 0 000 4z"
                stroke="var(--color-text-dim)"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.6 9.9l-.3 1.7 1.5 1.5-1.7 1.7-1.9-.8a6.5 6.5 0 01-2.2 0l-1.9.8-1.7-1.7 1.5-1.5-.3-1.7a6.4 6.4 0 010-1.8l.3-1.7L2.5 6.6l1.7-1.7 1.9.8c.7-.4 1.4-.7 2.2-.8l.3-1.9h2.4l.3 1.9c.8.1 1.5.4 2.2.8l1.9-.8 1.7 1.7-1.5 1.5.3 1.7c.1.6.1 1.2 0 1.8z"
                stroke="var(--color-text-dim)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Project settings
          </button>

          {/* Save as Template */}
          <button
            onClick={() => onSaveAsTemplate?.()}
            style={{
              padding: '5px 14px',
              fontSize: 12,
              fontWeight: 600,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              color: 'var(--color-success)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-success)';
              e.currentTarget.style.background = 'var(--color-accent-soft)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.background = 'var(--color-surface)';
            }}
          >
            Save as Template
          </button>

          {/* Save with dropdown for embedded workflow option */}
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <div style={{ display: 'flex' }}>
              <button
                onClick={onSave}
                style={{
                  padding: '5px 8px 5px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRight: 'none',
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
                  color: 'var(--color-text-dim)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-text-muted)';
                  e.currentTarget.style.background = 'var(--color-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M13.5 15H2.5C1.67 15 1 14.33 1 13.5V2.5C1 1.67 1.67 1 2.5 1H11L15 5V13.5C15 14.33 14.33 15 13.5 15Z"
                    stroke="var(--color-text-dim)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
                  />
                  <path d="M11 1V5H15" stroke="var(--color-text-dim)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 9H12" stroke="var(--color-text-dim)" strokeWidth="1.3" strokeLinecap="round" />
                  <path d="M4 11.5H9" stroke="var(--color-text-dim)" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                Save
              </button>
              <button
                onClick={() => setShowSaveDropdown(!showSaveDropdown)}
                style={{
                  padding: '5px 6px',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderTopRightRadius: 6,
                  borderBottomRightRadius: 6,
                  color: 'var(--color-text-dim)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-text-muted)';
                  e.currentTarget.style.background = 'var(--color-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="var(--color-text-dim)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            
            {/* Dropdown for Save with Embedded Workflow */}
            {showSaveDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 4,
                width: 240,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                zIndex: 1200,
                padding: '8px 0',
              }}>
                <button
                  onClick={() => {
                    setShowSaveDropdown(false);
                    if (onSaveWithEmbeddedWorkflow) {
                      onSaveWithEmbeddedWorkflow();
                    }
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text)',
                    fontSize: 12,
                    padding: '8px 16px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L14 8L8 14L2 8L8 2Z" stroke="var(--color-text)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 6L6 10" stroke="var(--color-text)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L10 10" stroke="var(--color-text)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Save with Embedded Workflow
                </button>
              </div>
            )}
          </div>

          {/* API */}
          <button
            onClick={() => {
              setShowApiModal(true);
              if (onApiExport) onApiExport();
            }}
            style={{
              padding: '5px 14px',
              fontSize: 12,
              fontWeight: 600,
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              color: 'var(--color-text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-hover)';
              e.currentTarget.style.background = 'var(--color-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M3.5 4L1 8L3.5 12" stroke="var(--color-text-dim)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12.5 4L15 8L12.5 12" stroke="var(--color-text-dim)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.5 3L6.5 13" stroke="var(--color-text-dim)" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            API
          </button>

          {/* Import JSON (download arrow — into app) */}
          <button
            onClick={onImportJSON}
            title="Import JSON"
            style={{
              padding: '5px 8px',
              fontSize: 12,
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              color: 'var(--color-text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-hover)';
              e.currentTarget.style.background = 'var(--color-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2V11" stroke="var(--color-text-dim)" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M4.5 7.5L8 11L11.5 7.5" stroke="var(--color-text-dim)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 14H13" stroke="var(--color-text-dim)" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>

          {/* Export JSON (upload arrow — out of app) */}
          <button
            onClick={onExportJSON}
            title="Export JSON"
            style={{
              padding: '5px 8px',
              fontSize: 12,
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              color: 'var(--color-text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-hover)';
              e.currentTarget.style.background = 'var(--color-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 11V2" stroke="var(--color-text-dim)" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M4.5 5.5L8 2L11.5 5.5" stroke="var(--color-text-dim)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 14H13" stroke="var(--color-text-dim)" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>

          {/* Screenshot (canvas PNG) */}
          <button
            onClick={onScreenshot}
            title="Take Screenshot (Cmd/Ctrl+Shift+S)"
            style={{
              padding: '5px 8px',
              fontSize: 12,
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              color: 'var(--color-text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-hover)';
              e.currentTarget.style.background = 'var(--color-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="var(--color-text-dim)" strokeWidth="1.2" />
              <circle cx="8" cy="8" r="2.5" stroke="var(--color-text-dim)" strokeWidth="1.2" />
              <path d="M5 3V1.8" stroke="var(--color-text-dim)" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M11 3V1.8" stroke="var(--color-text-dim)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
          
          {/* Keyboard Shortcuts */}
          <button
            onClick={onOpenKeyboardShortcuts}
            title="Keyboard Shortcuts (Cmd/Cmd+.)"
            style={{
              padding: '5px 8px',
              fontSize: 12,
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              color: 'var(--color-text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-hover)';
              e.currentTarget.style.background = 'var(--color-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="6" width="12" height="4" rx="1" stroke="var(--color-text-dim)" strokeWidth="1.2" />
              <path d="M4 10H3" stroke="var(--color-text-dim)" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M13 10H12" stroke="var(--color-text-dim)" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M5 12L4 13" stroke="var(--color-text-dim)" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M11 12L12 13" stroke="var(--color-text-dim)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default EditorTopBar;
