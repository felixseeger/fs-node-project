import { useState } from 'react';
import ApiExportModal from './ApiExportModal';

export default function EditorTopBar({ onSave, onApiExport, onExportJSON, onImportJSON }) {
  const [showApiModal, setShowApiModal] = useState(false);

  return (
    <>
      <ApiExportModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
      />

      <div
        style={{
          height: 40,
          background: '#111',
          borderBottom: '1px solid #1e1e1e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0,
        }}
      >
        {/* Left side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Ready status */}
          <span style={{ fontSize: 12, color: '#777', marginRight: 8 }}>Ready</span>

          {/* Save */}
          <button
            onClick={onSave}
            style={{
              padding: '5px 14px',
              fontSize: 12,
              fontWeight: 600,
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: 6,
              color: '#ccc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#555';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.5 15H2.5C1.67 15 1 14.33 1 13.5V2.5C1 1.67 1.67 1 2.5 1H11L15 5V13.5C15 14.33 14.33 15 13.5 15Z"
                stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
              />
              <path d="M11 1V5H15" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 9H12" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M4 11.5H9" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" />
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
              border: '1px solid #333',
              borderRadius: 6,
              color: '#ccc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#555';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M3.5 4L1 8L3.5 12" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12.5 4L15 8L12.5 12" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.5 3L6.5 13" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" />
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
              border: '1px solid #333',
              borderRadius: 6,
              color: '#ccc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#555';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2V11" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M4.5 7.5L8 11L11.5 7.5" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 14H13" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" />
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
              border: '1px solid #333',
              borderRadius: 6,
              color: '#ccc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#555';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 11V2" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M4.5 5.5L8 2L11.5 5.5" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 14H13" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Right side — Credits + User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Credits badge */}
          <div style={{
            padding: '4px 14px',
            fontSize: 12,
            fontWeight: 600,
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 16,
            color: '#22c55e',
            whiteSpace: 'nowrap',
          }}>
            ~$0.01 · 1,400 credits
          </div>

          {/* User */}
          <div style={{
            padding: '4px 12px',
            fontSize: 12,
            fontWeight: 500,
            background: 'transparent',
            border: '1px solid #333',
            borderRadius: 16,
            color: '#ccc',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
          }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="5.5" r="3" stroke="#aaa" strokeWidth="1.3" />
              <path d="M2.5 14.5C2.5 11.5 5 9.5 8 9.5C11 9.5 13.5 11.5 13.5 14.5" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Admin
          </div>
        </div>
      </div>
    </>
  );
}
