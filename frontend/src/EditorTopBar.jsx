import { useState } from 'react';
import ApiExportModal from './ApiExportModal';

export default function EditorTopBar({ onSave, onApiExport, onExportJSON, onImportJSON, onSaveAsTemplate }) {
  const [showApiModal, setShowApiModal] = useState(false);

  return (
    <>
      <ApiExportModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
      />

      <div
        style={{
          height: 48,
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
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
          {/* Ready status */}
          <span style={{ fontSize: 12, color: 'var(--color-text-dim)', marginRight: 8 }}>Ready</span>

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
              e.currentTarget.style.background = 'var(--color-accent-soft)'; // Using accent-soft as a placeholder or success-soft if added
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.background = 'var(--color-surface)';
            }}
          >
            Save as Template
          </button>

          {/* Save */}
          <button
            onClick={onSave}
            style={{
              padding: '5px 14px',
              fontSize: 12,
              fontWeight: 600,
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 6,
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
        </div>
      </div>
    </>
  );
}
