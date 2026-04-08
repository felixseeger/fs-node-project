import React, { useState } from 'react';
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

const ChevronDownIcon = ({ style, expanded }) => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ ...style, transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const SearchIcon = ({ style }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PublishIcon = ({ style, active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? "#3b82f6" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M15 3h6v6"></path>
    <path d="M10 14 21 3"></path>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
  </svg>
);

const InEndPointSearch = ({ value, onChange, placeholder = "Search parameters..." }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '4px 8px',
    marginBottom: '8px'
  }}>
    <SearchIcon style={{ color: '#666' }} />
    <input 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'transparent',
        border: 'none',
        color: '#fff',
        fontSize: '11px',
        outline: 'none',
        flex: 1
      }}
    />
  </div>
);

export default function NodePropertyEditor({ node, onUpdate, onDelete, isChatOpen }) {
  const [isPointsExpanded, setIsPointsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!node) return null;

  const styles = {
    panelContainer: {
      position: 'absolute',
      top: '350px',
      right: '25px',
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
    }
  };

  const availablePoints = Object.keys(node.data)
    .filter(key => {
      const internalKeys = [
        'label', 'onUpdate', 'onDisconnect', 'onGenerate', 'onEdit', 
        'hasConnection', 'getConnectionInfo', 'resolveInput', 'isGenerating', 
        'executionProgress', 'executionStatus', 'executionMessage', 'publishedPoints',
        'triggerGenerate', 'outputError', 'isLoading'
      ];
      return !internalKeys.includes(key);
    });

  const filteredPoints = availablePoints.filter(key => 
    key.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          <div style={{ height: '1px', backgroundColor: '#3a3a3a', margin: '4px 0' }} />

          {/* API In-Out Points Section */}
          <div>
            <div 
              onClick={() => setIsPointsExpanded(!isPointsExpanded)}
              style={{ 
                ...styles.titleText, 
                marginBottom: isPointsExpanded ? '10px' : '0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ChevronDownIcon expanded={isPointsExpanded} style={{ color: '#666' }} />
                API IN-OUT POINTS
                <span style={{ fontSize: '10px', fontWeight: '400', color: '#666' }}>
                  ({availablePoints.length})
                </span>
              </div>
            </div>
            
            {isPointsExpanded && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                <InEndPointSearch value={searchQuery} onChange={setSearchQuery} />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                  {filteredPoints.map(key => {
                    const isPublished = node.data.publishedPoints?.includes(key);
                    const isOutput = key.startsWith('output');
                    
                    return (
                      <div key={key} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        backgroundColor: '#222',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #333'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                          <div style={{ 
                            width: '6px', 
                            height: '6px', 
                            borderRadius: '50%', 
                            backgroundColor: isOutput ? '#ec4899' : '#3b82f6',
                            flexShrink: 0
                          }} />
                          <span style={{ fontSize: '11px', color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={key}>{key}</span>
                        </div>
                        
                        <button 
                          onClick={() => {
                            const currentPoints = node.data.publishedPoints || [];
                            const newPoints = isPublished 
                              ? currentPoints.filter(p => p !== key)
                              : [...currentPoints, key];
                            onUpdate(node.id, { publishedPoints: newPoints });
                          }}
                          style={{
                            background: isPublished ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                            border: isPublished ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid #444',
                            borderRadius: '3px',
                            color: isPublished ? '#3b82f6' : '#666',
                            fontSize: '9px',
                            padding: '2px 6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            flexShrink: 0
                          }}
                        >
                          <PublishIcon active={isPublished} style={{ width: '10px', height: '10px' }} />
                          {isPublished ? 'PUBLISHED' : 'PUBLISH'}
                        </button>
                      </div>
                    );
                  })}
                  
                  {availablePoints.length === 0 && (
                    <div style={{ fontSize: '11px', color: '#555', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>
                      No API points available
                    </div>
                  )}

                  {availablePoints.length > 0 && filteredPoints.length === 0 && (
                    <div style={{ fontSize: '11px', color: '#555', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>
                      No matching results
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
