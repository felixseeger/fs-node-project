import React from 'react';
import { createPortal } from 'react-dom';

const InfoIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const TrashIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const ChevronDownIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default function NodePropertyEditor({ node, onUpdate, onDelete, isChatOpen }) {
  if (!node) return null;

  const styles = {
    panelContainer: {
      position: 'absolute',
      top: '350px',
      right: isChatOpen ? '350px' : '20px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#E0E0E0',
      width: '260px',
      zIndex: 1000,
      transition: 'right 0.3s ease, top 0.3s ease',
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    sectionHeader: {
      backgroundColor: '#2a2a2a',
      borderRadius: '8px',
      padding: '10px 14px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid #3a3a3a',
    },
    sectionBody: {
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      padding: '12px 14px',
      border: '1px solid #3a3a3a',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleText: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#E0E0E0',
    },
    labelText: {
      fontSize: '11px',
      color: '#999',
      marginBottom: '4px',
    },
    valueText: {
      fontSize: '12px',
      color: '#E0E0E0',
    },
    input: {
      width: '100%',
      background: '#2a2a2a',
      border: '1px solid #3a3a3a',
      borderRadius: '4px',
      padding: '6px 8px',
      color: '#fff',
      fontSize: '12px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    button: {
      background: 'transparent',
      border: 'none',
      color: '#999',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      borderRadius: '4px',
      transition: 'background 0.2s, color 0.2s',
    },
    deleteButton: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '6px',
      color: '#ef4444',
      padding: '8px 12px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '8px',
      transition: 'all 0.2s ease',
    }
  };

  return createPortal(
    <div style={styles.panelContainer} className="node-property-editor">
      <div style={styles.wrapper}>
        {/* Header Section */}
        <div style={styles.sectionHeader}>
          <span style={styles.titleText}>Node Inspector</span>
          <InfoIcon style={{ color: '#999' }} />
        </div>

        {/* Content Section */}
        <div style={styles.sectionBody}>
          {/* Label Field */}
          <div>
            <div style={styles.labelText}>NODE LABEL</div>
            <input 
              style={styles.input}
              value={node.data.label || ''} 
              onChange={(e) => onUpdate(node.id, { label: e.target.value })}
              placeholder="Enter node label..."
            />
          </div>

          {/* Type Info */}
          <div style={styles.row}>
            <div>
              <div style={styles.labelText}>TYPE</div>
              <div style={styles.valueText}>{node.type}</div>
            </div>
            <div>
              <div style={styles.labelText}>STATUS</div>
              <div style={{ ...styles.valueText, color: '#22c55e' }}>Connected</div>
            </div>
          </div>

          {/* ID Field (readonly) */}
          <div>
            <div style={styles.labelText}>UNIQUE ID</div>
            <div style={{ ...styles.valueText, fontSize: '10px', color: '#666', background: '#111', padding: '4px 8px', borderRadius: '4px', border: '1px solid #222' }}>
              {node.id}
            </div>
          </div>

          {/* Actions */}
          <button 
            style={styles.deleteButton} 
            onClick={() => onDelete(node.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
            }}
          >
            <TrashIcon />
            Delete Node
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
